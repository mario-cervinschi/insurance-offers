<?php

namespace App\Http\Controllers;

use App\Models\InsurrerOfferDTO;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ApiAuthController extends Controller
{
    private $insurers = ["asirom", "allianz", "axeria", "generali", "groupama", "hellas_autonom", "hellas_nextins", "omniasig", "grawe", "eazy_insure"];

    public function getCountries()
    {
        $token = $this->getToken();

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
        ])->get(config('services.lifeishard.api_url') . 'nomenclature/country');

        if ($response->successful()) {
            return $response->json()['data'];
        }

        $token = $this->regenerateToken();

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
        ])->get(config('services.lifeishard.api_url') . 'nomenclature/country');

        if ($response->successful()) {
            return $response->json()['data'];
        }

        abort(502, 'Failed to fetch countries even after regenerating token');
    }

    private function getToken()
    {
        $cachedToken = Cache::get('token');

        if (!$cachedToken) {
            $cachedToken = $this->regenerateToken();
        }

        return $cachedToken;
    }

    private function regenerateToken()
    {
        $account = config('auth.lifeishard.account');
        $password = config('auth.lifeishard.password');

        $url = config('services.lifeishard.api_url') . "auth?account=$account&password=$password";

        $response = Http::withoutVerifying()->post($url);

        if ($response->successful()) {
            $token = $response->json()['data']['token'];

            Cache::put('token', $token, now()->addHours(23));

            return $token;
        }

        abort(500, 'Failed to get token');
    }

    public function getCounties()
    {
        $token = $this->getToken();

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
        ])->get(config('services.lifeishard.api_url') . 'nomenclature/county');

        if ($response->successful()) {
            return $response->json()['data'];
        }

        $token = $this->regenerateToken();

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
        ])->get(config('services.lifeishard.api_url') . 'nomenclature/county');

        if ($response->successful()) {
            return $response->json()['data'];
        }

        abort(500, 'Failed to fetch countries');
    }

    public function getCities($county_code)
    {
        $token = $this->getToken();

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
        ])->get(config('services.lifeishard.api_url') . "nomenclature/locality/{$county_code}");

        if ($response->successful()) {
            return $response->json()['data'];
        }

        abort(500, 'Failed to fetch countries');
    }

    public function getOffers(Request $request)
    {
        set_time_limit(90);
        $productData = $request->all();
        $offersToReturn = [];

        foreach ($this->insurers as $insurer) {
            $insurerResult = $this->getOfferForInsurer($insurer, $productData);
//            return response()->json($insurerResult);

            if (!$insurerResult['error'] &&
                isset($insurerResult['data']['data']['offers']) &&
                !empty($insurerResult['data']['data']['offers'])) {

                foreach ($insurerResult['data']['data']['offers'] as $offer) {
                    $offerDTO = new InsurrerOfferDTO($insurerResult['data']['data'], $offer);
                    $offersToReturn[] = $offerDTO->toArray();
                }
            } else {
                $offersToReturn[] = [
                    'error' => true,
                    'business' => $insurer,
                    'data' => $insurerResult['data'] ?? null,
                    'message' => $insurerResult['message'] ?? null,
                ];
            }
        }

        return response()->json($offersToReturn);
    }


    private function getOfferForInsurer($insurerCode, $body)
    {
        $token = $this->getToken();

        $newRequestBody = [
            "provider" => [
                "organization" => [
                    "businessName" => $insurerCode,
                ],
                "authentication" => [
                    "account" => "",
                    "password" => "",
                    "code" => ""
                ]
            ],
            "product" => $body
        ];

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
            'Content-Type' => 'application/json',
        ])->post(config('services.lifeishard.api_url') . 'offer', $newRequestBody);

        if ($response->successful()) {
            return [
                'error' => false,
                'data' => $response->json()
            ];
        }

        return $response->json();
    }

    public function getOfferPdf($offerId){
        $token = $this->getToken();

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
        ])->get(config('services.lifeishard.api_url') . "offer/{$offerId}");

        if ($response->successful()) {
            return $response->json()['data']['files'];
        }

        abort(500, 'Failed to fetch countries');
    }

}
