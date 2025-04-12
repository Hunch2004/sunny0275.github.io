<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the URL from the request
$url = isset($_GET['url']) ? $_GET['url'] : '';
if (empty($url)) {
    echo json_encode(['error' => 'No URL provided']);
    exit;
}

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo json_encode([
        'error' => curl_error($ch),
        'errno' => curl_errno($ch)
    ]);
} else {
    // Get the HTTP status code
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    // Check if the response is valid JSON
    $jsonResponse = json_decode($response, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        // Add HTTP status code to the response
        $jsonResponse['http_status'] = $httpCode;
        echo json_encode($jsonResponse);
    } else {
        // If not valid JSON, return the raw response
        echo $response;
    }
}

// Close cURL
curl_close($ch);
?> 