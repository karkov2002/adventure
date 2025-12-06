<?php

// phpinfo();

include '../vendor/autoload.php';

// ===========================
// shopify/shopify-api
// It's work (!!)
// Api officiel shopify
//
// https://github.com/Shopify/shopify-api-php
//
// ===========================

$shop = 'madagence-sandbox.myshopify.com';
$apiKey = 'f08d7cc9639f61fc24316ea98e946dbe';
$apiSecretKey = 'd986c43257cd1b4a60d2fe91ef34a893';
$scopes = 'read_products,write_products';
$hostName = 'https://7960-81-254-246-225.ngrok-free.app/';
$sessionStorage = new Shopify\Auth\FileSessionStorage('/var/www/html/sessions');
$accessToken = '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';

Shopify\Context::initialize($apiKey, $apiSecretKey, $scopes, $hostName, $sessionStorage);
$client = new Shopify\Clients\Rest('madagence-sandbox.myshopify.com', $accessToken);

$response = $client->get('customers');
echo 'Status Code ' . $response->getStatusCode();
echo $response->getBody();

echo '<hr />';

$response = $client->get('products');
echo 'Status Code ' . $response->getStatusCode();
echo $response->getBody();

echo '<hr />';

// ===========================
// phpclassic/php-shopify
// it's work too !!!
// https://github.com/phpclassic/php-shopify
//
// non officiel
//
// ===========================

$config = [
    'ShopUrl'     => $shop,
    'AccessToken' => $accessToken,
];

PHPShopify\ShopifySDK::config($config);

$shopify = new PHPShopify\ShopifySDK();
$products = $shopify->Product->get();

print_r($products);
