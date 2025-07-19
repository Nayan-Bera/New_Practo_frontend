import React from 'react';
import SidebarWrapper from './Sidebar';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarWrapper>
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </SidebarWrapper>
  );
};

export default DashboardLayout;
