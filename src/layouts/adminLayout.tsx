// src/layouts/AdminLayout.tsx

import AdminSidebar from "@/components/dashboard/admin/components/adminSidebar";
import React from "react";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminSidebar>
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminSidebar>
  );
};

export default AdminLayout;
