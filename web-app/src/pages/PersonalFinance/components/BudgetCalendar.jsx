import { useState, useEffect } from 'react';
import { incomeAPI, expenseAPI } from '../../../services/api';

const BudgetCalendar = ({ userId = 1 }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyTotals, setMonthlyTotals] = useState({
    income: 0,
    expenses: 0,
    savings: 0
  });

  useEffect(() => {
    fetchMonthlyData();
  }, [currentDate, userId]);

  const fetchMonthlyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const [incomeRes, expenseRes] = await Promise.all([
        incomeAPI.getByDateRange(userId, startDate, endDate),
        expenseAPI.getByDateRange(userId, startDate, endDate)
      ]);

      const incomeData = incomeRes.data || [];
      const expenseData = expenseRes.data || [];

      const allTransactions = [
        ...incomeData.map(item => ({ ...item, type: 'income' })),
        ...expenseData.map(item => ({ ...item, type: 'expense' }))
      ].sort((a, b) => new Date(a.date) - new Date(b.date));

      setTransactions(allTransactions);

      const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);

      setMonthlyTotals({
        income: totalIncome,
        expenses: totalExpenses,
        savings: totalIncome - totalExpenses
      });
    } catch (err) {
      setError('Failed to fetch monthly data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getTransactionsForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    
    return transactions.filter(t => t.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">{monthName}</h3>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Total Income</p>
          <p className="text-2xl font-bold text-green-700">${monthlyTotals.income.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 font-medium">Total Expenses</p>
          <p className="text-2xl font-bold text-red-700">${monthlyTotals.expenses.toFixed(2)}</p>
        </div>
        <div className={`${monthlyTotals.savings >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border rounded-lg p-4`}>
          <p className={`text-sm font-medium ${monthlyTotals.savings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            Net Savings
          </p>
          <p className={`text-2xl font-bold ${monthlyTotals.savings >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            ${monthlyTotals.savings.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b border-gray-200 p-2 bg-gray-50 min-h-[120px]"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayTransactions = getTransactionsForDay(day);
            const dayIncome = dayTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0);
            const dayExpenses = dayTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);

            return (
              <div
                key={day}
                className="border-r border-b border-gray-200 p-2 min-h-[120px] hover:bg-gray-50 transition-colors"
              >
                <div className="font-semibold text-gray-700 mb-2">{day}</div>
                {dayTransactions.length > 0 && (
                  <div className="space-y-1">
                    {dayIncome > 0 && (
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        +${dayIncome.toFixed(2)}
                      </div>
                    )}
                    {dayExpenses > 0 && (
                      <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        -${dayExpenses.toFixed(2)}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      {dayTransactions.length} transaction{dayTransactions.length > 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetCalendar;
