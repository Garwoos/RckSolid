import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "../components/ui/modal"; // Import Modal components

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        // Fetch user information to get userId
        const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user information.");
        }

        const userData = await userResponse.json();
        setUserId(userData.id_User);

        // Fetch groups the user has joined
        const groupsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/userGroups/${userData.id_User}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!groupsResponse.ok) {
          throw new Error("Failed to fetch groups.");
        }

        const groupsData = await groupsResponse.json();
        console.log("Fetched groups data:", groupsData); // Log pour vérifier les noms des propriétés
        setGroups(groupsData);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleCreateGroup = () => {
    setShowCreateGroupModal(true); // Open the modal directly
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/group/${groupId}`); // Ensure the groupId is passed correctly
  };

  const handleOpenCreateGroupModal = () => {
    setShowCreateGroupModal(true);
  };

  const handleCloseCreateGroupModal = () => {
    setShowCreateGroupModal(false);
    setNewGroupName("");
    setNewGroupDescription("");
  };

  const handleSaveGroup = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/createGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDescription,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create group.");
      }

      console.log("Group created successfully."); // Log pour confirmer la création
      // Refresh groups list
      const groupsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/userGroups/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!groupsResponse.ok) {
        throw new Error("Failed to fetch updated groups.");
      }

      const groupsData = await groupsResponse.json();
      setGroups(groupsData);

      handleCloseCreateGroupModal();
    } catch (err: any) {
      console.error("Error:", err.message); // Log des erreurs
      setError(err.message || "An error occurred while creating the group.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (Array.isArray(groups) && groups.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Mes Groupes</h1>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore rejoint ou créé de groupes.
            </p>
            <Button
              onClick={handleCreateGroup}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Créer un Groupe
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Mes Groupes</h1>
            <Button onClick={handleCreateGroup} className="bg-blue-500 text-white hover:bg-blue-600">
              Créer un Groupe
            </Button>
          </div>
          {Array.isArray(groups) && groups.length === 0 ? (
            <p className="text-center text-muted-foreground">Vous n'avez pas encore de groupes.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(groups) &&
                groups.map((group) => (
                  <Card key={group.id_group} className="p-4 w-full">
                    <CardContent>
                      <h2 className="text-lg font-bold mb-2">{group.name_groups}</h2> {/* Utilisez name_groups */}
                      <p className="text-sm text-muted-foreground mb-4">{group.description_group}</p> {/* Utilisez description_group */}
                      <Button
                        onClick={() => handleViewGroup(group.id_group)}
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        Voir Groupe
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </main>

      {showCreateGroupModal && (
        <Modal onClose={handleCloseCreateGroupModal}>
          <ModalContent>
            <ModalHeader>
              <h2 className="text-lg font-bold">Créer un Groupe</h2>
            </ModalHeader>
            <div className="p-4">
              <label htmlFor="groupName" className="block text-sm font-medium mb-2">
                Nom du Groupe
              </label>
              <input
                id="groupName"
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Entrez le nom du groupe"
              />
              <label htmlFor="groupDescription" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="groupDescription"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Entrez une description"
              />
            </div>
            <ModalFooter>
              <Button onClick={handleSaveGroup} className="mr-2">
                Enregistrer
              </Button>
              <Button onClick={handleCloseCreateGroupModal} variant="secondary">
                Annuler
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
