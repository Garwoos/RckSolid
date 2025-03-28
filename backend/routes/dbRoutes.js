import express from 'express';
import { addLolAccountToUserController, getAllUsersController, addLolAccountController, getLolAccountByIdController, getLinkedLolAccountsController, deletelolAccountFromUserController, createGroupController, getUserGroupsController, getGroupMembersController } from '../controllers/dbController.js'; // Assurez-vous que le chemin est correct
import { getGroup, getAllLolAccountsFromGroup, addUserToGroup } from '../services/dbService.js'; // Added addUserToGroup

const router = express.Router();


// Route pour récupérer tous les utilisateurs (pour l'administration)
router.get('/users', getAllUsersController); // Utilisation du bon contrôleur

// route pour créer un groupe
router.post('/groups', (req, res) => {
    
  res.status(201).json({ message: 'Groupe créé avec succès' });
});

// route pour ajouter un compte lol
router.post('/lolAccount', addLolAccountController); // Utilisation du bon contrôleur

// route pour récupérer un compte lol par son riotid
router.get('/lolAccount/:id', getLolAccountByIdController);

// route pour ajouter un compte lol à un compte
router.post('/lolAccountToUser', addLolAccountToUserController); // Utilisation du bon contrôleur 

// Route to fetch linked LoL accounts for a user
router.get('/lolAccounts/:userId', getLinkedLolAccountsController);

// Route pour récupérer les comptes LoL liés à un utilisateur
router.get('/lolAccount/:userId', getLinkedLolAccountsController); // Utilisation du bon contrôleur

// Route pour supprimer un compte LoL lié à un utilisateur
router.delete('/lolAccountToUser', deletelolAccountFromUserController);

// Route pour trouver les groupes d'un utilisateur
router.get('/userGroups/:userId', getUserGroupsController); // Utilisez le contrôleur ici

// Route pour créer un groupe
router.post('/createGroup', createGroupController); // Utilisez le contrôleur ici

// Route pour trouver un groupe par son id
router.get('/group/:groupId', (req, res) => {
  const { groupId } = req.params;

  // Ensure groupId is passed as a string
  if (!groupId) {
    return res.status(400).json({ error: "Group ID is required." });
  }

  getGroup(String(groupId))
    .then((group) => res.status(200).json(group))
    .catch((error) => res.status(500).json({ error: error.message }));
});

// route pour trouver tous les utilisateurs d'un groupe
router.get('/group/:groupId/users', getGroupMembersController); // Use the controller directly

// route pour recuperer les comptes lol d'un groupe
router.get('/group/:groupId/lolAccounts', async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ error: "Group ID is required." });
  }

  try {
    const accounts = await getAllLolAccountsFromGroup(groupId); // Call the service
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching LoL accounts for group:", error.message);
    res.status(500).json({ error: error.message });
  }
}); 

// route pour ajouter un utilisateur à un groupe
router.post('/group/:groupId/user/:name_User', async (req, res) => {
  const { groupId, name_User } = req.params;

  if (!groupId || !name_User) {
    return res.status(400).json({ message: "Group ID and User name are required." });
  }

  try {
    const result = await addUserToGroup(name_User, groupId); // Call the service
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding group member:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
