<?php


\Illuminate\Support\Facades\Route::get('/countries', [\App\Http\Controllers\ApiAuthController::class, 'getCountries']);
\Illuminate\Support\Facades\Route::get('/counties', [\App\Http\Controllers\ApiAuthController::class, 'getCounties']);
\Illuminate\Support\Facades\Route::get('/cities/{county_code}', [\App\Http\Controllers\ApiAuthController::class, 'getCities']);
\Illuminate\Support\Facades\Route::post('/offer', [\App\Http\Controllers\ApiAuthController::class, 'getOffers']);
\Illuminate\Support\Facades\Route::get('/offer/{offerId}', [\App\Http\Controllers\ApiAuthController::class, 'getOfferPdf']);
\Illuminate\Support\Facades\Route::post('/policy', [\App\Http\Controllers\ApiAuthController::class, 'getPolicy']);
