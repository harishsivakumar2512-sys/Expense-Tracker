import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  Utensils,
  ShoppingBag,
  Bus,
  Film,
  MoreHorizontal,
  FileText,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { addTransactionApi } from '../api';

const categoryConfig = {
  'Food & Dining': { icon: Utensils, defaultId: 1 },
  'Shopping': { icon: ShoppingBag, defaultId: 2 },
  'Transport': { icon: Bus, defaultId: 3 },
  'Entertainment': { icon: Film, defaultId: 4 },
  'Others': { icon: MoreHorizontal, defaultId: 5 },
};

const AddTransactionCard = ({ categories, onTransactionAdded, showToast }) => {
  const [type, setType] = useState('expense');
  const [selectedCategoryName, setSelectedCategoryName] = useState('Food & Dining');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const catList = categories && categories.length > 0 ? categories : [
    { id: 1, name: 'Food & Dining' },
    { id: 2, name: 'Shopping' },
    { id: 3, name: 'Transport' },
    { id: 4, name: 'Entertainment' },
    { id: 5, name: 'Others' },
  ];

  const currentCategory = catList.find((c) => c.name === selectedCategoryName) || catList[0];
  const CurrentIcon = categoryConfig[currentCategory.name]?.icon || Utensils;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    try {
      await addTransactionApi({
        type: type,
        category_id: currentCategory.id,
        amount: parsedAmount,
        note: note.trim() || `${currentCategory.name}`,
      });

      setAmount('');
      setNote('');
      if (showToast) {
        showToast('Transaction added successfully!', 'success');
      }
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err) {
      console.error('Failed to add transaction:', err);
      const errMsg = err.response?.data?.amount?.[0] || 'Failed to record transaction. Please try again.';
      setError(errMsg);
      if (showToast) {
        showToast(errMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#121325] border border-[#202240] p-5 shadow-lg flex flex-col justify-between h-full select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-purple-400 font-bold text-lg leading-none">+</span>
        <h2 className="text-base font-semibold text-white tracking-wide">
          Add Transaction
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Expense / Income Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-[#0b0c17] p-1 rounded-xl border border-[#1d1f3b]">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                type === 'expense'
                  ? 'bg-[#7c5cfa] text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                type === 'income'
                  ? 'bg-[#7c5cfa] text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Income</span>
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#181932] border border-[#26284f] hover:border-[#373a6e] text-slate-200 text-sm transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <CurrentIcon className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-white text-xs sm:text-sm">
                  {currentCategory.name}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#181932] border border-[#2e3160] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                {catList.map((cat) => {
                  const Icon = categoryConfig[cat.name]?.icon || MoreHorizontal;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryName(cat.name);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2 text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-[#232549] transition text-left cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-purple-400" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[#181932] border border-[#26284f] focus-within:border-[#7c5cfa] transition">
            <span className="text-slate-400 font-bold text-sm mr-2.5">₹</span>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-medium"
            />
          </div>

          {/* Note Input */}
          <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[#181932] border border-[#26284f] focus-within:border-[#7c5cfa] transition">
            <FileText className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Add note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs px-1 font-medium">{error}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#7c5cfa] hover:bg-[#6c48f2] active:scale-[0.99] disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition duration-150 cursor-pointer"
        >
          <span>{loading ? 'Adding...' : 'Add Transaction'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AddTransactionCard;
