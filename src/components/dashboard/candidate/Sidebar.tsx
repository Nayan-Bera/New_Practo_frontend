import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  User as UserIcon,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Megaphone,
  RotateCw,
  Clock,
  MoreVertical,
  LogOut,
} from "lucide-react";
import Logo from "../../../assets/images/logo.png";
import { getUser } from "../../../utils/localStorage";

// ================================
// Example dynamic values (can be replaced with real data/store)
// ================================
const resumeExamAvailable = true;
const upcomingExamTime = "00:12:45";
const examNotificationCount = 2;

// ================================
// Sidebar Navigation Items
// ================================
const candidateSidebarItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/dashboard" },
  {
    label: "Exams",
    icon: <BookOpen size={18} />,
    to: "/candidate/exam",
    notification: examNotificationCount,
  },
  { label: "Results", icon: <BarChart3 size={18} />, to: "/result" },
  { label: "Past Exams", icon: <Clock size={18} />, to: "/past-exams" },
  { label: "Profile", icon: <UserIcon size={18} />, to: "/profile" },
  {
    label: "Announcements",
    icon: <Megaphone size={18} />,
    to: "/announcements",
  },
  { label: "Report Issue", icon: <AlertTriangle size={18} />, to: "/report" },
  { label: "Settings", icon: <Settings size={18} />, to: "/settings" },
  { label: "Help", icon: <HelpCircle size={18} />, to: "#" },
];

// ================================
// Sidebar Component
// ================================
const Sidebar: React.FC<{ collapsed?: boolean; onToggle?: () => void }> = ({
  collapsed = false,
  onToggle,
}) => {
  const userData = getUser();
  const [menuOpen, setMenuOpen] = useState(false); // dropdown toggle
  const menuRef = useRef<HTMLDivElement>(null);

  if (!userData) {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-500">Not logged in</p>
      </div>
    );
  }

  const { user } = userData;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 h-full ${
        collapsed ? "w-16" : "w-64"
      } bg-white border-r shadow-lg flex flex-col justify-between z-40 transition-all duration-300`}
    >
      {/* ================= HEADER ================= */}
      <div>
        <div className="flex items-center gap-2 px-4 py-4 border-b justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Logo"
              className={`h-10 w-10 transition-all duration-300 ${
                collapsed ? "mx-auto" : ""
              }`}
            />
            {!collapsed && (
              <span className="text-xl font-bold text-indigo-700">
                Tabor Study
              </span>
            )}
          </div>

          {/* Collapse/Expand Button */}
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-indigo-100 transition ml-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* ================= RESUME EXAM SHORTCUT ================= */}
        {resumeExamAvailable && (
          <NavLink
            to="/resume-exam"
            className={`flex items-center gap-3 px-4 py-3 text-sm text-white bg-red-500 hover:bg-red-600 transition justify-center ${
              collapsed
                ? "rounded-full mx-auto my-4 w-10 h-10"
                : "rounded-md mx-4 my-4"
            }`}
          >
            <RotateCw size={18} />
            {!collapsed && <span>Resume Exam</span>}
          </NavLink>
        )}

        {/* ================= NAVIGATION LINKS ================= */}
        <nav
          className={`flex flex-col gap-2 px-4 pt-4 ${
            collapsed ? "items-center" : ""
          }`}
        >
          {candidateSidebarItems.map((item) => (
            <SidebarNavLink
              key={item.label}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              notification={item.notification}
            />
          ))}
        </nav>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="px-6 py-4 border-t relative">
        {/* Upcoming Exam Time */}
        {!collapsed && (
          <div className="mb-3 text-sm text-green-600 font-medium">
            Next Exam: <span className="font-semibold">{upcomingExamTime}</span>
          </div>
        )}

        {/* User Info + Dropdown */}
        <div
          className={`flex items-center gap-3 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {/* Profile Picture */}
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
              <UserIcon size={20} />
            </div>
          )}

          {/* User Name + Email */}
          {!collapsed && user && (
            <div className="flex-1">
              <div className="font-semibold text-indigo-800 text-sm">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          )}

          {/* 3-Dots Menu */}
          {!collapsed && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-1 rounded hover:bg-indigo-100"
              >
                <MoreVertical size={18} />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 bottom-12 w-32 bg-white border shadow-lg rounded-md py-1 z-50">
                  <button
                    onClick={() => {
                      //  Logout logic
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm hover:bg-red-50 text-red-600"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

// ================================
// Sidebar NavLink Component
// ================================
const SidebarNavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed?: boolean;
  notification?: number;
}> = ({ to, icon, label, collapsed, notification }) => {
  const location = useLocation();
  const isActive = to !== "#" && location.pathname.startsWith(to);

  // Disabled link (Help)
  if (to === "#") {
    return (
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-not-allowed text-gray-400 ${
          collapsed ? "justify-center" : ""
        }`}
        title={collapsed ? label : ""}
      >
        {icon}
        {!collapsed && <span className="text-base">{label}</span>}
      </div>
    );
  }

  // Normal NavLink
  return (
    <NavLink
      to={to}
      className={({ isActive: navActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive || navActive
            ? "bg-indigo-50 text-indigo-700 font-semibold"
            : "text-gray-700 hover:bg-indigo-100"
        } ${collapsed ? "justify-center" : ""}`
      }
      end={to === "/dashboard"}
      title={collapsed ? label : ""}
    >
      {/* Icon + Notification */}
      <div className="relative">
        {icon}
        {notification && notification > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
            {notification}
          </span>
        )}
      </div>

      {/* Label */}
      {!collapsed && <span className="text-base">{label}</span>}
    </NavLink>
  );
};

// ================================
// Sidebar Wrapper (Layout Component)
// ================================
const SidebarWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className={`transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default SidebarWrapper;
