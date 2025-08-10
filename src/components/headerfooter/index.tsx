import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Show header & footer only on landing page
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {isLandingPage && <Header />}
      <main className={`flex-1 flex flex-col ${isLandingPage ? 'overflow-auto bg-success' : 'overflow-hidden'}`}>
        {children}
      </main>
      {isLandingPage && <Footer />}
    </div>
  );
};

export default Layout;
