<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ApiPolicyController extends Controller
{
    public function getPolicy(Request $request)
    {
        $token = ApiAuthController::getToken();
        $data = $request->all();

        $letters = strtoupper(Str::random(4));
        $numbers = str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        $data['payment']['documentNumber'] = 'DOC-' . $letters . $numbers;

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
        ])->post(config('services.lifeishard.api_url') . 'policy', $data);

        $policyId = $response->json()['data']['policies'][0]['policyId'];

        $response = Http::withoutVerifying()->withHeaders([
            'Token' => $token,
        ])->get(config('services.lifeishard.api_url') . "policy/{$policyId}");

        return response()->json([
            'status' => $response->status(),
            'body' => $response->json()['data']['files']
        ]);
    }
}
