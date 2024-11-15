# 📝 To-Do List App

Une application intuitive pour organiser vos tâches quotidiennes, construite avec une architecture frontend-backend.

---

## 🚀 Fonctionnalités

- Créer des tâches : Ajoutez rapidement des tâches avec des détails.
- Marquer comme terminé : Gardez une trace des tâches complétées.
- Supprimer des tâches : Maintenez votre liste propre et organisée.
- Interface intuitive : Facile à utiliser et rapide à comprendre.

---

## 🛠️ Installation et Utilisation

### Prérequis

Avant d'installer l'application, assurez-vous d'avoir installé les outils suivants :

- Node.js ≥ 16
- PHP ≥ 7.3
- Composer (gestionnaire de dépendances PHP)
- Serveur Web (Apache/Nginx)
- Base de données : MySQL, PostgreSQL, SQLite ou tout autre moteur de base de données compatible.

---

## 📦 Technologies utilisées

### Frontend

- React : Utilisé pour construire l'interface utilisateur avec des composants réactifs.
- React Router DOM : Permet de gérer la navigation dans l'application.
- Apollo Client : Utilisé pour gérer les requêtes et données via GraphQL.
- Tailwind CSS : Un framework CSS pour des styles rapides et responsives.
- Vite : Outil de build et serveur de développement rapide.

### Backend

- Laravel Framework (`laravel/framework`) : Framework PHP pour construire des applications web robustes.
- Laravel Sanctum (`laravel/sanctum`) : Pour l'authentification API basée sur des tokens.
- Laravel Tinker (`laravel/tinker`) : Outil de développement interactif pour Laravel.
- Fruitcake Laravel CORS (`fruitcake/laravel-cors`) : Gère les en-têtes CORS pour les API.
- Guzzle HTTP Client (`guzzlehttp/guzzle`) : Client HTTP pour interagir avec d'autres API.
- Nuwave Lighthouse (`nuwave/lighthouse`) : Pour gérer les requêtes GraphQL côté serveur.

---

## 🏗️ Mise en place du projet

### Frontend

1. Clonez le dépôt ou téléchargez les fichiers.
2. Accédez au répertoire `frontend` et installez les dépendances :
    ```bash
    cd frontend
    npm install
    ```

3. Démarrez le serveur de développement :
    ```bash
    npm start
    ```

Cela démarrera l'application frontend et vous pourrez y accéder depuis votre navigateur à l'adresse `http://localhost:3000` (par défaut).

### Backend

1. Clonez le dépôt ou téléchargez les fichiers.
2. Accédez au répertoire `backend` et installez les dépendances avec Composer :
    ```bash
    cd backend
    composer install
    ```

3. Copiez le fichier `.env.example` en `.env` et configurez-le :
    ```bash
    cp .env.example .env
    ```

4. Configurez les paramètres de la base de données dans le fichier `.env` :
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=laravel
    DB_USERNAME=root
    DB_PASSWORD=
    ```

5. Générez la clé d'application Laravel :
    ```bash
    php artisan key:generate
    ```

6. Mettez en place les migrations de base de données pour créer les tables nécessaires :
    ```bash
    php artisan migrate
    ```

7. Démarrez le serveur Laravel :
    ```bash
    php artisan serve
    ```

Cela démarrera l'application backend sur `http://localhost:8000` (par défaut).

---

## 📌 Tests et Débogage

- Tests unitaires : Vous pouvez exécuter les tests unitaires pour vérifier la validité de l'application via PHPUnit.
    ```bash
    php artisan test
    ```

- Débogage en temps réel : Utilisez Laravel Tinker pour tester les fonctionnalités directement en ligne de commande.
    ```bash
    php artisan tinker
    ```

---

## 🚀 Déploiement

Lors du déploiement sur un serveur de production, assurez-vous de :

1. Configurer les variables d'environnement sur le serveur.
2. Exécuter les migrations de base de données.
3. Mettre en place un serveur web comme Apache ou Nginx pour pointer vers le dossier `public/` du backend Laravel.
4. Utiliser un serveur de base de données comme MySQL, PostgreSQL, ou SQLite en fonction de votre configuration.

