import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header"; // Import the Header component
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const Box = (): JSX.Element => {
  const navigate = useNavigate(); // Hook pour la navigation
  const [username, setUsername] = useState(""); // État pour le champ d'entrée
  const [summonerInfo, setSummonerInfo] = useState<any>(null); // État pour les infos du joueur
  const [error, setError] = useState(""); // État pour les erreurs
  const [loading, setLoading] = useState(false); // État pour le chargement

  const handleSearch = async () => {
    setError("");
    setLoading(true);
    setSummonerInfo(null);

    try {
      const [name, region] = username.split("#");
      if (!name || !region) {
        throw new Error("Format invalide. Utilisez Username#Region.");
      }

      console.log(`Recherche pour le summoner: ${name}, région: ${region}`);

      // Check if the account exists in the database and if the data is recent
      const dbAccountResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/db/lolAccount/${encodeURIComponent(`${name}#${region}`)}`
      );

      if (dbAccountResponse.ok) {
        const dbAccountData = await dbAccountResponse.json();
        const lastChecked = new Date(dbAccountData.riot_api_last_checked);
        const now = new Date();

        console.log("Données récupérées depuis la base de données:", dbAccountData);

        // If the data is less than 5 minutes old, use it
        if ((now.getTime() - lastChecked.getTime()) / 1000 < 300) {
          console.log("Using cached data from the database.");
          setSummonerInfo({
            ...dbAccountData,
            ranks: [
              {
                queueType: "RANKED_SOLO_5x5",
                tier: dbAccountData.tier,
                rank: dbAccountData.rank,
                leaguePoints: dbAccountData.leaguePoints,
                wins: dbAccountData.wins,
                losses: dbAccountData.losses,
              },
            ],
          });
          return;
        }
      }

      // Fetch data from Riot API if not recent
      const encodedName = encodeURIComponent(`${name}#${region}`);
      const accountResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/riot/summoner/${encodedName}/account`
      );

      if (!accountResponse.ok) {
        const errorText = await accountResponse.text();
        console.error('Erreur API backend (account):', accountResponse.status, errorText);
        throw new Error("Impossible de récupérer les informations du compte.");
      }

      const accountData = await accountResponse.json();
      console.log('Données du compte reçues:', accountData);

      const summonerResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/riot/summoner/${accountData.puuid}`
      );

      if (!summonerResponse.ok) {
        const errorText = await summonerResponse.text();
        console.error('Erreur API backend (summoner):', summonerResponse.status, errorText);
        throw new Error("Impossible de récupérer les informations du joueur.");
      }

      const summonerData = await summonerResponse.json();
      console.log('Données du joueur reçues:', summonerData);

      const ranksResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/riot/summoner/${summonerData.id}/ranks`
      );

      if (!ranksResponse.ok) {
        const errorText = await ranksResponse.text();
        console.error('Erreur API backend (ranks):', ranksResponse.status, errorText);
        throw new Error("Impossible de récupérer les informations des rangs.");
      }

      const ranksData = await ranksResponse.json();
      console.log('Données des rangs reçues:', ranksData);

      // Add or update account in the database
      const addAccountResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/db/lolAccount`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            riotid: `${name}#${region}`,
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
        }
      );

      if (!addAccountResponse.ok) {
        const errorText = await addAccountResponse.text();
        console.error('Erreur lors de l\'ajout du compte:', addAccountResponse.status, errorText);
        throw new Error("Impossible d'ajouter le compte à la base de données.");
      }

      console.log('Compte ajouté ou déjà existant dans la base de données.');

      setSummonerInfo({
        ...summonerData,
        ranks: ranksData,
      });
    } catch (err: any) {
      console.error('Erreur lors de la recherche:', err.message);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // Data for summoner cards
  const summoners = [
    { id: 1, name: "Summoner 1", lp: 50, rank: "Master" },
    { id: 2, name: "Summoner 2", lp: 100, rank: "Master" },
    { id: 3, name: "Summoner 3", lp: 10, rank: "Fer 4" },
    { id: 4, name: "Summoner 4", lp: 1000, rank: "GrandMaster"},
    { id: 5, name: "Summoner 5", lp: 180, rank: "Master" },
    { id: 6, name: "Summoner 6", lp: 103, rank: "Master" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header /> {/* Use the Header component */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 font-heading">RckSolid</h1>
          <p className="text-xl text-muted-foreground mb-6">View your rank</p>
          <div className="flex gap-2">
            <Input
              placeholder="Le Capybara#EUW"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-muted/50"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Display ranks data */}
        {summonerInfo && summonerInfo.ranks && (
          <div className="max-w-md w-full mx-auto text-center mb-12">
            <h2 className="text-lg font-semibold mb-4">Ranked Data</h2>
            <ul className="text-left">
              {summonerInfo.ranks
                .filter((rank: any) => rank.queueType !== "RANKED_FLEX_SR")
                .map((rank: any, index: number) => (
                  <li key={index} className="mb-4 flex items-center gap-4">
                    {/* Icône du rang */}
                    <img
                      src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${rank.tier.toLowerCase()}.png`}
                      alt={`${rank.tier} Icon`}
                    />
                    <div>
                      <p>
                        <strong>Queue:</strong> {rank.queueType}
                      </p>
                      <p>
                        <strong>Tier:</strong> {rank.tier} {rank.rank} - {rank.leaguePoints} LP
                      </p>
                      <p>
                        <strong>Wins:</strong> {rank.wins} | <strong>Losses:</strong> {rank.losses}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {summonerInfo && summonerInfo.name && (
          <div className="w-full max-w-md mx-auto mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`https://ddragon.leagueoflegends.com/cdn/12.22.1/img/profileicon/${summonerInfo.profileIconId}.png`}
                      alt={summonerInfo.name}
                    />
                    <AvatarFallback>{summonerInfo.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-bold">{summonerInfo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Level: {summonerInfo.summonerLevel}
                    </p>
                    {summonerInfo.ranks && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Ranks:</p>
                        {summonerInfo.ranks
                          .filter((rank: any) => rank.queueType !== "RANKED_FLEX_SR")
                          .map((rank: any, index: number) => (
                            <p key={index} className="text-sm text-muted-foreground">
                              {rank.queueType}: {rank.tier} {rank.rank} - {rank.leaguePoints} LP
                            </p>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Your friends ranking</h2>
            <p className="text-muted-foreground">They are sooo bad</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summoners.map((summoner) => (
              <Card key={summoner.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`/summoner-${summoner.id}.png`}
                      alt={summoner.name}
                    />
                    <AvatarFallback>{summoner.id}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{summoner.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {summoner.lp} LP
                      </span>
                      <span className="mx-1">•</span>
                      <span>{summoner.rank}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t flex justify-center gap-4">
        <a href="#" aria-label="Twitter">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
        </a>
        <a href="#" aria-label="Instagram">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
          </svg>
        </a>
        <a href="#" aria-label="YouTube">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
            <path d="m10 15 5-3-5-3z"></path>
          </svg>
        </a>
        <a href="#" aria-label="LinkedIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect width="4" height="12" x="2" y="9"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
      </footer>
    </div>
  );
};
