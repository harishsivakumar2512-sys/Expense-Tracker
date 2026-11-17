import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const defaultCategories = [
  { name: 'Food & Dining', percentage: 32, amount: 5360, color: '#FFA033' },
  { name: 'Shopping', percentage: 28, amount: 4690, color: '#3B82F6' },
  { name: 'Transport', percentage: 18, amount: 3015, color: '#22C97A' },
  { name: 'Entertainment', percentage: 12, amount: 2010, color: '#A855F7' },
  { name: 'Others', percentage: 10, amount: 1675, color: '#94A3B8' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#171830] border border-[#2b2e56] p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-white">{data.name}</span>
        </div>
        <p className="text-slate-300">
          ₹{Number(data.amount).toLocaleString('en-IN')} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CategorySpendingChart = ({ categoryData }) => {
  const categories =
    categoryData?.categories && categoryData.categories.length > 0
      ? categoryData.categories
      : defaultCategories;

  const totalSpending = categoryData?.total_spending ?? 16750;

  return (
    <div className="rounded-2xl bg-[#121325] border border-[#202240] p-5 shadow-lg flex flex-col justify-between h-full select-none">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <PieIcon className="w-5 h-5 text-indigo-400" />
        </div>
        <h2 className="text-base font-semibold text-white tracking-wide">
          Spending by Category
        </h2>
      </div>

      {/* Content: Donut Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-1 py-1">
        {/* Donut Chart with Center Text */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={categories}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={74}
                paddingAngle={4}
                stroke="#121325"
                strokeWidth={3}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || defaultCategories[index % defaultCategories.length].color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-sm font-bold text-white tracking-tight">
              ₹{Number(totalSpending).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[11px] font-medium text-slate-400">Total</span>
          </div>
        </div>

        {/* Legend List matching screenshot */}
        <div className="w-full sm:w-auto flex-1 space-y-2.5 pl-2 sm:pl-4">
          {categories.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-xs text-slate-300 hover:text-white transition"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-300">{item.name}</span>
              </div>
              <span className="font-semibold text-white ml-2">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySpendingChart;
