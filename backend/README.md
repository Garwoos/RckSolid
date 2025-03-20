# Backend - RckSolid

## Description

Ce backend est une application Express.js conçue pour gérer les fonctionnalités d'une application de suivi de classement League of Legends. Il inclut des routes pour interagir avec une base de données MySQL et l'API Riot Games.

## Arborescence

```
backend/
├── .env                     # Variables d'environnement
├── .gitignore               # Fichiers à ignorer par Git
├── config/
│   ├── dbConfig.js          # Configuration de la base de données
│   ├── riotConfig.js        # Configuration de l'API Riot
├── controllers/             # Contrôleurs pour la logique métier
│   ├── dbController.js
│   ├── riotController.js
├── middlewares/             # Middlewares globaux
│   ├── errorHandler.js
│   ├── rateLimiter.js
├── routes/                  # Définition des routes
│   ├── index.js             # Point d'entrée des routes
│   ├── dbRoutes.js          # Routes liées à la base de données
│   ├── riotRoutes.js        # Routes pour l'API Riot
├── services/                # Services pour la logique métier
│   ├── dbService.js
│   ├── riotService.js
├── utils/                   # Fonctions utilitaires
│   ├── logger.js
├── bdd/
│   ├── migrations/          # Scripts SQL pour la base de données
│       ├── bdd.sql
├── server.js                # Point d'entrée principal du serveur
├── package.json             # Dépendances et scripts npm
└── README.md                # Documentation du backend
```

## Prérequis

- Node.js (version 16 ou supérieure)
- MySQL (version 8 ou supérieure)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   cd backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement dans le fichier `.env` :
   ```properties
   RIOT_API_KEY=VotreCléAPI
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=rcksolid
   ```

4. Configurez la base de données en exécutant le script SQL :
   ```bash
   mysql -u root -p < bdd/migrations/bdd.sql
   ```

## Démarrage

- En mode production :
  ```bash
  npm start
  ```

- En mode développement (avec `nodemon`) :
  ```bash
  npm run dev
  ```

Le serveur sera accessible à l'adresse [http://localhost:5000](http://localhost:5000).

## Routes

### API Riot

- `GET /api/riot/summoner/:name` : Récupère les informations d'un invocateur par son nom.
- `GET /api/riot/summoner/:id/ranks` : Récupère les rangs d'un invocateur par son ID.

### Base de données

- `GET /api/db/user/:id` : Récupère un utilisateur par son ID.
- `POST /api/db/user` : Crée un nouvel utilisateur.

## Structure des dossiers

- **config/** : Contient les fichiers de configuration (base de données, API Riot).
- **controllers/** : Contient la logique métier pour chaque route.
- **middlewares/** : Contient les middlewares globaux comme la gestion des erreurs.
- **routes/** : Définit les routes pour les fonctionnalités.
- **services/** : Fournit des fonctions pour interagir avec la base de données ou des API externes.
- **utils/** : Fonctions utilitaires réutilisables.
- **bdd/** : Scripts SQL pour la gestion de la base de données.

## Dépendances principales

- `express` : Framework web pour Node.js.
- `mysql2` : Client MySQL pour Node.js.
- `dotenv` : Gestion des variables d'environnement.
- `node-fetch` : Requêtes HTTP pour interagir avec l'API Riot.

## Contribution

1. Forkez le projet.
2. Créez une branche pour vos modifications :
   ```bash
   git checkout -b feature/nom-de-la-feature
   ```
3. Faites vos modifications et commitez-les :
   ```bash
   git commit -m "Ajout de la fonctionnalité X"
   ```
4. Poussez vos modifications :
   ```bash
   git push origin feature/nom-de-la-feature
   ```
5. Ouvrez une Pull Request.

## Licence

Ce projet est sous licence MIT.
