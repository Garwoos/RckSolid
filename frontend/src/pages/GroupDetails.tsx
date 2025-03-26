import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";

export default function GroupDetails() {
  const { groupId } = useParams(); // Ensure this retrieves the groupId parameter
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        // Ensure groupId is a string before using it
        if (!groupId) {
          throw new Error("Group ID is missing.");
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/group/${String(groupId)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch group details.");
        }

        const data = await response.json();
        setGroup(data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleAddUserToGroup = () => {
    // Logic to add a user to the group
    console.log("Add user to group");
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">{group?.name_groups}</h1>
          <p className="text-muted-foreground mb-6">{group?.description_group}</p>
          <Button onClick={handleAddUserToGroup} className="bg-blue-500 text-white hover:bg-blue-600">
            Ajouter un utilisateur au groupe
          </Button>
        </div>
      </main>
    </div>
  );
}
