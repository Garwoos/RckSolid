import db from '../config/dbConfig.js';

// Service pour récupérer tous les utilisateurs
export async function getAllUsers() {
  const query = 'SELECT * FROM User';
  const [rows] = await db.execute(query);
  return rows;
}