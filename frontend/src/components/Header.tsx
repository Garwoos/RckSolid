import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // Check if the user is logged in

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Avatar className="h-10 w-10">
        <AvatarImage src="/avatar.png" alt="Profile" />
        <AvatarFallback>RS</AvatarFallback>
      </Avatar>
      <div className="flex gap-4 items-center">
        {isLoggedIn ? (
          <Button variant="outline" onClick={() => navigate("/profile")}>
            Voir Profile
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
