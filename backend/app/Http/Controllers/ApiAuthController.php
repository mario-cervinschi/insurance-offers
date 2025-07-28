<?php

namespace App\Http\Controllers;

use App\Models\InsurrerOfferDTO;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ApiAuthController extends Controller
{
    public static function getToken()
    {
        $cachedToken = Cache::get('token');

        if (!$cachedToken) {
            $cachedToken = self::regenerateToken();
        }

        return $cachedToken;
    }

    public static function regenerateToken()
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
}
