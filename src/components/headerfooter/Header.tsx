import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import type { IUser } from "../../types";
import { getUser, removeUser } from "../../utils/localStorage";
import { Button } from "../ui/button";

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userDataState, setUserDataState] = useState(getUser() ? (getUser() as { user: IUser }).user : undefined);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (getUser()) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const updated = (getUser() && getUser() !== false) ? (getUser() as { user: IUser }).user : undefined;
      setUserDataState(updated);
    };
    window.addEventListener("userProfileUpdated", handler);
    return () => window.removeEventListener("userProfileUpdated", handler);
  }, []);

  const handleLogout = () => {
    removeUser();
    navigate("/signin");
  };

  // --- Dynamic Navbar for Landing Page ---
  const isLandingOrFeedback = location.pathname === "/" || location.pathname === "/feedback";


  // Smooth scroll to section by id
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      // fallback: go to landing page and scroll after navigation
      navigate("/", { replace: false });
      setTimeout(() => {
        const el2 = document.getElementById(id);
        if (el2) el2.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  if (isLandingOrFeedback) {
    return (
      <div className="w-full flex items-center justify-between h-[10vh] min-h-[50px] px-5 bg-indigo-50 border-b border-indigo-100 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" style={{ height: "40px" }} className="cursor-pointer" onClick={() => navigate("/")} />
          <span className="ml-2 text-xl font-semibold text-indigo-700 tracking-wide">Practo</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            className="text-indigo-700 font-medium hover:text-indigo-900 transition-colors text-base bg-transparent border-none cursor-pointer px-2 py-1 rounded-lg hover:bg-indigo-100 focus:outline-none"
            onClick={() => navigate("/")}
          >
           Home
          </button>
          <button
            className="text-indigo-700 font-medium hover:text-indigo-900 transition-colors text-base bg-transparent border-none cursor-pointer px-2 py-1 rounded-lg hover:bg-indigo-100 focus:outline-none"
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>
          <button
            className="text-indigo-700 font-medium hover:text-indigo-900 transition-colors text-base bg-transparent border-none cursor-pointer px-2 py-1 rounded-lg hover:bg-indigo-100 focus:outline-none"
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </button>
          <button
            className="text-indigo-700 font-medium hover:text-indigo-900 transition-colors text-base bg-transparent border-none cursor-pointer px-2 py-1 rounded-lg hover:bg-indigo-100 focus:outline-none"
            onClick={() => navigate("/feedback")}
          >
            Feedback
          </button>
          <Button
            className="w-[120px] font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors rounded-lg border-none"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  // --- Default Navbar for other pages ---
  return (
    <div className="w-full flex items-center justify-between h-[10vh] min-h-[50px] px-5 bg-indigo-50 border-b border-indigo-100 shadow-md">
      <div className="flex items-center gap-4">
        <img src={Logo} alt="Logo" style={{ height: "40px" }} className="cursor-pointer" onClick={() => navigate("/")} />
        {userDataState && (
          <span
            className="ml-2 text-lg font-semibold text-indigo-700 tracking-wide cursor-pointer hover:underline hover:text-indigo-900 transition-colors"
            onClick={() => {
              if (userDataState.type === "admin") navigate("/admin");
              else if (userDataState.type === "candidate") navigate("/dashboard");
              // else do nothing
            }}
          >
            {userDataState.type === "admin"
              ? "Admin Portal"
              : userDataState.type === "candidate"
              ? "Candidate Portal"
              : null}
          </span>
        )}
      </div>
      <div className="flex items-center justify-end gap-4">
        {isLogin && userDataState ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 text-xl font-bold ring-1 ring-indigo-200 overflow-hidden">
                  {userDataState.profilePicture ? (
                    <img src={userDataState.profilePicture} alt="Profile" className="w-10 h-10 object-cover rounded-full" />
                  ) : userDataState.name ? (
                    userDataState.name[0].toUpperCase()
                  ) : (
                    <UserIcon size={24} />
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}> 
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </DropdownMenuItem>
              {(userDataState.type === "admin" || userDataState.type === "candidate") && (
                <DropdownMenuItem onClick={() => navigate(userDataState.type === "admin" ? "/admin" : "/dashboard")}> 
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}> 
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button
              className="w-[100px] mr-2 bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:text-indigo-900 transition-colors rounded-lg shadow-sm"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
            <Button
              className="w-[100px] bg-indigo-600 text-white border-none hover:bg-indigo-700 transition-colors rounded-lg shadow-sm"
              variant="outline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header; 