<?php

use App\Http\Controllers\DashboardController;
use App\Http\Middleware\EnsureValidInvitation;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;

Route::redirect('/', '/login')->name('home');

Route::middleware(['web', EnsureValidInvitation::class])->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
