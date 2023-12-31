<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PlinkController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::controller(PlinkController::class)->group(function () {
    Route::get('/', 'index')->name('plink.index');
    Route::post('/', 'store')->name('plink.store');
    Route::get('/{plink:uuid}', 'show')->name('plink.show');
});
