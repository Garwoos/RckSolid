import express from 'express';
import { getAllUsersController } from '../controllers/dbController.js'; // Assurez-vous que le chemin est correct

const router = express.Router();


// Route pour récupérer tous les utilisateurs (pour l'administration)
router.get('/users', getAllUsersController); // Utilisation du bon contrôleur

// route pour créer un groupe
router.post('/groups', (req, res) => {
    
  res.status(201).json({ message: 'Groupe créé avec succès' });
});

export default router;
