import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Avatar } from "./ui/avatar";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/feed")}
        >
          <h1 className="text-2xl font-bold">Scrolla</h1>
        </div>
        <div className="flex items-center gap-4">
          <Avatar
            className="h-8 w-8 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            {user?.profilePicture ? (
              <img
                className="h-full w-full rounded-full object-cover"
                src={user.profilePicture}
                alt="User"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-600">
                {user?.firstName[0]}
                {user?.lastName[0]}
              </div>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
