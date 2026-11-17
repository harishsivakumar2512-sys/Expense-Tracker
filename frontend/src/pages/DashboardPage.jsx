import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import ExpenseOverviewChart from '../components/ExpenseOverviewChart';
import AddTransactionCard from '../components/AddTransactionCard';
import RecentTransactions from '../components/RecentTransactions';
import CategorySpendingChart from '../components/CategorySpendingChart';
import AllTransactionsModal from '../components/AllTransactionsModal';
import PlaceholderModal from '../components/PlaceholderModal';
import Toast from '../components/Toast';
import {
  getSummaryApi,
  getOverviewApi,
  getCategorySpendingApi,
  getTransactionsApi,
  getCategoriesApi,
} from '../api';

const DashboardPage = ({ activeTab, onOpenPlaceholder, allTransactionsOpen, setAllTransactionsOpen, placeholderState, setPlaceholderState }) => {
  const [period, setPeriod] = useState('this_month');
  const [overviewRange, setOverviewRange] = useState('this_month');
  const [summary, setSummary] = useState(null);
  const [overviewData, setOverviewData] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 4000);
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const [sumRes, overRes, catSpendRes, txRes, catRes] = await Promise.all([
        getSummaryApi(period),
        getOverviewApi(overviewRange),
        getCategorySpendingApi(period),
        getTransactionsApi(),
        getCategoriesApi(),
      ]);

      setSummary(sumRes);
      setOverviewData(overRes.data);
      setCategoryData(catSpendRes);
      setAllTransactions(txRes);
      setRecentTransactions(txRes.slice(0, 4));
      setCategories(catRes);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [period, overviewRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handlePeriodChange = async (newPeriod) => {
    try {
      const [sumRes, catSpendRes] = await Promise.all([
        getSummaryApi(newPeriod),
        getCategorySpendingApi(newPeriod),
      ]);
      setSummary(sumRes);
      setCategoryData(catSpendRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOverviewRangeChange = async (newRange) => {
    try {
      const overRes = await getOverviewApi(newRange);
      setOverviewData(overRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransactionAdded = () => {
    fetchDashboardData();
  };

  const handleTransactionDeleted = () => {
    fetchDashboardData();
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full select-none">
      {/* Header with greeting and period filter */}
      <Header
        period={period}
        setPeriod={setPeriod}
        onPeriodChange={handlePeriodChange}
      />

      {/* Row 1: Three Summary KPI Cards */}
      <div className="mb-6">
        <SummaryCards summary={summary} />
      </div>

      {/* Row 2: Expense Overview Line Chart & Add Transaction Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 min-h-[340px]">
          <ExpenseOverviewChart
            data={overviewData}
            range={overviewRange}
            setRange={setOverviewRange}
            onRangeChange={handleOverviewRangeChange}
          />
        </div>
        <div className="lg:col-span-1 min-h-[340px]">
          <AddTransactionCard
            categories={categories}
            onTransactionAdded={handleTransactionAdded}
            showToast={showToast}
          />
        </div>
      </div>

      {/* Row 3: Recent Transactions & Spending by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[300px]">
          <RecentTransactions
            transactions={recentTransactions}
            onSeeAll={() => setAllTransactionsOpen(true)}
          />
        </div>
        <div className="lg:col-span-1 min-h-[300px]">
          <CategorySpendingChart categoryData={categoryData} />
        </div>
      </div>

      {/* Modals */}
      <AllTransactionsModal
        isOpen={allTransactionsOpen}
        onClose={() => setAllTransactionsOpen(false)}
        transactions={allTransactions}
        onTransactionDeleted={handleTransactionDeleted}
        showToast={showToast}
      />

      <PlaceholderModal
        isOpen={placeholderState.isOpen}
        title={placeholderState.title}
        onClose={() => setPlaceholderState({ isOpen: false, title: '' })}
      />

      {/* Floating Toast Notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default DashboardPage;
