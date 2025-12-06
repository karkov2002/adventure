<?php

include '../vendor/autoload.php';
include_once 'conf.php';

// Shopify\Context::initialize(
//    $apiKey,
//    $apiSecretKey,
//    $scopes,
//    $hostName,
//    $sessionStorage
// );
//
// $session = Shopify\Auth\OAuth::callback($_COOKIE, $_REQUEST);
// $accessToken = $session->getAccessToken();
//
// print_r($accessToken);

$config = [
    'ShopUrl'      => $shop,
    'ApiKey'       => $apiKey,
    'SharedSecret' => $apiSecretKey,
];
PHPShopify\ShopifySDK::config($config);
$accessToken = PHPShopify\AuthHelper::getAccessToken();

print_r($accessToken);

// $accessToken = 'shpua_9a4551880883e8ced44c48c70ba41326';
