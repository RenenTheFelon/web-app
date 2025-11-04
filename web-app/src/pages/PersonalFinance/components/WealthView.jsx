import { useState, useEffect } from 'react';
import { incomeAPI, expenseAPI, recurringTransactionAPI, monthlyBalanceAPI } from '../../../services/api';

const WealthView = ({ userId = 1, onAddIncome, onAddExpense }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyTotals, setMonthlyTotals] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
    recurringIncome: 0,
    recurringExpenses: 0
  });
  const [monthlyBalance, setMonthlyBalance] = useState({
    openingBalance: 0,
    closingBalance: 0,
    totalIncome: 0,
    totalExpense: 0
  });

  useEffect(() => {
    fetchMonthlyData();
  }, [currentDate, userId]);

  const fetchMonthlyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const [incomeRes, expenseRes, recurringRes, balanceRes] = await Promise.all([
        incomeAPI.getByDateRange(userId, startDate, endDate),
        expenseAPI.getByDateRange(userId, startDate, endDate),
        recurringTransactionAPI.generateInstances(userId, year, month),
        monthlyBalanceAPI.getMonthlyBalance(year, month)
      ]);

      const incomeData = incomeRes.data || [];
      const expenseData = expenseRes.data || [];
      const recurringData = recurringRes.data || [];
      const balanceData = balanceRes.data || {};

      setMonthlyBalance({
        openingBalance: balanceData.openingBalance || 0,
        closingBalance: balanceData.closingBalance || 0,
        totalIncome: balanceData.totalIncome || 0,
        totalExpense: balanceData.totalExpense || 0
      });

      const allTransactions = [
        ...incomeData.map(item => ({ 
          ...item, 
          type: 'income',
          date: item.incomeDate || item.date,
          isRecurring: false
        })),
        ...expenseData.map(item => ({ 
          ...item, 
          type: 'expense',
          date: item.expenseDate || item.date,
          name: item.name,
          category: item.category,
          isRecurring: false
        })),
        ...recurringData.map(item => ({
          ...item,
          type: item.type.toLowerCase(),
          isRecurring: true,
          source: item.name,
          name: item.name
        }))
      ].sort((a, b) => new Date(a.date) - new Date(b.date));

      setTransactions(allTransactions);

      const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
      const recurringIncome = recurringData
        .filter(item => item.type === 'INCOME')
        .reduce((sum, item) => sum + item.amount, 0);
      const recurringExpenses = recurringData
        .filter(item => item.type === 'EXPENSE')
        .reduce((sum, item) => sum + item.amount, 0);

      setMonthlyTotals({
        income: totalIncome,
        expenses: totalExpenses,
        savings: totalIncome - totalExpenses,
        recurringIncome,
        recurringExpenses
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
        <h3 className="text-2xl font-bold text-gray-800">WealthView - {monthName}</h3>
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Opening Balance</p>
          <p className="text-2xl font-bold text-purple-700">${monthlyBalance.openingBalance.toFixed(2)}</p>
          <p className="text-xs text-purple-500 mt-1">Carried from previous month</p>
        </div>
        
        <div className={`${monthlyBalance.closingBalance >= 0 ? 'bg-teal-50 border-teal-200' : 'bg-orange-50 border-orange-200'} border-2 rounded-lg p-4`}>
          <p className={`text-sm font-medium ${monthlyBalance.closingBalance >= 0 ? 'text-teal-600' : 'text-orange-600'}`}>
            Closing Balance
          </p>
          <p className={`text-2xl font-bold ${monthlyBalance.closingBalance >= 0 ? 'text-teal-700' : 'text-orange-700'}`}>
            ${monthlyBalance.closingBalance.toFixed(2)}
          </p>
          <p className={`text-xs mt-1 ${monthlyBalance.closingBalance >= 0 ? 'text-teal-500' : 'text-orange-500'}`}>
            Will carry to next month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={onAddIncome}
          className="bg-green-50 border-2 border-green-200 rounded-lg p-4 hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer text-left"
        >
          <p className="text-sm text-green-600 font-medium flex items-center gap-2">
            <span className="text-xl">➕</span> Total Income (Click to Add)
          </p>
          <p className="text-2xl font-bold text-green-700">${monthlyTotals.income.toFixed(2)}</p>
        </button>
        
        <button
          onClick={onAddExpense}
          className="bg-red-50 border-2 border-red-200 rounded-lg p-4 hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer text-left"
        >
          <p className="text-sm text-red-600 font-medium flex items-center gap-2">
            <span className="text-xl">➖</span> Total Expense (Click to Add)
          </p>
          <p className="text-2xl font-bold text-red-700">${monthlyTotals.expenses.toFixed(2)}</p>
        </button>
        
        <div className={`${monthlyTotals.savings >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border-2 rounded-lg p-4`}>
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
            <div key={`empty-${i}`} className="border-r border-b border-gray-200 p-2 bg-gray-50 min-h-[140px]"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayTransactions = getTransactionsForDay(day);

            return (
              <div
                key={day}
                className="border-r border-b border-gray-200 p-2 min-h-[140px] hover:bg-gray-50 transition-colors"
              >
                <div className="font-semibold text-gray-700 mb-2">{day}</div>
                <div className="space-y-1 max-h-[100px] overflow-y-auto">
                  {dayTransactions.map((transaction, idx) => {
                    const isIncome = transaction.type === 'income';
                    const isRecurring = transaction.isRecurring;
                    return (
                      <div
                        key={idx}
                        className={`text-xs px-2 py-1 rounded ${
                          isIncome 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        } ${isRecurring ? 'border-dashed border-2' : ''}`}
                      >
                        <div className="font-semibold truncate flex items-center gap-1">
                          {isRecurring && <span title="Recurring transaction">↻</span>}
                          {transaction.category || (isIncome ? transaction.source : transaction.name)}
                        </div>
                        <div className="font-bold">
                          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WealthView;
