import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Don't show header and footer on auth pages or dashboard
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && !isDashboard && <Header />}
      <main className={`flex-1 flex flex-col ${isAuthPage ? 'overflow-hidden' : 'overflow-auto bg-success'}`}>
        {children}
      </main>
      {!isAuthPage && !isDashboard && <Footer />}
    </div>
  );
};

export default Layout; 