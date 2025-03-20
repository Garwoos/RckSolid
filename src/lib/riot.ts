const RIOT_API_KEY = import.meta.env.VITE_RIOT_API_KEY;
const REGION = 'euw1';
const REGION_V5 = 'europe';

interface SummonerDTO {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

interface LeagueEntryDTO {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export async function getSummonerByName(summonerName: string): Promise<SummonerDTO> {
  const response = await fetch(
    `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch summoner data');
  }

  return response.json();
}

export async function getSummonerRanks(summonerId: string): Promise<LeagueEntryDTO[]> {
  const response = await fetch(
    `https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch rank data');
  }

  return response.json();
}