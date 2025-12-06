<?php

$shop = 'madagence-sandbox.myshopify.com';
$apiKey = '497cf7f810b574fdc4720fd4023f03c3';
$apiSecretKey = '75d70061092ac544e462fba3c348137e';
$scopes = 'read_products,write_products';
$hostName = 'https://8228-81-254-246-225.ngrok-free.app'; // Change everytime :(
$sessionStorage = new Shopify\Auth\FileSessionStorage('/var/www/html/sessions');
$redirectPath = 'https://8228-81-254-246-225.ngrok-free.app/token.php';
