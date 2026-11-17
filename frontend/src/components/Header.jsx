import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ period, setPeriod, onPeriodChange }) => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const periods = [
    { id: 'this_month', label: 'This Month' },
    { id: 'last_month', label: 'Last Month' },
    { id: '6_months', label: '6 Months' },
    { id: 'this_year', label: 'This Year' },
  ];

  const currentLabel = periods.find((p) => p.id === period)?.label || 'This Month';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setPeriod(id);
    setDropdownOpen(false);
    if (onPeriodChange) onPeriodChange(id);
  };

  const displayName = user?.name?.split(' ')[0] || 'Harish';

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 select-none">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Hello, {displayName}!</span>
          <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-normal">
          Track your expenses, manage your money.
        </p>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#14152a] hover:bg-[#1a1b35] border border-[#26284d] text-slate-200 text-sm font-medium transition cursor-pointer shadow-sm"
        >
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{currentLabel}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-[#171832] border border-[#2c2f58] rounded-xl shadow-2xl py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`w-full text-left px-4 py-2 text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                  p.id === period
                    ? 'text-white bg-[#7c5cfa]/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#202242]'
                }`}
              >
                <span>{p.label}</span>
                {p.id === period && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cfa]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
