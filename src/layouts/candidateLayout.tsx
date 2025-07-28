// src/layouts/CandidateLayout.tsx

import SidebarWrapper from '@/components/dashboard/candidate/Sidebar';
import React from 'react';

const CandidateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarWrapper>
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarWrapper>
  );
};

export default CandidateLayout;
