<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use App\Models\Status;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ReferralController extends Controller
{
    use AuthorizesRequests;

    /**
     * Sin creación manual: los referidos nacen en el formulario público
     * "Refiere y Gana" (Semana 6).
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Referral::class);

        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'status_id' => ['nullable', 'integer'],
        ]);

        $user = $request->user();
        $isManager = $user->can('manage-leads');

        $referrals = Referral::with('status:id,name,color')
            ->when(! $isManager, fn ($q) => $q->where('referrer_user_id', $user->id))
            ->when($validated['q'] ?? null, fn ($q, $term) => $q->where(
                fn ($w) => $w->where('referrer_name', 'like', "%{$term}%")
                    ->orWhere('referred_name', 'like', "%{$term}%")
                    ->orWhere('code', 'like', "%{$term}%")
            ))
            ->when($validated['status_id'] ?? null, fn ($q, $sid) => $q->where('status_id', $sid))
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Referral $r) => [
                'id' => $r->id,
                'code' => $r->code,
                'referrer' => $r->referrer_name,
                'referred' => $r->referred_name,
                'commission' => $r->commission_amount
                    ? number_format((float) $r->commission_amount, 2)
                    : null,
                'paid' => (bool) $r->commission_paid_at,
                'status' => $r->status ? ['name' => $r->status->name, 'color' => $r->status->color] : null,
            ]);

        return Inertia::render('Admin/Referrals/Index', [
            'referrals' => $referrals,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'status_id' => $validated['status_id'] ?? '',
            ],
            'statuses' => Status::where('type', 'referral')->where('is_active', true)->orderBy('order')->get(['id', 'name']),
        ]);
    }

    public function show(Referral $referral): Response
    {
        $this->authorize('view', $referral);

        $referral->load(['status:id,name,color', 'referrer:id,name', 'property:id,title']);

        $user = request()->user();

        return Inertia::render('Admin/Referrals/Show', [
            'referral' => [
                'id' => $referral->id,
                'code' => $referral->code,
                'referrer_name' => $referral->referrer_name,
                'referrer_email' => $referral->referrer_email,
                'referrer_phone' => $referral->referrer_phone,
                'referrer_user' => $referral->referrer?->name,
                'referred_name' => $referral->referred_name,
                'referred_email' => $referral->referred_email,
                'referred_phone' => $referral->referred_phone,
                'property' => $referral->property?->title,
                'sale_amount' => $referral->sale_amount,
                'commission_percentage' => $referral->commission_percentage,
                'commission_amount' => $referral->commission_amount,
                'commission_paid_at' => $referral->commission_paid_at?->format('Y-m-d'),
                'status' => $referral->status ? ['id' => $referral->status->id, 'name' => $referral->status->name, 'color' => $referral->status->color] : null,
            ],
            'leads' => $referral->leads()->with('status:id,name')->orderByDesc('created_at')->get()
                ->map(fn ($lead) => [
                    'id' => $lead->id,
                    'name' => trim($lead->first_name.' '.$lead->last_name),
                    'email' => $lead->email,
                    'status' => $lead->status?->name,
                    'created' => $lead->created_at->format('d/m/Y'),
                ])->all(),
            'statuses' => Status::where('type', 'referral')->where('is_active', true)->orderBy('order')->get(['id', 'name']),
            'canChangeStatus' => $user->can('updateStatus', $referral),
            'canManageCommission' => $user->can('manageCommission', $referral),
        ]);
    }

    public function updateStatus(Request $request, Referral $referral): RedirectResponse
    {
        $this->authorize('updateStatus', $referral);

        $data = $request->validate([
            'status_id' => [
                'required', 'integer',
                Rule::exists('statuses', 'id')->where('type', 'referral'),
            ],
        ]);

        $referral->update(['status_id' => $data['status_id']]);

        return back()->with('success', 'Estado del referido actualizado.');
    }

    public function updateCommission(Request $request, Referral $referral): RedirectResponse
    {
        $this->authorize('manageCommission', $referral);

        $data = $request->validate([
            'sale_amount' => ['nullable', 'numeric', 'min:0'],
            'commission_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'commission_paid_at' => ['nullable', 'date'],
        ]);

        $referral->update([
            'sale_amount' => $data['sale_amount'] ?? null,
            'commission_percentage' => $data['commission_percentage'],
            'commission_amount' => isset($data['sale_amount'])
                ? round($data['sale_amount'] * $data['commission_percentage'] / 100, 2)
                : null,
            'commission_paid_at' => $data['commission_paid_at'] ?? null,
        ]);

        return back()->with('success', 'Comisión registrada correctamente.');
    }
}
