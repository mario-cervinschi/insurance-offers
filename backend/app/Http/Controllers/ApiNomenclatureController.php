<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiNomenclatureController extends Controller
{
    public function getCountries()
    {
        $token = ApiAuthController::getToken();
        $url = config('services.lifeishard.api_url') . 'nomenclature/country';

        return $this->fetchDataWithRetry($url, $token);
    }

    public function getCounties()
    {
        $token = ApiAuthController::getToken();
        $url = config('services.lifeishard.api_url') . 'nomenclature/county';

        return $this->fetchDataWithRetry($url, $token);
    }

    public function getCities($county_code)
    {
        $token = ApiAuthController::getToken();
        $url = config('services.lifeishard.api_url') . "nomenclature/locality/{$county_code}";

        return $this->fetchDataWithRetry($url, $token);
    }

    private function fetchDataWithRetry($url, $token)
    {
        $response = Http::withoutVerifying()->withHeaders(['Token' => $token])->get($url);

        if ($response->successful()) {
            return $response->json()['data'];
        }

        $token = ApiAuthController::regenerateToken();
        $response = Http::withoutVerifying()->withHeaders(['Token' => $token])->get($url);

        if ($response->successful()) {
            return $response->json()['data'];
        }

        abort(502, 'Failed to fetch data after token regeneration');
    }
}
