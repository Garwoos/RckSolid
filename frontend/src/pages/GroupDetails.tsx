import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "../components/ui/modal";
import GroupAgenda from "../components/GroupAgenda";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [lolAccounts, setLolAccounts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState(""); // Updated state variable

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!groupId) {
          throw new Error("Group ID is missing.");
        }

        // Fetch group details
        const groupResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/group/${String(groupId)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!groupResponse.ok) {
          throw new Error("Failed to fetch group details.");
        }

        const groupData = await groupResponse.json();
        setGroup(groupData);

        // Fetch linked LoL accounts
        const accountsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/group/${String(groupId)}/lolAccounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!accountsResponse.ok) {
          throw new Error("Failed to fetch LoL accounts.");
        }
        
        const accountsData = await accountsResponse.json();
        setLolAccounts(accountsData);

        console.log(accountsData);

        // Fetch group members
        const membersResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/group/${String(groupId)}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!membersResponse.ok) {
          throw new Error("Failed to fetch group members.");
        }

        const membersData = await membersResponse.json();
        setMembers(membersData);
        console.log(membersData);

        // fetch linked users for each account
        const updatedAccountsData = await Promise.all(
          accountsData.map(async (account: any) => {
            const linkedUsersResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/lolaccounts/${account.riotid}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!linkedUsersResponse.ok) {
              throw new Error("Failed to fetch linked users.");
            }

            const linkedUsersData = await linkedUsersResponse.json();
            return { ...account, linkedUsers: linkedUsersData };
          })
        );
        setLolAccounts(updatedAccountsData);

        console.log(updatedAccountsData);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleAddMember = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/group/${String(groupId)}/user/${newMemberName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add member.");
      }

      // Reload the page after successfully adding the member
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "An error occurred while adding the member.");
    }
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
        {/* Top Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{group?.name_groups}</h1>
          <p className="text-muted-foreground">{group?.description_group}</p>
        </div>

        <div className="flex">
          {/* Middle Section (80%) */}
          <div className="w-4/5 pr-4">
            <h2 className="text-xl font-bold mb-4">Comptes LoL</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lolAccounts.map((account) => (
                <div key={account.riotid} className="p-4 border rounded shadow flex">
                  {/* Left Section (70%) */}
                  <div className="flex-grow pr-4 w-7/10">
                    <h3 className="font-bold">{account.riotid}</h3>
                    <p>{account.tier} {account.rank} ({account.lp} LP)</p>
                    <p>Wins: {account.wins} / Losses: {account.losses}</p>
                    <p>Winrate: {((account.wins / (account.wins + account.losses)) * 100).toFixed(2)}%</p>
                    {/* Display linked users */}
                    <p className="mt-2 font-medium">Utilisateurs liés :</p>
                    <ul className="list-disc list-inside">
                      {account.linkedUsers && account.linkedUsers.length > 0 ? (
                        account.linkedUsers.map((user) => (
                          <li key={user.id_User}>{user.name_User}</li>
                        ))
                      ) : (
                        <li>Aucun utilisateur lié</li>
                      )}
                    </ul>
                  </div>
                  {/* Right Section (30%) */}
                  <div className="flex-shrink-0 w-3/10 flex items-center justify-end">
                    <div className="relative w-24 h-24 overflow-hidden rounded-full">
                      <img
                        src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${account.tier.toLowerCase()}.png`}
                        alt={`${account.tier} emblem`}
                        className="absolute inset-0 w-full h-full object-cover object-center scale-150"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section (20%) */}
          <div className="w-1/5 pl-4">
            <h2 className="text-xl font-bold mb-4">Membres</h2>
            <Button
              onClick={() => setShowAddMemberModal(true)}
              className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
            >
              Ajouter un Membre
            </Button>
            <ul className="space-y-2">
              {members.map((member) => (
                <li key={member.id_User} className="p-2 border rounded shadow">
                  {member.name_User}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Agenda</h2>
          <GroupAgenda groupId={groupId!} />
        </div>
      </main>

      {showAddMemberModal && (
        <Modal onClose={() => setShowAddMemberModal(false)}>
          <ModalContent>
            <ModalHeader>
              <h2 className="text-lg font-bold">Ajouter un Membre</h2>
            </ModalHeader>
            <div className="p-4">
              <label htmlFor="memberName" className="block text-sm font-medium mb-2">
                Nom du Membre
              </label>
              <input
                id="memberName"
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Entrez le nom du membre"
              />
            </div>
            <ModalFooter>
              <Button onClick={handleAddMember} className="mr-2">
                Ajouter
              </Button>
              <Button onClick={() => setShowAddMemberModal(false)} variant="secondary">
                Annuler
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
