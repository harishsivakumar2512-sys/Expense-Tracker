import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#171830] border border-[#2b2e56] p-3 rounded-xl shadow-2xl text-xs space-y-1">
        <p className="font-semibold text-slate-200 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400 capitalize">{entry.name}:</span>
            <span className="font-semibold text-white">
              ₹{Number(entry.value).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ExpenseOverviewChart = ({ data, range, setRange, onRangeChange }) => {
  const chartData = data && data.length > 0 ? data : [
    { day: 'Mon', income: 13500, expenses: 7000 },
    { day: 'Tue', income: 17000, expenses: 11000 },
    { day: 'Wed', income: 14500, expenses: 9500 },
    { day: 'Thu', income: 21000, expenses: 14500 },
    { day: 'Fri', income: 19000, expenses: 13000 },
    { day: 'Sat', income: 24000, expenses: 16500 },
    { day: 'Sun', income: 22500, expenses: 15200 },
  ];

  const handleRangeClick = (r) => {
    setRange(r);
    if (onRangeChange) onRangeChange(r);
  };

  const ranges = [
    { id: 'this_month', label: 'This Month' },
    { id: 'last_month', label: 'Last Month' },
    { id: '6_months', label: '6 Months' },
  ];

  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return '0';
    return `${tickItem / 1000}k`;
  };

  return (
    <div className="rounded-2xl bg-[#121325] border border-[#202240] p-5 shadow-lg flex flex-col justify-between h-full select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold text-white tracking-wide">
            Expense Overview
          </h2>
        </div>

        {/* Range Selector Pills */}
        <div className="inline-flex bg-[#0b0c17] p-1 rounded-xl border border-[#1d1f3b] self-start sm:self-auto">
          {ranges.map((r) => {
            const isActive = range === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRangeClick(r.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#7c5cfa] text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-5 text-xs text-slate-300 font-medium mb-3 pr-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c97a]" />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7c5cfa]" />
          <span>Expenses</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-56 sm:h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1b1c33" />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              tickLine={false}
              axisLine={{ stroke: '#1b1c33' }}
              tick={{ fill: '#80899f', fontSize: 12 }}
              dy={8}
            />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              tick={{ fill: '#80899f', fontSize: 11 }}
              domain={[0, 25000]}
              ticks={[0, 5000, 10000, 15000, 20000, 25000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="income"
              name="income"
              stroke="#22c97a"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#22c97a', stroke: '#121325', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#22c97a', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="expenses"
              stroke="#7c5cfa"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#7c5cfa', stroke: '#121325', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#7c5cfa', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseOverviewChart;
