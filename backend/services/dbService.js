import db from '../config/dbConfig.js';

// Service pour récupérer tous les utilisateurs
export async function getAllUsers() {
  const query = 'SELECT * FROM User';
  const [rows] = await db.execute(query);
  return rows;
}

// Service pour ajouter un compte lol 
export async function addLolAccount({ riotid, leagueId, summonerId, puuid, leaguePoints, rank, tier, losses, wins, hotStreak, freshBlood, veteran, inactive, region_lol_account }) {
  const query = `
    INSERT INTO lol_account (
      riotid, leagueId, summonerId, puuid, leaguePoints, \`rank\`, tier, losses, wins, hotStreak, freshBlood, veteran, inactive, region_lol_account
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      leaguePoints = VALUES(leaguePoints),
      \`rank\` = VALUES(\`rank\`),
      tier = VALUES(tier),
      losses = VALUES(losses),
      wins = VALUES(wins),
      hotStreak = VALUES(hotStreak),
      freshBlood = VALUES(freshBlood),
      veteran = VALUES(veteran),
      inactive = VALUES(inactive)
  `;
  await db.execute(query, [
    riotid, leagueId, summonerId, puuid, leaguePoints, rank, tier, losses, wins, hotStreak, freshBlood, veteran, inactive, region_lol_account
  ]);
  return { message: 'LOL account added or updated successfully' };
} 


// Service pour ajouter un compte lol à un utilisateur
export async function addLolAccountToUser(userId, summonerId) {
  const query = `
    INSERT INTO user_lol_account (id_User_lol_account, id_User, summonerId)
    VALUES (UUID(), ?, ?)
    ON DUPLICATE KEY UPDATE id_User = VALUES(id_User)
  `;
  await db.execute(query, [userId, summonerId]);
  return { message: "LoL account linked successfully." };
}

// Service pour récuperer un compte lol par son riotid
export async function getLolAccountById(riotid) {
  const query = 'SELECT * FROM lol_account WHERE riotid = ?';
  const [rows] = await db.execute(query, [riotid]);
  if (rows.length === 0) {
    throw new Error('Account not found.');
  }
  return rows[0];
}

// Service pour récupérer les comptes LoL liés à un utilisateur
export async function getLinkedLolAccounts(userId) {
  const query = `
    SELECT la.riotid, la.tier, la.rank, la.wins, la.losses
    FROM user_lol_account ula
    JOIN lol_account la ON ula.summonerId = la.summonerId
    WHERE ula.id_User = ?
  `;
  const [rows] = await db.execute(query, [userId]);
  return rows;
}

export async function deletelolAccountFromUser(userId, riotid) {
  const query = `
    DELETE ula
    FROM user_lol_account ula
    JOIN lol_account la ON ula.summonerId = la.summonerId
    WHERE ula.id_User = ? AND la.riotid = ?
  `;
  const [result] = await db.execute(query, [userId, riotid]);
  return result;
}

export async function getUserGroups(userId) {
  const query = `
    SELECT *
    FROM groups
    where id_group = (select id_group from group_members where id_User = ?)
  `;
  const [rows] = await db.execute(query, [userId]);
  return rows;
}