import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="flex flex-col h-[90vh] overflow-auto bg-success">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 