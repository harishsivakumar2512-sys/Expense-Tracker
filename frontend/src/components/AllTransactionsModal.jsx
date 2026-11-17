import React, { useState } from 'react';
import { X, Search, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { deleteTransactionApi } from '../api';

const AllTransactionsModal = ({ isOpen, onClose, transactions, onTransactionDeleted, showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  if (!isOpen) return null;

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.category_name && tx.category_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    setDeletingId(id);
    try {
      await deleteTransactionApi(id);
      if (showToast) showToast('Transaction deleted', 'success');
      if (onTransactionDeleted) onTransactionDeleted();
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to delete transaction', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#14152a] border border-[#272952] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#23254a] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">All Transactions</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and manage your complete transaction history
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1f203d] hover:bg-[#2b2c52] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-[#23254a] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by note or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#191a33] border border-[#26284f] rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#7c5cfa] transition"
            />
          </div>
          <div className="flex bg-[#191a33] p-1 rounded-xl border border-[#26284f]">
            {['all', 'expense', 'income'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  filterType === t
                    ? 'bg-[#7c5cfa] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No transactions match your search.
            </div>
          ) : (
            filtered.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#181932] border border-[#222446] hover:border-[#323564] transition group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-[#153f34] text-[#22c97a]'
                          : 'bg-[#3d1a29] text-[#f0485a]'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {tx.note || tx.category_name || 'Transaction'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tx.formatted_date || new Date(tx.created_at).toLocaleString()} •{' '}
                        <span className="text-purple-300">{tx.category_name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-bold ${
                        isIncome ? 'text-[#22c97a]' : 'text-[#f0485a]'
                      }`}
                    >
                      {isIncome ? '+' : '-'} ₹
                      {Number(tx.amount).toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={deletingId === tx.id}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTransactionsModal;
