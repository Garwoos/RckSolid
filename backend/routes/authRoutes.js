import express from 'express';
import { loginController, registerController, getAllUsersController, getUserInfoByIdController } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js'; // Import du middleware

const router = express.Router();

// Route pour l'inscription
router.post('/register', registerController);

// Route pour la connexion
router.post('/login', loginController);

// Route pour récupérer tous les utilisateurs (pour l'administration)
router.get('/users', getAllUsersController);

// Route pour récupérer les informations de l'utilisateur connecté
router.get('/me', authenticateToken, getUserInfoByIdController); // Ajout du middleware authenticateToken

export default router;
