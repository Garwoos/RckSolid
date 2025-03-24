import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    logger.info("No token provided"); // Log pour vérifier l'absence de token
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      logger.error("Invalid token:", err.message); // Log pour vérifier les erreurs de validation
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (!decodedToken || !decodedToken.id) {
      logger.error("Token does not contain user ID"); // Log for missing user ID in token
      return res.status(403).json({ error: "Invalid token payload" });
    }
    req.user = { id: decodedToken.id }; // Attach the user ID to the request
    next();
  });
}


