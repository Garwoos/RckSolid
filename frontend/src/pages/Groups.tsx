import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
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

        // Fetch user groups
        const groupsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/userGroups/${userData.id_User}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!groupsResponse.ok) {
          throw new Error("Failed to fetch groups.");
        }

        const groupsData = await groupsResponse.json();
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
    navigate("/create-group"); // Redirige vers une page pour créer un groupe
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/group/${groupId}`); // Redirige vers la page du groupe
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
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
                      <h2 className="text-lg font-bold mb-2">{group.name}</h2>
                      <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
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
    </div>
  );
}
