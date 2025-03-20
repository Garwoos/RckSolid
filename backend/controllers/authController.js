import { registerUser, loginUser, getAllUsers } from '../services/authService.js';

export async function registerController(req, res) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Authentication failed' });
  }
}

export async function loginController(req, res) {
  try {
    console.log('Requête reçue avec les données:', req.body); // Log des données reçues
    const token = await loginUser(req.body);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.message);
    res.status(401).json({ error: error.message || 'Authentication failed' });
  }
}

export async function getAllUsersController(req, res) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Authentication failed' });
  }
}

