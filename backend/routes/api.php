<?php

use \Illuminate\Support\Facades\Route;

use App\Http\Controllers\ApiNomenclatureController;
use App\Http\Controllers\ApiOfferController;
use App\Http\Controllers\ApiPolicyController;
use App\Http\Controllers\VehicleController;

Route::post('/vehicles/process-registration-document', [VehicleController::class, 'processRegistrationDocument']);
Route::get('/vehicle', [VehicleController::class, 'getVehicleLight']);
Route::get('/countries', [ApiNomenclatureController::class, 'getCountries']);
Route::get('/counties', [ApiNomenclatureController::class, 'getCounties']);
Route::get('/cities/{county_code}', [ApiNomenclatureController::class, 'getCities']);

Route::post('/offer', [ApiOfferController::class, 'getOffers']);
Route::get('/offer/{offerId}', [ApiOfferController::class, 'getOfferPdf']);

Route::post('/policy', [ApiPolicyController::class, 'getPolicy']);
