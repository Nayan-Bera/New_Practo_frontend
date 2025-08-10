import React from "react";
import { UserCheck, UserX, Shield, Users, Settings } from "lucide-react";
import { useApproveAdminMutation, useGetPendingAdminsQuery, useRejectAdminMutation } from "@/redux/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SuperAdminDashboard: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetPendingAdminsQuery();
  const [approveAdmin, { isLoading: approving }] = useApproveAdminMutation();
  const [rejectAdmin, { isLoading: rejecting }] = useRejectAdminMutation();
  const pendingAdmins = data?.pendingAdmins || [];

  const handleApprove = async (adminId: string) => {
    await approveAdmin(adminId);
    refetch();
  };
  const handleReject = async (adminId: string) => {
    await rejectAdmin(adminId);
    refetch();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-3">
        <Shield className="w-8 h-8 text-indigo-600" /> Super Admin Dashboard
      </h1>
      {/* Pending Admin Approvals */}
      <Card className="p-6 mb-8 bg-white shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <UserCheck className="w-5 h-5 text-green-500" /> Pending Admin Approvals
        </h2>
        {isLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error loading pending admins.</div>
        ) : pendingAdmins.length === 0 ? (
          <div className="text-gray-500">No pending approvals.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pendingAdmins.map((admin: any) => (
              <li key={admin._id} className="flex items-center gap-4 py-3">
                <div className="flex-1">
                  <div className="font-medium">{admin.name}</div>
                  <div className="text-xs text-gray-500">{admin.email} | {admin.college} | {admin.department}</div>
                </div>
                <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg" size="sm" onClick={() => handleApprove(admin._id)} disabled={approving}>
                  Approve
                </Button>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg" size="sm" onClick={() => handleReject(admin._id)} disabled={rejecting}>
                  <UserX className="w-4 h-4 mr-1" /> Reject
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {/* User Management */}
      <Card className="p-6 mb-8 bg-white shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Users className="w-5 h-5 text-blue-500" /> User Management
        </h2>
        <div className="text-gray-500">(User management table coming soon...)</div>
      </Card>
      {/* Security Controls */}
      <Card className="p-6 bg-white shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Settings className="w-5 h-5 text-purple-500" /> Security & Settings
        </h2>
        <div className="text-gray-500">(Security controls and settings coming soon...)</div>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard; 