import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit2, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import type { IUser } from "../../types";
import { getUser, removeUser } from "../../utils/localStorage";
import { Button } from "../ui/button";

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const userData = (getUser() && getUser() !== false) ? (getUser() as { user: IUser }).user : undefined;
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (getUser()) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  const handleLogout = () => {
    removeUser();
    navigate("/signin");
  };

  // --- Dynamic Navbar for Landing Page ---
  const isLandingOrFeedback = location.pathname === "/" || location.pathname === "/feedback";

  // Show Home button on all pages except landing and feedback
  const showHome = !(location.pathname === "/" || location.pathname === "/feedback");

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
      <div className="w-full flex items-center justify-between h-[10vh] min-h-[50px] px-5 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}> 
          <img src={Logo} alt="Logo" style={{ height: "40px" }} />
        </div>
        <div className="flex items-center gap-6">
          <button
            className="text-slate-700 font-medium hover:text-indigo-600 transition-colors text-base bg-transparent border-none cursor-pointer"
            onClick={() => navigate("/")}
          >
           Home
          </button>
          <button
            className="text-slate-700 font-medium hover:text-indigo-600 transition-colors text-base bg-transparent border-none cursor-pointer"
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>
          <button
            className="text-slate-700 font-medium hover:text-indigo-600 transition-colors text-base bg-transparent border-none cursor-pointer"
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </button>
          <button
            className="text-slate-700 font-medium hover:text-indigo-600 transition-colors text-base bg-transparent border-none cursor-pointer"
            onClick={() => navigate("/feedback")}
          >
            Feedback
          </button>
          <Button
            className="w-[120px] font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-700 hover:to-purple-700"
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
    <div className="w-full flex items-center justify-between h-[10vh] min-h-[50px] px-5 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <img src={Logo} alt="Logo" style={{ height: "40px" }} />
        {/* Role-based branding */}
        {userData && (
          <span className="ml-2 text-lg font-semibold text-indigo-700">
            {userData.type === "host" ? "Host Portal" : "Candidate Portal"}
          </span>
        )}
      </div>
      <div className="flex items-center justify-end gap-4">
        {isLogin && userData ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 text-xl font-bold">
                  {userData.name ? userData.name[0].toUpperCase() : <UserIcon size={24} />}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </DropdownMenuItem>
              {userData.type === "host" && (
                <DropdownMenuItem onClick={() => navigate("/host")}>
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
              className="w-[100px] mr-2"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
            <Button
              className="w-[100px]"
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