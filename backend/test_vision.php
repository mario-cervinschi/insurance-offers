<?php

// Includem manual autoloader-ul Composer
require __DIR__ . '/vendor/autoload.php';

use Google\Cloud\Vision\V1\ImageAnnotatorClient;

echo "Script de test pornit...\n";

try {
    // Calea către fișierul de credențiale
    $credentialsPath = __DIR__ . '/storage/app/google-credentials.json';

    // Verificăm dacă fișierul de credențiale există
    if (!file_exists($credentialsPath)) {
        throw new \Exception("Fișierul de credențiale NU a fost găsit la: " . $credentialsPath);
    }

    echo "Credentiale gasite. Se initializeaza clientul...\n";

    // Inițializăm clientul Google Vision
    $imageAnnotator = new ImageAnnotatorClient([
        'credentials' => $credentialsPath
    ]);

    echo "Client initializat cu succes!\n";

    // Folosim o imagine publică pentru test, pentru a elimina variabilele
    $imageUrl = 'https://storage.googleapis.com/cloud-samples-data/vision/ocr/sign.jpg';
    $imageContent = file_get_contents($imageUrl);

    echo "Imagine de test descarcata. Se trimite request la Google...\n";

    // Apelăm API-ul
    $response = $imageAnnotator->textDetection($imageContent);
    $texts = $response->getTextAnnotations();

    echo "Raspuns primit de la Google!\n\n";
    echo "-----------------------------------\n";
    echo "SUCCESS! Text extras:\n";

    if (count($texts) > 0) {
        echo $texts[0]->getDescription();
    } else {
        echo "Niciun text detectat.";
    }

    echo "\n-----------------------------------\n";

    // Închidem clientul
    $imageAnnotator->close();

} catch (\Exception $e) {
    echo "\n!!!!!!!!!! A APARUT O EROARE !!!!!!!!!!\n";
    echo "Eroare: " . $e->getMessage() . "\n";
    echo "Fișier: " . $e->getFile() . "\n";
    echo "Linie: " . $e->getLine() . "\n";
}
