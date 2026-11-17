import React from 'react';
import { Wallet, CreditCard, PiggyBank, ArrowUp } from 'lucide-react';

const formatCurrency = (val) => {
  if (val === undefined || val === null) return '₹0';
  const num = Number(val);
  return '₹' + num.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
};

const SummaryCards = ({ summary }) => {
  const income = summary?.total_income ?? 25000;
  const incomeTrend = summary?.income_trend ?? '+5%';
  const expenses = summary?.total_expenses ?? 16750;
  const expensesTrend = summary?.expenses_trend ?? '+12%';
  const savings = summary?.savings ?? 8250;
  const savingsTrend = summary?.savings_trend ?? '+5%';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
      {/* 1. Total Income Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#112423]/90 to-[#0e1b1c]/90 border border-[#1b3d36] p-5 shadow-lg shadow-emerald-950/20 flex items-center justify-between overflow-hidden group hover:border-[#22574c] transition duration-200">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#16483b] border border-[#206351] flex items-center justify-center text-[#22c97a] shadow-inner shrink-0">
            <Wallet className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 tracking-wide block">
              Total Income
            </span>
            <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {formatCurrency(income)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#22c97a] text-xs font-semibold self-center bg-[#16483b]/30 px-2 py-1 rounded-lg">
          <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>{incomeTrend}</span>
        </div>
      </div>

      {/* 2. Total Expenses Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#251522]/90 to-[#1d111c]/90 border border-[#431d2b] p-5 shadow-lg shadow-rose-950/20 flex items-center justify-between overflow-hidden group hover:border-[#5c263a] transition duration-200">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#4b1929] border border-[#692138] flex items-center justify-center text-[#f0485a] shadow-inner shrink-0">
            <CreditCard className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 tracking-wide block">
              Total Expenses
            </span>
            <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {formatCurrency(expenses)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#f0485a] text-xs font-semibold self-center bg-[#4b1929]/30 px-2 py-1 rounded-lg">
          <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>{expensesTrend}</span>
        </div>
      </div>

      {/* 3. Savings Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#181432]/90 to-[#121026]/90 border border-[#2d2256] p-5 shadow-lg shadow-purple-950/20 flex items-center justify-between overflow-hidden group hover:border-[#3d2f73] transition duration-200">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#2e1d5e] border border-[#422987] flex items-center justify-center text-[#a78bfa] shadow-inner shrink-0">
            <PiggyBank className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 tracking-wide block">
              Savings
            </span>
            <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {formatCurrency(savings)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#22c97a] text-xs font-semibold self-center bg-[#16483b]/30 px-2 py-1 rounded-lg">
          <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>{savingsTrend}</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
