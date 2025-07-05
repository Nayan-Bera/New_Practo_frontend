import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Don't show header and footer on auth pages
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className={`flex-1 flex flex-col ${isAuthPage ? 'overflow-hidden' : 'overflow-auto bg-success'}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default Layout; 