import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook pour obtenir le chemin actuel
  const isLoggedIn = !!localStorage.getItem("token"); // Check if the user is logged in

  const handleLogOff = () => {
    localStorage.removeItem("token"); // Supprime le token de l'utilisateur
    navigate("/"); // Redirige vers la page d'accueil
  };

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Avatar
        className="h-10 w-10 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <AvatarImage
          src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/malphite/skins/skin01/malphiteloadscreen_1.jpg"
          alt="Profile"
        />
        <AvatarFallback>RS</AvatarFallback>
      </Avatar>
      <div className="flex gap-4 items-center">
        {isLoggedIn ? (
          <>
            <Button variant="outline" onClick={() => navigate("/groups")}>
              Mes Groupes
            </Button>
            {location.pathname === "/profile" ? (
              <Button variant="outline" onClick={() => navigate("/")}>
                Accueil
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/profile")}>
                Voir Profile
              </Button>
            )}
            <Button
              onClick={handleLogOff}
              variant="secondary"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Log Off
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
