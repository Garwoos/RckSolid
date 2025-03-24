import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button"; // Import Button component
import { Modal, ModalContent, ModalHeader, ModalFooter } from "../components/ui/modal"; // Import Modal components
import Header from "../components/Header"; // Import Header component

export default function Profile() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lolAccounts, setLolAccounts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setError('');
        setLoading(true);

        const token = localStorage.getItem("token");

        // Fetch user information
        const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user information.");
        }

        const userData = await userResponse.json();
        setUserInfo(userData);

        // Fetch linked LoL accounts
        const accountsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/lolAccounts/${userData.id_User}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!accountsResponse.ok) {
          throw new Error("Failed to fetch linked LoL accounts.");
        }

        const accountsData = await accountsResponse.json();
        setLolAccounts(accountsData);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAddLolAccount = () => {
    setShowModal(true);
  };

  const handleSaveLolAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const [name, region] = newAccountName.split("#");
      if (!name || !region) {
        throw new Error("Invalid format. Use Username#Region.");
      }

      // Fetch data from Riot API
      const encodedName = encodeURIComponent(`${name}#${region}`);
      const accountResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/riot/summoner/${encodedName}/account`
      );

      if (!accountResponse.ok) {
        throw new Error("Failed to fetch account information.");
      }

      const accountData = await accountResponse.json();

      const summonerResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/riot/summoner/${accountData.puuid}`
      );

      if (!summonerResponse.ok) {
        throw new Error("Failed to fetch summoner information.");
      }

      const summonerData = await summonerResponse.json();

      const ranksResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/riot/summoner/${summonerData.id}/ranks`
      );

      if (!ranksResponse.ok) {
        throw new Error("Failed to fetch rank information.");
      }

      const ranksData = await ranksResponse.json();

      // Link the account to the user
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/lolAccountToUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          riotid: `${name}#${region}`,
          id_User: userInfo?.id_User,
          leagueId: ranksData[0]?.leagueId || "",
          summonerId: summonerData.id,
          puuid: summonerData.puuid,
          leaguePoints: ranksData[0]?.leaguePoints || 0,
          rank: ranksData[0]?.rank || "",
          tier: ranksData[0]?.tier || "",
          losses: ranksData[0]?.losses || 0,
          wins: ranksData[0]?.wins || 0,
          hotStreak: ranksData[0]?.hotStreak || false,
          freshBlood: ranksData[0]?.freshBlood || false,
          veteran: ranksData[0]?.veteran || false,
          inactive: ranksData[0]?.inactive || false,
          region_lol_account: region,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to link LoL account.");
      }

      // Fetch the updated list of linked accounts
      const accountsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/lolAccounts/${userInfo?.id_User}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!accountsResponse.ok) {
        throw new Error("Failed to fetch updated linked LoL accounts.");
      }

      const accountsData = await accountsResponse.json();
      setLolAccounts(accountsData);

      setNewAccountName("");
      setShowModal(false);
    } catch (err: any) {
      console.error(err.message || "An error occurred while linking the LoL account.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewAccountName("");
  };
  
  const handleDeleteLolAccount = async (riotid: string) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/lolAccountToUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          riotid,
          userId: userInfo?.id_User,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete LoL account.");
      }
  
      // Fetch the updated list of linked accounts
      const accountsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/lolAccounts/${userInfo?.id_User}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!accountsResponse.ok) {
        throw new Error("Failed to fetch updated linked LoL accounts.");
      }
  
      const accountsData = await accountsResponse.json();
      setLolAccounts(accountsData);
    } catch (err: any) {
      console.error(err.message || "An error occurred while deleting the LoL account.");
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
      <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/malphite/skins/skin01/malphiteloadscreen_1.jpg"} alt={userInfo?.name} />
              <AvatarFallback>{userInfo?.name_User?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{userInfo?.name_User}</h2>
              <p className="text-sm text-muted-foreground">{userInfo?.email_User}</p>
              <p className="text-sm text-muted-foreground">
                Member since: {new Date(userInfo?.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6">
          <Button onClick={handleAddLolAccount} className="mb-4">
            Add LoL Account
          </Button>
          <h3 className="text-lg font-bold mb-4">Linked LoL Accounts:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lolAccounts.map((account) => (
              <Card key={account.summonerId} className="p-4 relative">
                <button
                  onClick={() => handleDeleteLolAccount(account.riotid)}
                  className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 rounded-md border-2 border-red-500 bg-white text-red-500 transition-transform duration-200 hover:scale-125"
                  aria-label="Delete account"
                >
                  <p className="text-xs font-normal font-bold">X</p>
                </button>
                <div className="flex flex-col items-center">
                  <img
                    src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${account.tier.toLowerCase()}.png`}
                    alt={`${account.tier} Icon`}
                    className="w-120 h-50 mb-2"
                  />
                  <p className="text-sm font-medium text-center">{account.riotid}</p>
                  <p className="text-sm text-muted-foreground text-center">
                    {account.tier} {account.rank}
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    Wins: {account.wins}, Losses: {account.losses}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          {lolAccounts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              No linked LoL accounts found.
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2 className="text-lg font-bold">Add LoL Account</h2>
            </ModalHeader>
            <div className="p-4">
              <label htmlFor="accountName" className="block text-sm font-medium mb-2">
                Summoner Name
              </label>
              <input
                id="accountName"
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter summoner name"
              />
            </div>
            <ModalFooter>
              <Button onClick={handleSaveLolAccount} className="mr-2">
                Save
              </Button>
              <Button onClick={handleCloseModal} variant="secondary">
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      </div>
    </div>
  );
}
