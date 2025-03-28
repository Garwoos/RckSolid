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
    SELECT g.id_group, g.name_groups, g.description_group, g.created_at
    FROM group_members gm
    JOIN group_lol g ON gm.group_id = g.id_group
    WHERE gm.id_account = ?
  `;
  const [rows] = await db.execute(query, [userId]);
  return rows;
}

export async function getGroup(groupId) {
  if (typeof groupId !== 'string') {
    throw new Error('Invalid groupId. It must be a string.');
  }

  const query = `
    SELECT g.id_group, g.name_groups, g.description_group, g.created_at
    FROM group_lol g
    WHERE g.id_group = ?
  `;
  const [rows] = await db.execute(query, [groupId]);
  return rows[0];
}

export async function createGroup(groupName, description, userId) {
  const query = `
    INSERT INTO group_lol (id_group, name_groups, description_group, created_by_User)
    VALUES (UUID(), ?, ?, ?)
  `;
  const [result] = await db.execute(query, [groupName, description, userId]);

  if (result.affectedRows === 0) {
    throw new Error('Failed to insert group into the database.');
  }

  const groupIdQuery = `
    SELECT id_group
    FROM group_lol
    WHERE created_by_User = ?
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const [groupRows] = await db.execute(groupIdQuery, [userId]);
  const groupId = groupRows[0]?.id_group;

  if (!groupId) {
    throw new Error('Failed to retrieve group ID after creation.');
  }

  const query2 = `
    INSERT INTO group_members (id_group_members, group_id, id_account)
    VALUES (UUID(), ?, ?)
  `;
  await db.execute(query2, [groupId, userId]);

  return { message: 'Group created successfully and user added as member' };
}

export async function getAlllolAccountFromUserFromGroup(groupId) {
  const query = `
    SELECT la.riotid, la.tier, la.rank, la.wins, la.losses
    FROM group_members gm
    JOIN user_lol_account ula ON gm.id_account = ula.id_User
    JOIN lol_account la ON ula.summonerId = la.summonerId
    WHERE gm.group_id = ?
  `;
  const [rows] = await db.execute(query, [groupId]);
  return rows;
}

export async function getGroupMembers(groupId) {
  const query = `
    SELECT u.id_User, u.name_User
    FROM group_members gm
    JOIN Users u ON gm.id_account = u.id_User
    WHERE gm.group_id = ?
  `;
  const [rows] = await db.execute(query, [groupId]);
  return rows;
}

export async function getAllLolAccountsFromGroup(groupId) {
  const query = `
    SELECT la.riotid, la.tier, la.rank, la.wins, la.losses, u.name_User
    FROM group_members gm
    JOIN user_lol_account ula ON gm.id_account = ula.id_User
    JOIN lol_account la ON ula.summonerId = la.summonerId
    JOIN Users u ON ula.id_User = u.id_User
    WHERE gm.group_id = ?
  `;

  try {
    const [rows] = await db.execute(query, [groupId]);
    return rows;
  } catch (error) {
    console.error("Error in getAllLolAccountsFromGroup:", error.message);
    throw new Error("Failed to fetch LoL accounts for the group.");
  }
}

export async function addUserToGroup(name_User, groupId) {
  const query = `
    SELECT id_User
    FROM Users
    WHERE name_User = ?
  `;
  const [rows] = await db.execute(query, [name_User]);
  if (rows.length === 0) {
    throw new Error('User not found.');
  }
  const userId = rows[0].id_User;

  const query2 = `
    INSERT INTO group_members (id_group_members, group_id, id_account)
    VALUES (UUID(), ?, ?)
  `;
  await db.execute(query2, [groupId, userId]);
  return { message: "User added to group successfully." };
}