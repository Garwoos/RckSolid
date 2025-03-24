import { registerUser, loginUser, getAllUsers, getUserInfoById } from '../services/authService.js';

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

export async function getUserInfoByIdController(req, res) {
  try {
    if (!req.user || !req.user.id) {
      throw new Error('User ID is missing in the request.');
    }
    const user = await getUserInfoById(req.user.id); // Passez l'ID utilisateur correctement
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    res.status(500).json({ error: error.message || 'Failed to fetch user info.' });
  }
}

