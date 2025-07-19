import React, { useState } from 'react';
import { User as UserIcon, LayoutDashboard, BookOpen, Users, BarChart3, Settings, HelpCircle, Database, FileText, Award, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '../../assets/images/logo.png';

const Sidebar: React.FC<{ collapsed?: boolean; onToggle?: () => void }> = ({ collapsed = false, onToggle }) => {
  return (
    <aside className={`fixed left-0 top-0 h-full ${collapsed ? 'w-16' : 'w-64'} bg-white border-r shadow-lg flex flex-col justify-between z-40 transition-all duration-300`}>
      <div>
        {/* Collapse/Expand Button */}
        <div className="flex items-center gap-2 px-4 py-4 border-b justify-between">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className={`h-10 w-10 transition-all duration-300 ${collapsed ? 'mx-auto' : ''}`} />
            {!collapsed && <span className="text-xl font-bold text-indigo-700">Tabor Study</span>}
          </div>
          <button onClick={onToggle} className="p-1 rounded hover:bg-indigo-100 transition ml-auto">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        {!collapsed && (
          <div className="px-6 py-4">
            <input type="text" placeholder="Search" className="w-full px-3 py-2 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
        )}
        {/* Navigation */}
        <nav className={`flex flex-col gap-2 px-4 ${collapsed ? 'items-center' : ''}`}>
          {!collapsed && <div className="text-xs text-gray-400 mt-2 mb-1">MAIN</div>}
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active collapsed={collapsed} />
          <SidebarItem icon={<BookOpen size={18} />} label="Exams" collapsed={collapsed} />
          <SidebarItem icon={<Database size={18} />} label="LMS" collapsed={collapsed} />
          <SidebarItem icon={<ClipboardList size={18} />} label="Questions" collapsed={collapsed} />
          <SidebarItem icon={<Users size={18} />} label="Students" collapsed={collapsed} />
          {!collapsed && <div className="text-xs text-gray-400 mt-4 mb-1">MANAGEMENT</div>}
          <SidebarItem icon={<FileText size={18} />} label="Results Database" collapsed={collapsed} />
          <SidebarItem icon={<BarChart3 size={18} />} label="Statistics" collapsed={collapsed} />
          <SidebarItem icon={<Award size={18} />} label="Certificates" collapsed={collapsed} />
          <SidebarItem icon={<ClipboardList size={18} />} label="Surveys" collapsed={collapsed} />
          {!collapsed && <div className="text-xs text-gray-400 mt-4 mb-1">SYSTEM</div>}
          <SidebarItem icon={<Settings size={18} />} label="Settings" collapsed={collapsed} />
          <SidebarItem icon={<HelpCircle size={18} />} label="Help" collapsed={collapsed} />
        </nav>
      </div>
      {/* User Info */}
      <div className={`px-6 py-4 border-t flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
          <UserIcon size={24} />
        </div>
        {!collapsed && (
          <div>
            <div className="font-semibold text-indigo-800 text-sm">Tahsan</div>
            <div className="text-xs text-gray-500">tahsan@gmail.com</div>
          </div>
        )}
      </div>
    </aside>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; collapsed?: boolean }> = ({ icon, label, active, collapsed }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-indigo-100'} ${collapsed ? 'justify-center' : ''}`}>
    {icon}
    {!collapsed && <span className="text-base">{label}</span>}
  </div>
);

const SidebarWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>{children}</div>
    </>
  );
};

export default SidebarWrapper;
