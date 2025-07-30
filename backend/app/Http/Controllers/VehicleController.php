<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use thiagoalessio\TesseractOCR\TesseractOCR;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class VehicleController extends Controller
{
    public function processRegistrationDocument(Request $request)
    {
        $request->validate([
            'document' => 'required|image|max:10240',
        ]);

        try {
            $originalImagePath = $request->file('document')->getRealPath();

            $imageManager = new ImageManager(new Driver());
            $image = $imageManager->read($originalImagePath);
            $image->greyscale();
            $image->contrast(40);

            $tempPath = storage_path('app/ocr_temp_' . uniqid() . '.png');
            $image->save($tempPath);


            $text = (new TesseractOCR($tempPath))
                ->lang('ron')
                ->psm(6)
                ->run();

            unlink($tempPath);

            Log::info('Textul brut extras de Tesseract (după pre-procesare):', ['text' => $text]);

            $vehicleData = $this->extractVehicleData($text);

            return response()->json($vehicleData);

        } catch (\Exception $e) {
            if (isset($tempPath) && file_exists($tempPath)) {
                unlink($tempPath);
            }
            Log::error('A apărut o eroare la procesarea cu Tesseract: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Nu s-a putut procesa imaginea.'], 500);
        }
    }

    private function extractVehicleData(string $text): array
    {
        $mappings = [
            'numarInmatriculare'   => '/^A\s+([^\n\r]+)/m',
            'anFabricatie'         => '/^B\s+.*?(\d{4})/m',
            'marca'                => '/^D\.1\s+([^\n\r]+)/m',
            'model'                => '/^D\.3\s+([^\n\r]+)/m',
            'serieSasiu'           => '/^E\s+([A-Z0-9]{17})/m',
            'masaMaxima'           => '/^F\.1\s+(\d+)/m',
            'capacitateCilindrica' => '/^P\.1\s+(\d+)/m',
            'putere'               => '/^P\.2\s+([\d\.]+)/m',
            'serieCiv'             => '/^Y\s+([^\n\r]+)/m',
            'numarLocuri'          => '/^S\.1\s+(\d+)/m',
        ];

        $data = [];
        foreach ($mappings as $key => $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $data[$key] = trim(end($matches));
            }
        }

        if (!isset($data['model']) && preg_match('/^D\.2\s+([^\n\r]+)/m', $text, $matches)) {
            $data['model'] = trim(end($matches));
        }

        return $data;
    }
}
