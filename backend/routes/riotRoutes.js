import express from 'express';
import { getAccountByRiotId, getSummonerByPuuid, getSummonerRanks } from '../services/riotService.js'; // Added getAccountByRiotId

const router = express.Router();

/*router.get('/summoner/:name', async (req, res) => {
  try {
    console.log(`Requête reçue pour le summoner: ${req.params.name}`);
    const summoner = await getSummonerByName(req.params.name);
    console.log('aa' + req.params.name);
    console.log('Données du summoner récupérées:', summoner);
    res.json(summoner);
  } catch (error) {
    console.error('Erreur lors de la récupération des données du summoner:', error.message);
    res.status(500).json({ error: error.message });
  }
});*/

router.get('/summoner/:name/account', async (req, res) => {
  try {
    const [gameName, tagLine] = req.params.name.split("#");
    if (!gameName || !tagLine) {
      throw new Error("Invalid format. Use Username#Region.");
    }

    const account = await getAccountByRiotId(gameName, tagLine); // Pass both gameName and tagLine
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/summoner/:puuid', async (req, res) => {
  try {
    const summoner = await getSummonerByPuuid(req.params.puuid);
    res.json(summoner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/summoner/:id/ranks', async (req, res) => {
  try {
    const ranks = await getSummonerRanks(req.params.id);
    res.json(ranks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
