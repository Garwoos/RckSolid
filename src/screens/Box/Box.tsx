import React from "react";
import { useNavigate } from "react-router-dom";
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

  // Data for summoner cards
  const summoners = [
    { id: 1, name: "Summoner 1", lp: 50, rank: "Master" },
    { id: 2, name: "Summoner 2", lp: 100, rank: "Master" },
    { id: 3, name: "Summoner 3", lp: 10, rank: "For 4" },
    { id: 4, name: "Summoner 4", lp: 1000, rank: "GrandMaster", tier: "ter" },
    { id: 5, name: "Summoner 5", lp: 180, rank: "Master" },
    { id: 6, name: "Summoner 6", lp: 103, rank: "Master" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/avatar.png" alt="Profile" />
          <AvatarFallback>RS</AvatarFallback>
        </Avatar>
        <div className="flex gap-4 items-center">
          <Button variant="link">Link</Button>
          <Button variant="outline" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 font-heading">RckSolid</h1>
          <p className="text-xl text-muted-foreground mb-6">View your rank</p>
          <Input placeholder="Your username/teuw" className="bg-muted/50" />
        </div>

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
                      {summoner.tier && <span>{summoner.tier}</span>}
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
