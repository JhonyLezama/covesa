<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Status;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    use AuthorizesRequests;

    /**
     * Solo lectura/gestión: los leads nacen en los formularios públicos
     * (Semana 6), no hay creación manual desde el CMS.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Lead::class);

        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'status_id' => ['nullable', 'integer'],
            'source' => ['nullable', 'string', 'max:255'],
            'assigned' => ['nullable', 'integer'],
        ]);

        $user = $request->user();
        $isManager = $user->can('manage-leads');

        $leads = Lead::with(['status:id,name,color', 'advisor:id,name'])
            // Comercial: solo los asignados a él.
            ->when(! $isManager, fn ($q) => $q->where('assigned_user_id', $user->id))
            ->when($validated['q'] ?? null, fn ($q, $term) => $q->where(
                fn ($w) => $w->where('first_name', 'like', "%{$term}%")
                    ->orWhere('last_name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%")
                    ->orWhere('phone', 'like', "%{$term}%")
            ))
            ->when($validated['status_id'] ?? null, fn ($q, $sid) => $q->where('status_id', $sid))
            ->when($validated['source'] ?? null, fn ($q, $source) => $q->where('source', $source))
            ->when(
                $isManager ? ($validated['assigned'] ?? null) : null,
                fn ($q, $aid) => $q->where('assigned_user_id', $aid)
            )
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Lead $lead) => [
                'id' => $lead->id,
                'name' => trim($lead->first_name.' '.$lead->last_name),
                'email' => $lead->email,
                'phone' => $lead->phone,
                'source' => $lead->source,
                'created' => $lead->created_at->format('d/m/Y'),
                'status' => $lead->status ? ['name' => $lead->status->name, 'color' => $lead->status->color] : null,
                'advisor' => $lead->advisor?->name,
            ]);

        return Inertia::render('Admin/Leads/Index', [
            'leads' => $leads,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'status_id' => $validated['status_id'] ?? '',
                'source' => $validated['source'] ?? '',
                'assigned' => $validated['assigned'] ?? '',
            ],
            'statuses' => Status::where('type', 'lead')->where('is_active', true)->orderBy('order')->get(['id', 'name']),
            'sources' => Lead::distinct()->orderBy('source')->pluck('source')->all(),
            'advisors' => $isManager
                ? User::where('is_active', true)->orderBy('name')->get(['id', 'name'])
                : [],
            'isManager' => $isManager,
        ]);
    }

    public function show(Lead $lead): Response
    {
        $this->authorize('view', $lead);

        $lead->load(['status:id,name,color', 'advisor:id,name', 'property:id,title', 'project:id,name']);

        $user = request()->user();

        return Inertia::render('Admin/Leads/Show', [
            'lead' => [
                'id' => $lead->id,
                'name' => trim($lead->first_name.' '.$lead->last_name),
                'document' => $lead->document_type ? $lead->document_type.' '.$lead->document_number : null,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'location' => $lead->location,
                'source' => $lead->source,
                'message' => $lead->message,
                'extra_data' => $lead->extra_data ?? [],
                'notes' => $lead->notes,
                'created' => $lead->created_at->format('d/m/Y H:i'),
                'data_policy' => $lead->accepted_data_policy,
                'marketing_policy' => $lead->accepted_marketing_policy,
                'status' => $lead->status ? ['id' => $lead->status->id, 'name' => $lead->status->name, 'color' => $lead->status->color] : null,
                'advisor' => $lead->advisor ? ['id' => $lead->advisor->id, 'name' => $lead->advisor->name] : null,
                'property' => $lead->property?->title,
                'project' => $lead->project?->name,
            ],
            'statuses' => Status::where('type', 'lead')->where('is_active', true)->orderBy('order')->get(['id', 'name']),
            'advisors' => User::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'canReassign' => $user->can('reassign', $lead),
            'canChangeStatus' => $user->can('updateStatus', $lead),
        ]);
    }

    public function reassign(Request $request, Lead $lead): RedirectResponse
    {
        $this->authorize('reassign', $lead);

        $data = $request->validate([
            'assigned_user_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $lead->update(['assigned_user_id' => $data['assigned_user_id']]);

        return back()->with('success', 'Lead reasignado correctamente.');
    }

    public function updateStatus(Request $request, Lead $lead): RedirectResponse
    {
        $this->authorize('updateStatus', $lead);

        $data = $request->validate([
            'status_id' => [
                'required', 'integer',
                \Illuminate\Validation\Rule::exists('statuses', 'id')->where('type', 'lead'),
            ],
        ]);

        $lead->update(['status_id' => $data['status_id']]);

        return back()->with('success', 'Estado del lead actualizado.');
    }
}
