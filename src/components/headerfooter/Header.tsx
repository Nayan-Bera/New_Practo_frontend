import React, { useState, useEffect } from "react";
import { getUser, removeUser } from "../../utils/localStorage";
import history from "../../utils/createHistory";
import { LogOut } from "lucide-react";
import WelcomeName from "../pages/profile";
import Logo from "../../assets/images/logo.png";
import { Button } from "../ui/button";
import { useSignOutMutation } from "../../redux/services/api";
import type { IAppState, IUser } from "../../types";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const user = useSelector<IAppState, IUser | null>((state) => state.user);
  const [signOutMutation] = useSignOutMutation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const check: boolean =
    history.location.pathname === "/host" ||
    history.location.pathname === "/exam";

  useEffect(() => {
    if (getUser()) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOutMutation().unwrap();
    } catch (e) {
      // Optionally handle error
    }
    removeUser();
    history.push("/signin");
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
        {showHome && (
          <Button
            variant="ghost"
            className="font-semibold text-base"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
        )}
        <img src={Logo} alt="Logo" style={{ height: "40px" }} />
      </div>
      <div className="flex items-center justify-end gap-4">
        {isLogin ? (
          <>
            <WelcomeName />
            {!check && (
              <Button
                variant="ghost"
                onClick={() => history.push("/host")}
                className="ml-5"
              >
                Dashboard
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="ml-5"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              className="w-[100px] mr-2"
              onClick={() => history.push("/signin")}
            >
              Sign In
            </Button>
            <Button
              className="w-[100px]"
              variant="outline"
              onClick={() => history.push("/signup")}
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