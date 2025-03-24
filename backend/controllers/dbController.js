import { getAllUsers, addLolAccount, getLolAccountById, addLolAccountToUser, getLinkedLolAccounts } from '../services/dbService.js'; // Assurez-vous que le chemin est correct

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
    const { riotid, id_User } = req.body; // Get id_User from the request body
    if (!id_User) {
      throw new Error("User ID is required.");
    }
    if (!riotid) {
      throw new Error("Riot ID is required.");
    }

    // Fetch the LoL account by riotid
    const account = await getLolAccountById(riotid);
    if (!account) {
      throw new Error("LoL account not found.");
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
