import express from 'express';
import { loginController, registerController, getAllUsersController } from '../controllers/authController.js';

const router = express.Router();

// Route pour l'inscription
router.post('/register', registerController);

// Route pour la connexion
router.post('/login', loginController);

// Route pour récupérer tous les utilisateurs (pour l'administration)
router.get('/users', getAllUsersController);

export default router;
