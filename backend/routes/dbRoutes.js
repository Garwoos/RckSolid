import express from 'express';
import { addLolAccountToUserController, getAllUsersController, addLolAccountController, getLolAccountByIdController, getLinkedLolAccountsController } from '../controllers/dbController.js'; // Assurez-vous que le chemin est correct

const router = express.Router();


// Route pour récupérer tous les utilisateurs (pour l'administration)
router.get('/users', getAllUsersController); // Utilisation du bon contrôleur

// route pour créer un groupe
router.post('/groups', (req, res) => {
    
  res.status(201).json({ message: 'Groupe créé avec succès' });
});

// route pour ajouter un compte lol
router.post('/lolAccount', addLolAccountController); // Utilisation du bon contrôleur

// route pour récupérer un compte lol par son riotid
router.get('/lolAccount/:id', getLolAccountByIdController);

// route pour ajouter un compte lol à un compte
router.post('/lolAccountToUser', addLolAccountToUserController); // Utilisation du bon contrôleur 

// Route to fetch linked LoL accounts for a user
router.get('/lolAccounts/:userId', getLinkedLolAccountsController);

export default router;
