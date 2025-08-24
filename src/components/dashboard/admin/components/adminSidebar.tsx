import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Eye,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const adminMenu = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  {
    title: "Exams",
    icon: BookOpen,
    children: [
      { title: "Create Exam", path: "/admin/exams/create" },
      { title: "Manage Exams", path: "/admin/exams" },
      { title: "Upcoming Exams", path: "/admin/exams/upcoming" },
      { title: "Current Exams", path: "/admin/exams/current" },
    ],
  },
  {
    title: "Candidates",
    icon: Users,
    children: [
      { title: "Approve Candidates", path: "/admin/candidates/approve" },
      { title: "Candidate Profiles", path: "/admin/candidates" },
    ],
  },
  {
    title: "Proctoring",
    icon: Eye,
    children: [
      { title: "Live Monitoring", path: "/admin/proctor/live" },
      { title: "Send Warnings", path: "/admin/proctor/warnings" },
      { title: "Disconnections", path: "/admin/proctor/disconnections" },
      { title: "Anti-Cheating Reports", path: "/admin/proctor/reports" },
    ],
  },
  {
    title: "Results",
    icon: BarChart3,
    children: [
      { title: "View Results", path: "/admin/results" },
      { title: "Download Logs", path: "/admin/results/logs" },
    ],
  },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
  { title: "Logout", icon: LogOut, path: "/logout" },
];

interface AdminSidebarProps {
  children: React.ReactNode;
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-md p-4">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Admin Panel</h2>
        <nav className="space-y-2">
          {adminMenu.map((item, idx) => (
            <div key={idx}>
              {item.children ? (
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child, cIdx) => (
                      <NavLink
                        key={cIdx}
                        to={child.path}
                        className={({ isActive }) =>
                          `block px-2 py-1 rounded-md text-sm ${
                            isActive
                              ? "bg-blue-100 text-blue-600 font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  to={item.path!}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-2 py-2 rounded-md ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main content injected here */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
