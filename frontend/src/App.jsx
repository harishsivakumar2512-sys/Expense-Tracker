import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Menu, X, Wallet } from 'lucide-react';

const MainLayout = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allTransactionsOpen, setAllTransactionsOpen] = useState(false);
  const [placeholderState, setPlaceholderState] = useState({ isOpen: false, title: '' });

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#090a12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 animate-pulse flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium text-slate-400">Loading Expense Tracker...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
  }

  const handleOpenPlaceholder = (title) => {
    setPlaceholderState({ isOpen: true, title });
    setMobileMenuOpen(false);
  };

  const handleOpenAllTransactions = () => {
    setAllTransactionsOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090a12] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0e0f1d] border-b border-[#1a1b33]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-base">
            Expense <span className="text-purple-400">Tracker</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-[#171830] text-slate-300 hover:text-white transition cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar (hidden on mobile, drawer on small screens) */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenPlaceholder={handleOpenPlaceholder}
          onOpenAllTransactions={handleOpenAllTransactions}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex">
          <div className="w-64 bg-[#0e0f1d] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              onOpenPlaceholder={handleOpenPlaceholder}
              onOpenAllTransactions={handleOpenAllTransactions}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardPage
          activeTab={activeTab}
          onOpenPlaceholder={handleOpenPlaceholder}
          allTransactionsOpen={allTransactionsOpen}
          setAllTransactionsOpen={setAllTransactionsOpen}
          placeholderState={placeholderState}
          setPlaceholderState={setPlaceholderState}
        />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
