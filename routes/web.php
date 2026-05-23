<?php

use App\Http\Controllers\BatchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HandoverGuideController;
use App\Http\Controllers\HandoverSignOffController;
use App\Http\Controllers\Lookups\BuildingController;
use App\Http\Controllers\Lookups\DepartmentController;
use App\Http\Controllers\Lookups\LookupValueController;
use App\Http\Controllers\PcRegisterController;
use App\Http\Middleware\EnsureValidInvitation;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;

Route::redirect('/', '/login')->name('home');

Route::middleware(['web', EnsureValidInvitation::class])->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('batches', BatchController::class)->only(['index', 'create', 'store']);

    Route::resource('pc-register', PcRegisterController::class)
        ->parameters(['pc-register' => 'pc_register']);

    Route::get('handover-sign-offs', [HandoverSignOffController::class, 'index'])
        ->name('handover-sign-offs.index');
    Route::post('pc-register/{pc_register}/sign-off', [HandoverSignOffController::class, 'store'])
        ->name('pc-register.sign-off.store');
    Route::get('handover-guide', [HandoverGuideController::class, 'show'])
        ->name('handover.guide');

    Route::prefix('lookups')->name('lookups.')->group(function () {
        Route::resource('departments', DepartmentController::class);
        Route::resource('buildings', BuildingController::class);

        Route::prefix('values/{type}')
            ->where(['type' => 'pc-conditions|old-pc-conditions|yes-no'])
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
