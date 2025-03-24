import fetch from 'node-fetch';

const RIOT_API_KEY = process.env.RIOT_API_KEY || 'RGAPI-d2decffb-bd82-4a61-983c-f68f95731b5a';
const REGION = 'europe'; // Remplacez 'europe' par 'euw1' ou une autre région valide

if (!RIOT_API_KEY) {
  console.error('Erreur : RIOT_API_KEY est undefined. Vérifiez le fichier .env et le chargement de dotenv.');
}



// GET https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
export async function getAccountByRiotId(gameName, tagLine) {
  const response = await fetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch account data');
  }

  return response.json();
}

// GET https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}
export async function getSummonerByPuuid(puuid) {
  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, // Fixed URL
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch summoner data');
  }

  return response.json();
}

// GET https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/{SUMMONER_ID}
export async function getSummonerRanks(summonerId) {
  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch rank data');
  }

  return response.json();
}
/*
export async function getSummonerByName(summonerName) {
  console.log(`Appel à l'API Riot pour le summoner: ${summonerName}, région: ${REGION}`);
  console.log(`Clé API utilisée: ${RIOT_API_KEY}`);

  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erreur API Riot:', response.status, errorText);
    throw new Error(`Failed to fetch summoner data: ${errorText}`);
  }

  return response.json();
}*/