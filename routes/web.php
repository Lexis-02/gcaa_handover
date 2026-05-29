<?php

use App\Http\Controllers\BatchController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserInvitationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HandoverGuideController;
use App\Http\Controllers\HandoverSignOffController;
use App\Http\Controllers\Lookups\BuildingController;
use App\Http\Controllers\Lookups\DepartmentController;
use App\Http\Controllers\Lookups\LookupValueController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfilePageController;
use App\Http\Controllers\PcHandoverController;
use App\Http\Controllers\SummaryController;
use App\Http\Controllers\PcRegisterController;
use App\Http\Controllers\InsightController;
use App\Http\Middleware\EnsureValidInvitation;
use App\Http\Controllers\RegisterInvitationController;

Route::redirect('/', '/login')->name('home');

Route::redirect('/register', '/login')->name('register.redirect');

Route::middleware(['web', EnsureValidInvitation::class])->group(function () {
    Route::get('/register/{invitation}', [RegisterInvitationController::class, 'create'])->name('register');
    Route::post('/register/{invitation}', [RegisterInvitationController::class, 'store'])->name('register.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('register-clerk/dashboard', [DashboardController::class, 'index'])->name('clerk.dashboard');

    Route::get('profile', [ProfilePageController::class, 'show'])->name('profile.index');
    Route::patch('profile', [ProfilePageController::class, 'update'])->name('profile.update');

    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('notifications/poll', [NotificationController::class, 'poll'])->name('notifications.poll');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.read');

    Route::resource('batches', BatchController::class);
    Route::get('users/invitations', [UserInvitationController::class, 'index'])
        ->name('users.invitations.index');
    Route::post('users/invitations', [UserInvitationController::class, 'store'])
        ->name('users.invitations.store');
    Route::delete('users/invitations/{invitation}', [UserInvitationController::class, 'destroy'])
        ->name('users.invitations.destroy');
    Route::resource('users', UserController::class);

    Route::resource('pc-register', PcRegisterController::class)
        ->parameters(['pc-register' => 'pc_register']);

    Route::get('handover-sign-offs', [HandoverSignOffController::class, 'index'])
        ->name('handover-sign-offs.index');
    Route::post('pc-register/{pc_register}/sign-off', [HandoverSignOffController::class, 'store'])
        ->name('pc-register.sign-off.store');
    Route::get('handover-guide', [HandoverGuideController::class, 'show'])
        ->name('handover.guide');

    Route::get('pc-handover', [PcHandoverController::class, 'index'])
        ->name('pc-handover.index');
    Route::get('pc-handover/create', [PcHandoverController::class, 'create'])
        ->name('pc-handover.create');
    Route::post('pc-handover', [PcHandoverController::class, 'store'])
        ->name('pc-handover.store');
    Route::get('pc-handover/{pc_handover}', [PcHandoverController::class, 'show'])
        ->name('pc-handover.show');
    Route::get('pc-handover/{pc_handover}/edit', [PcHandoverController::class, 'edit'])
        ->name('pc-handover.edit');
    Route::put('pc-handover/{pc_handover}', [PcHandoverController::class, 'update'])
        ->name('pc-handover.update');

    Route::get('summary', [SummaryController::class, 'index'])->name('summary.index');

    Route::prefix('insights')->name('insights.')->group(function () {
        Route::get('/', [InsightController::class, 'index'])->name('index');
        Route::get('/export/pdf', [InsightController::class, 'exportPdf'])->name('export.pdf');
        Route::get('/export/excel', [InsightController::class, 'exportExcel'])->name('export.excel');
    });

    Route::prefix('lookups')->name('lookups.')->group(function () {
        Route::resource('departments', DepartmentController::class);
        Route::resource('buildings', BuildingController::class);

        Route::prefix('values/{type}')
            ->where(['type' => 'pc-conditions|old-pc-conditions|yes-no|operating-systems'])
            ->group(function () {
                Route::get('/', [LookupValueController::class, 'index'])->name('values.index');
                Route::get('/create', [LookupValueController::class, 'create'])->name('values.create');
                Route::post('/', [LookupValueController::class, 'store'])->name('values.store');
                Route::get('/{lookup_value}', [LookupValueController::class, 'show'])->name('values.show');
                Route::get('/{lookup_value}/edit', [LookupValueController::class, 'edit'])->name('values.edit');
                Route::put('/{lookup_value}', [LookupValueController::class, 'update'])->name('values.update');
                Route::delete('/{lookup_value}', [LookupValueController::class, 'destroy'])->name('values.destroy');
            });
    });
});

require __DIR__.'/settings.php';
