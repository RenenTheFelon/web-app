import { useState, useEffect } from 'react';
import { expenseAPI } from '../../../services/api';

const SpendingAnalytics = ({ userId = 1 }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchExpenses();
  }, [userId, timeRange]);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      let startDate;

      switch (timeRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const start = startDate.toISOString().split('T')[0];
      const end = now.toISOString().split('T')[0];

      const response = await expenseAPI.getByDateRange(userId, start, end);
      setExpenses(response.data || []);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryData = () => {
    const categoryTotals = {};
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });
    return categoryTotals;
  };

  const getMonthlyTrend = () => {
    const monthlyData = {};
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });
    return Object.entries(monthlyData).sort(([a], [b]) => a.localeCompare(b));
  };

  const categoryData = getCategoryData();
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averagePerCategory = Object.keys(categoryData).length > 0 
    ? totalSpent / Object.keys(categoryData).length 
    : 0;

  const categoryColors = {
    Food: 'bg-orange-500',
    Transportation: 'bg-blue-500',
    Housing: 'bg-purple-500',
    Utilities: 'bg-yellow-500',
    Healthcare: 'bg-red-500',
    Entertainment: 'bg-pink-500',
    Shopping: 'bg-green-500',
    Education: 'bg-indigo-500',
    Other: 'bg-gray-500'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-300">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Spending Analytics</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-6 border border-blue-800">
          <p className="text-sm opacity-90 mb-1">Total Spent</p>
          <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg p-6 border border-purple-800">
          <p className="text-sm opacity-90 mb-1">Total Transactions</p>
          <p className="text-3xl font-bold">{expenses.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg p-6 border border-green-800">
          <p className="text-sm opacity-90 mb-1">Avg per Category</p>
          <p className="text-3xl font-bold">${averagePerCategory.toFixed(2)}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400">No expenses recorded for this period</p>
        </div>
      ) : (
        <>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Spending by Category</h4>
            <div className="space-y-3">
              {Object.entries(categoryData)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = (amount / totalSpent) * 100;
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-300">{category}</span>
                        <span className="text-sm text-gray-400">
                          ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${categoryColors[category] || 'bg-gray-500'} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Category Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(categoryData)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="text-center p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className={`w-16 h-16 ${categoryColors[category] || 'bg-gray-500'} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl`}>
                      {((amount / totalSpent) * 100).toFixed(0)}%
                    </div>
                    <div className="font-medium text-gray-200">{category}</div>
                    <div className="text-sm text-gray-400">${amount.toFixed(2)}</div>
                  </div>
                ))}
            </div>
          </div>

          {getMonthlyTrend().length > 1 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Monthly Trend</h4>
              <div className="space-y-2">
                {getMonthlyTrend().map(([month, amount]) => (
                  <div key={month} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-400 font-medium">{month}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-8 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${(amount / Math.max(...getMonthlyTrend().map(([, a]) => a))) * 100}%` }}
                      >
                        <span className="text-white text-sm font-medium">${amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Top Expenses</h4>
            <div className="space-y-2">
              {expenses
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5)
                .map((expense, index) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">{expense.category}</div>
                        <div className="text-sm text-gray-400">{expense.date}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-red-400">${expense.amount.toFixed(2)}</div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpendingAnalytics;
