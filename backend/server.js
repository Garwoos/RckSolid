import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import riotRoutes from './routes/riotRoutes.js';
import dbRoutes from './routes/dbRoutes.js'; // Correctement importé
import authRoutes from './routes/authRoutes.js';

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // URL du frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json());

// Routes
app.use('/api/riot', riotRoutes);
app.use('/api/db', dbRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
