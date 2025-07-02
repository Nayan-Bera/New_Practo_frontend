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

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const user = useSelector<IAppState, IUser | null>((state) => state.user);
  const [signOutMutation] = useSignOutMutation();
  
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

  return (
    <div className="w-full flex items-center justify-between h-[10vh] min-h-[50px] px-5 bg-white shadow-sm">
      <div className="flex items-center">
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