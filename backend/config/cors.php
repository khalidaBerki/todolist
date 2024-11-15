<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'graphql'], // Ajoute 'graphql' pour tes requêtes GraphQL
    'allowed_methods' => ['*'], // Autorise toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
    'allowed_origins' => [
        'http://localhost:5173', // L'URL de ton front-end
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Autorise tous les en-têtes
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
    
];
