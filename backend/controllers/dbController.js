import { getAllUsers, addLolAccount, getLolAccountById, addLolAccountToUser, getLinkedLolAccounts, deletelolAccountFromUser } from '../services/dbService.js'; // Assurez-vous que le chemin est correct

export async function getAllUsersController(req, res) { // Assurez-vous que cette fonction est bien exportée
    try {
      const users = await getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export async function addLolAccountToUserController(req, res) {
  try {
    const { riotid, id_User, leagueId, summonerId, puuid, leaguePoints, rank, tier, losses, wins, hotStreak, freshBlood, veteran, inactive, region_lol_account } = req.body;

    if (!id_User) {
      throw new Error("User ID is required.");
    }
    if (!riotid) {
      throw new Error("Riot ID is required.");
    }

    // Check if the LoL account exists
    let account;
    try {
      account = await getLolAccountById(riotid);
    } catch (error) {
      // If account doesn't exist, add it
      await addLolAccount({
        riotid,
        leagueId,
        summonerId,
        puuid,
        leaguePoints,
        rank,
        tier,
        losses,
        wins,
        hotStreak,
        freshBlood,
        veteran,
        inactive,
        region_lol_account,
      });
      account = { summonerId }; // Use the summonerId from the request body
    }

    // Link the LoL account to the user
    await addLolAccountToUser(id_User, account.summonerId);

    res.status(201).json({ message: "LoL account linked successfully." });
  } catch (error) {
    console.error("Error linking LoL account:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function addLolAccountController(req, res) {
  try {
    const account = await addLolAccount(req.body);
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getLolAccountByIdController(req, res) {
  try {
    const account = await getLolAccountById(req.params.id);
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getLinkedLolAccountsController(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const accounts = await getLinkedLolAccounts(userId);
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching linked LoL accounts:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function deletelolAccountFromUserController(req, res) {
  try {
    const { userId, riotid } = req.body;

    if (!userId || !riotid) {
      throw new Error("User ID and Riot ID are required.");
    }

    // Supprimer le compte LoL lié à l'utilisateur
    const result = await deletelolAccountFromUser(userId, riotid);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No linked account found." });
    }

    res.status(200).json({ message: "LoL account unlinked successfully." });
  } catch (error) {
    console.error("Error unlinking LoL account:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function getUserGroupsController(req, res) {
  try {
    const userId = req.params.userId;
    // Logique pour récupérer les groupes de l'utilisateur
    if (!userId) {
      throw new Error("User ID is required.");
    }
    // Remplacez cette logique par la récupération réelle des groupes de l'utilisateur
    const groups = await getUserGroups(userId);
    if (!groups) {
      return res.status(404).json({ message: "No groups found for this user." });
    }
    const userGroups = groups.map(group => group.name);
    return res.status(200).json(userGroups);
  } catch (error) {
    console.error("Error fetching user groups:", error.message);
    res.status(500).json({ error: error.message });
  }
}