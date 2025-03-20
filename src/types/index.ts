export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface SummonerProfile {
  id: string;
  summoner_name: string;
  summoner_id: string;
  account_id: string;
  puuid: string;
  profile_icon_id: number;
  summoner_level: number;
  user_id: string;
}

export interface RankInfo {
  id: string;
  summoner_id: string;
  queue_type: 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR';
  tier: string;
  rank: string;
  league_points: number;
  wins: number;
  losses: number;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  invite_code: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  summoner_id: string;
  joined_at: string;
}

export interface Comment {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
}