<?php

include '../vendor/autoload.php';
include_once 'conf.php';

//
// Shopify\Context::initialize(
//    $apiKey,
//    $apiSecretKey,
//    $scopes,
//    $hostName,
//    $sessionStorage
// );
//
// $url = Shopify\Auth\OAuth::begin($shop, $redirectPath,true);
//
// header('location:' . $url);
//
//

// Methode 2

$config = [
    'ShopUrl'      => $shop,
    'ApiKey'       => $apiKey,
    'SharedSecret' => $apiSecretKey,
];

PHPShopify\ShopifySDK::config($config);

$scopes = 'read_products,write_products,read_script_tags,write_script_tags';
// This is also valid
// $scopes = array('read_products','write_products','read_script_tags', 'write_script_tags');
$redirectUrl = 'https://8228-81-254-246-225.ngrok-free.app/token.php';

PHPShopify\AuthHelper::createAuthRequest($scopes, $redirectUrl);
