import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  Target,
  Settings,
  Rocket,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, onOpenPlaceholder, onOpenAllTransactions }) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    if (id === 'dashboard') {
      setActiveTab('dashboard');
    } else if (id === 'transactions') {
      if (onOpenAllTransactions) {
        onOpenAllTransactions();
      } else {
        onOpenPlaceholder('Transactions');
      }
    } else {
      onOpenPlaceholder(id.charAt(0).toUpperCase() + id.slice(1));
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0e0f1d] border-r border-[#1a1b33] flex flex-col justify-between p-5 select-none shrink-0">
      <div className="space-y-8">
        {/* Logo matching the screenshot */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/40 mb-3 border border-purple-400/30">
            <Wallet className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold text-white tracking-wide flex flex-col leading-tight">
              <span>Expense</span>
              <span className="text-[#a78bfa] font-semibold text-base">Tracker</span>
            </h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#7c5cfa] text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#16172e]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-4">
        {/* Promo card: Save more, achieve more! */}
        <div className="relative rounded-2xl bg-[#14152a] border border-[#242647] p-4 text-center overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-tr from-[#3b2d71] to-[#6042b8] flex items-center justify-center shadow-inner">
            <Rocket className="w-6 h-6 text-purple-300 animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-white leading-relaxed">
            Save more,<br />
            <span className="text-slate-400 font-normal">achieve more!</span>
          </p>
        </div>

        {/* User Profile Pill with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-[#14152a]/60 hover:bg-[#1a1b35] border border-transparent hover:border-[#282a50] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center text-slate-300">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white leading-tight">
                  {user?.name || 'Harish S'}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#171830] border border-[#2b2d55] rounded-xl shadow-2xl py-2 px-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3 py-2 border-b border-[#252749]">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-xs font-semibold text-white truncate">{user?.email || 'harish@example.com'}</p>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition mt-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
