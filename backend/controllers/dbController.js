import { getAllUsers } from '../services/dbService.js'; // Assurez-vous que le chemin est correct

export async function getAllUsersController(req, res) { // Assurez-vous que cette fonction est bien exportée
    try {
      const users = await getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }