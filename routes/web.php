<?php

use App\Http\Controllers\Admin\BlogMediaController;
use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Admin\ReferralController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectMediaController;
use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\Admin\PropertyMediaController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PublicProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/contacto', [ContactController::class, 'store'])->name('contacto.store');
// Página institucional (contenido hardcodeado en React, sin tabla propia).
Route::get('/nosotros', [AboutController::class, 'index'])->name('nosotros');
// Landing mínima pública del proyecto (los badges flotantes apuntan aquí).
Route::get('/proyectos/{slug}', [PublicProjectController::class, 'show'])->name('proyectos.show');

// Auth manual: sin registro público. Los usuarios solo los crea el admin (Día 2) o los seeders.
Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Panel interno: todo /admin/* exige autenticación. El grano fino por permiso se aplica por ruta (Día 2).
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/', DashboardController::class)->name('dashboard');
    // Ajustes de apariencia (switch overlay del hero). Solo manage-settings, por código.
    Route::get('/ajustes', [SettingController::class, 'index'])->name('ajustes.index');
    Route::patch('/ajustes', [SettingController::class, 'update'])->name('ajustes.update');
    // Gestión de usuarios: la UserPolicy (permiso manage-users) bloquea por código.
    Route::patch('/usuarios/{user}/toggle', [UserController::class, 'toggleActive'])->name('usuarios.toggle');
    Route::resource('usuarios', UserController::class)->parameters(['usuarios' => 'user'])->except(['show']);
    // Propiedades (Día 3, sin imágenes): la PropertyPolicy limita al comercial a sus asignadas.
    Route::resource('propiedades', PropertyController::class)->parameters(['propiedades' => 'property'])->except(['show']);
    // Galería polimórfica de la propiedad (Día 4). Requiere manage-content vía PropertyPolicy.
    Route::post('/propiedades/{property}/media', [PropertyMediaController::class, 'store'])->name('propiedades.media.store');
    Route::patch('/propiedades/{property}/media/reorder', [PropertyMediaController::class, 'reorder'])->name('propiedades.media.reorder');
    Route::patch('/propiedades/{property}/media/{media}/featured', [PropertyMediaController::class, 'setFeatured'])->name('propiedades.media.featured');
    Route::delete('/propiedades/{property}/media/{media}', [PropertyMediaController::class, 'destroy'])->name('propiedades.media.destroy');
    // Proyectos (Semana 3 Día 1, sin imágenes): ProjectPolicy espeja a PropertyPolicy.
    Route::resource('proyectos', ProjectController::class)->parameters(['proyectos' => 'proyecto'])->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
    Route::get('/proyectos/{proyecto}', [ProjectController::class, 'show'])->name('proyectos.show');
    // Galería polimórfica del proyecto (Semana 3 Día 2): mismo trait que propiedades.
    Route::post('/proyectos/{proyecto}/media', [ProjectMediaController::class, 'store'])->name('proyectos.media.store');
    Route::patch('/proyectos/{proyecto}/media/reorder', [ProjectMediaController::class, 'reorder'])->name('proyectos.media.reorder');
    Route::patch('/proyectos/{proyecto}/media/{media}/featured', [ProjectMediaController::class, 'setFeatured'])->name('proyectos.media.featured');
    Route::delete('/proyectos/{proyecto}/media/{media}', [ProjectMediaController::class, 'destroy'])->name('proyectos.media.destroy');
    // Blog (Semana 3 Día 3): categoría como string simple, sin tabla aparte.
    Route::resource('blog', BlogPostController::class)->parameters(['blog' => 'post'])->except(['show']);
    Route::post('/blog/{post}/media', [BlogMediaController::class, 'store'])->name('blog.media.store');
    Route::patch('/blog/{post}/media/reorder', [BlogMediaController::class, 'reorder'])->name('blog.media.reorder');
    Route::patch('/blog/{post}/media/{media}/featured', [BlogMediaController::class, 'setFeatured'])->name('blog.media.featured');
    Route::delete('/blog/{post}/media/{media}', [BlogMediaController::class, 'destroy'])->name('blog.media.destroy');
    // Leads (Semana 3 Día 4, mini-CRM): sin creación manual; nacen en formularios públicos (Semana 6).
    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
    Route::get('/leads/{lead}', [LeadController::class, 'show'])->name('leads.show');
    Route::patch('/leads/{lead}/reassign', [LeadController::class, 'reassign'])->name('leads.reassign');
    Route::patch('/leads/{lead}/status', [LeadController::class, 'updateStatus'])->name('leads.status');
    // Referidos (Semana 3 Día 5): sin creación manual; nacen en "Refiere y Gana" (Semana 6).
    Route::get('/referidos', [ReferralController::class, 'index'])->name('referidos.index');
    Route::get('/referidos/{referral}', [ReferralController::class, 'show'])->name('referidos.show');
    Route::patch('/referidos/{referral}/status', [ReferralController::class, 'updateStatus'])->name('referidos.status');
    Route::patch('/referidos/{referral}/commission', [ReferralController::class, 'updateCommission'])->name('referidos.commission');
});
