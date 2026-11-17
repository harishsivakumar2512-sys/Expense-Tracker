import React from 'react';
import {
  Clock,
  Utensils,
  Bus,
  Briefcase,
  ShoppingCart,
  Film,
  MoreHorizontal
} from 'lucide-react';

const getCategoryIconAndStyle = (note = '', categoryName = '', type = 'expense') => {
  const lowerNote = note.toLowerCase();
  const lowerCat = categoryName.toLowerCase();

  if (lowerNote.includes('domino') || lowerCat.includes('food') || lowerCat.includes('dining')) {
    return {
      Icon: Utensils,
      bg: 'bg-[#3d1a29]',
      border: 'border-[#552033]',
      text: 'text-[#f0485a]'
    };
  }
  if (lowerNote.includes('bus') || lowerCat.includes('transport')) {
    return {
      Icon: Bus,
      bg: 'bg-[#153f34]',
      border: 'border-[#1e5c4a]',
      text: 'text-[#22c97a]'
    };
  }
  if (type === 'income' || lowerNote.includes('freelance') || lowerNote.includes('salary')) {
    return {
      Icon: Briefcase,
      bg: 'bg-[#153f34]',
      border: 'border-[#1e5c4a]',
      text: 'text-[#22c97a]'
    };
  }
  if (lowerNote.includes('amazon') || lowerCat.includes('shopping')) {
    return {
      Icon: ShoppingCart,
      bg: 'bg-[#291e56]',
      border: 'border-[#3f2a87]',
      text: 'text-[#a78bfa]'
    };
  }
  if (lowerCat.includes('entertainment')) {
    return {
      Icon: Film,
      bg: 'bg-[#3b1f52]',
      border: 'border-[#582b7d]',
      text: 'text-[#c084fc]'
    };
  }

  return {
    Icon: MoreHorizontal,
    bg: 'bg-[#1e203c]',
    border: 'border-[#2d3059]',
    text: 'text-slate-300'
  };
};

const formatAmount = (amount, type) => {
  const num = Number(amount);
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
  if (type === 'income') {
    return `+ ₹${formatted}`;
  }
  return `- ₹${formatted}`;
};

const RecentTransactions = ({ transactions, onSeeAll }) => {
  const displayList = transactions?.slice(0, 4) || [];

  return (
    <div className="rounded-2xl bg-[#121325] border border-[#202240] p-5 shadow-lg flex flex-col justify-between h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold text-white tracking-wide">
            Recent Transactions
          </h2>
        </div>
        <button
          onClick={onSeeAll}
          className="text-xs font-semibold text-[#7c5cfa] hover:text-[#9075fc] transition flex items-center gap-1 cursor-pointer"
        >
          <span>See All</span>
          <span>→</span>
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3 pt-1">
        {displayList.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No recent transactions found.
          </div>
        ) : (
          displayList.map((tx) => {
            const { Icon, bg, border, text } = getCategoryIconAndStyle(
              tx.note,
              tx.category_name,
              tx.type
            );
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#181932] transition group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center ${text} shadow-inner shrink-0`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-purple-200 transition">
                      {tx.note || tx.category_name || 'Transaction'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {tx.formatted_date}
                    </p>
                  </div>
                </div>

                <div
                  className={`text-sm font-bold tracking-tight ${
                    isIncome ? 'text-[#22c97a]' : 'text-[#f0485a]'
                  }`}
                >
                  {formatAmount(tx.amount, tx.type)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
