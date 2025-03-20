import db from '../config/dbConfig.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Service pour l'inscription
export async function registerUser({ email, password, name }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO User (id_User, mail_User, password_User, name_User) VALUES (UUID(), ?, ?, ?)';
  await db.execute(query, [email, hashedPassword, name]);
  return { message: 'User registered successfully' };
}

// Service pour la connexion
export async function loginUser({ email, password }) {
  const query = 'SELECT * FROM User WHERE mail_User = ?';
  const [rows] = await db.execute(query, [email]);

  if (rows.length === 0) {
    console.log('Utilisateur non trouvé');
    throw new Error('Invalid email or password');
  }

  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_User);

  if (!isPasswordValid) {
    console.log('Mot de passe invalide');
    throw new Error('Invalid email or password');
  }

  console.log('Connexion réussie pour l\'utilisateur:', user.mail_User);

  const token = jwt.sign({ id: user.id_User, email: user.mail_User }, JWT_SECRET, { expiresIn: '1h' });
  return token;
}

// Service pour récupérer tous les utilisateurs
export async function getAllUsers() {
  const query = 'SELECT id_User, mail_User, name_User FROM User';
  const [rows] = await db.execute(query);
  return rows;
}

