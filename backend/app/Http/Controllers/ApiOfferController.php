<?php

namespace App\Http\Controllers;

use App\Models\InsurrerOfferDTO;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiOfferController extends Controller
{
    private $insurers = ["asirom", "allianz", "axeria", "generali", "groupama", "hellas_autonom", "hellas_nextins", "omniasig", "grawe", "eazy_insure"];

    public function getOffers(Request $request)
    {
        set_time_limit(90);
        $productData = $request->all();
        $offersToReturn = [];

        foreach ($this->insurers as $insurer) {
            $insurerResult = $this->getOfferForInsurer($insurer, $productData);

            if (!$insurerResult['error'] &&
                isset($insurerResult['data']['data']['offers']) &&
                !empty($insurerResult['data']['data']['offers'])) {

                foreach ($insurerResult['data']['data']['offers'] as $offer) {
                    $dto = new InsurrerOfferDTO($insurerResult['data']['data'], $offer);
                    $offersToReturn[] = $dto->toArray();
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
        $token = ApiAuthController::getToken();

        $payload = [
            "provider" => [
                "organization" => ["businessName" => $insurerCode],
                "authentication" => ["account" => "", "password" => "", "code" => ""]
            ],
            "product" => $body
        ];

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
            'Content-Type' => 'application/json',
        ])->post(config('services.lifeishard.api_url') . 'offer', $payload);

        if ($response->successful()) {
            return ['error' => false, 'data' => $response->json()];
        }

        return $response->json();
    }

    public function getOfferPdf($offerId)
    {
        $token = ApiAuthController::getToken();

        $response = Http::withoutVerifying()->withHeaders(['Token' => $token])
            ->get(config('services.lifeishard.api_url') . "offer/{$offerId}");

        if ($response->successful()) {
            return $response->json()['data']['files'];
        }

        abort(500, 'Failed to fetch PDF');
    }
}
