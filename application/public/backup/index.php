<?php

include '../vendor/autoload.php';
include_once 'conf.php';

echo '<h1>TEST APP PARTNER SHOPIFY</h1>';
echo '<hr />';
echo 'Shopify embedded Symfony';
echo '<hr >';

// Shopify\Context::initialize(
//    $apiKey,
//    $apiSecretKey,
//    $scopes,
//    $hostName,
//    $sessionStorage
// );

// $accessToken = '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'; // access token de l'app créé directement dans l'admin
$accessToken = 'shpua_9a4551880883e8ced44c48c70ba41326'; // access token de l'app partner, récupéré lors du process oAuth

$config = [
    'ShopUrl'     => $shop,
    'AccessToken' => $accessToken,
];

PHPShopify\ShopifySDK::config($config);

$shopify = new PHPShopify\ShopifySDK();
$products = $shopify->Product->get();

echo '<pre>';
print_r($products);
echo '</pre>';
