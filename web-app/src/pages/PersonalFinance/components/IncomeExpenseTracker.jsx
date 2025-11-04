import { useState, useEffect } from 'react';
import { incomeAPI, expenseAPI, categoryAPI, recurringTransactionAPI, monthlyBalanceAPI } from '../../../services/api';

const IncomeExpenseTracker = ({ userId = 1, initialView = 'ledger-overview', onViewChange }) => {
  const [view, setView] = useState(initialView);
  
  useEffect(() => {
    setView(initialView);
  }, [initialView]);
  
  const handleViewChange = (newView) => {
    setView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [monthlyBalance, setMonthlyBalance] = useState(null);

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [incomeForm, setIncomeForm] = useState({
    source: '',
    amount: '',
    category: '',
    incomeDate: new Date().toISOString().split('T')[0],
    description: ''
  });
  
  const [expenseForm, setExpenseForm] = useState({
    name: '',
    amount: '',
    category: '',
    expenseDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [isRecurringIncome, setIsRecurringIncome] = useState(false);
  const [isRecurringExpense, setIsRecurringExpense] = useState(false);

  const [recurringFormIncome, setRecurringFormIncome] = useState({
    frequency: 'MONTHLY',
    dayOfMonth: '1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const [recurringFormExpense, setRecurringFormExpense] = useState({
    frequency: 'MONTHLY',
    dayOfMonth: '1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const [editingRecurringId, setEditingRecurringId] = useState(null);
  const [editingRecurringForm, setEditingRecurringForm] = useState(null);

  const [newCategory, setNewCategory] = useState({ name: '', type: '' });

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    fetchMonthlyBalance();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [incomeRes, expenseRes, categoriesRes, recurringRes] = await Promise.all([
        incomeAPI.getByUserId(userId),
        expenseAPI.getByUserId(userId),
        categoryAPI.getByUserId(userId),
        recurringTransactionAPI.getByUser(userId)
      ]);

      setIncomeData(incomeRes.data || []);
      setExpenseData(expenseRes.data || []);
      setRecurringTransactions(recurringRes.data || []);
      
      const cats = categoriesRes.data || [];
      setCategories({
        income: cats.filter(c => c.type === 'INCOME'),
        expense: cats.filter(c => c.type === 'EXPENSE')
      });
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyBalance = async () => {
    try {
      const response = await monthlyBalanceAPI.getMonthlyBalance(selectedYear, selectedMonth);
      setMonthlyBalance(response.data);
    } catch (err) {
      console.error('Failed to fetch monthly balance:', err);
      setMonthlyBalance(null);
    }
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      if (isRecurringIncome) {
        await recurringTransactionAPI.create({
          userId,
          type: 'INCOME',
          name: incomeForm.source,
          amount: parseFloat(incomeForm.amount),
          category: incomeForm.category,
          frequency: recurringFormIncome.frequency,
          dayOfMonth: parseInt(recurringFormIncome.dayOfMonth),
          startDate: recurringFormIncome.startDate,
          endDate: recurringFormIncome.endDate || null,
          isActive: true,
          description: incomeForm.description
        });
      } else {
        await incomeAPI.create({
          ...incomeForm,
          userId,
          amount: parseFloat(incomeForm.amount)
        });
      }
      
      setIncomeForm({
        source: '',
        amount: '',
        category: '',
        incomeDate: new Date().toISOString().split('T')[0],
        description: ''
      });
      setIsRecurringIncome(false);
      setRecurringFormIncome({
        frequency: 'MONTHLY',
        dayOfMonth: '1',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      fetchData();
      handleViewChange('ledger-overview');
    } catch (err) {
      console.error('Failed to add income:', err);
      alert('Failed to add income');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      if (isRecurringExpense) {
        await recurringTransactionAPI.create({
          userId,
          type: 'EXPENSE',
          name: expenseForm.name,
          amount: parseFloat(expenseForm.amount),
          category: expenseForm.category,
          frequency: recurringFormExpense.frequency,
          dayOfMonth: parseInt(recurringFormExpense.dayOfMonth),
          startDate: recurringFormExpense.startDate,
          endDate: recurringFormExpense.endDate || null,
          isActive: true,
          description: expenseForm.description
        });
      } else {
        await expenseAPI.create({
          ...expenseForm,
          userId,
          amount: parseFloat(expenseForm.amount)
        });
      }
      
      setExpenseForm({
        name: '',
        amount: '',
        category: '',
        expenseDate: new Date().toISOString().split('T')[0],
        description: ''
      });
      setIsRecurringExpense(false);
      setRecurringFormExpense({
        frequency: 'MONTHLY',
        dayOfMonth: '1',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      fetchData();
      handleViewChange('ledger-overview');
    } catch (err) {
      console.error('Failed to add expense:', err);
      alert('Failed to add expense');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.type) {
      alert('Please enter category name and select type');
      return;
    }
    try {
      await categoryAPI.create({
        name: newCategory.name,
        type: newCategory.type,
        userId
      });
      setNewCategory({ name: '', type: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to add category:', err);
      alert('Failed to add category');
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await incomeAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete income:', err);
        alert('Failed to delete income');
      }
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete expense:', err);
        alert('Failed to delete expense');
      }
    }
  };

  const handleEditRecurring = (transaction) => {
    setEditingRecurringId(transaction.id);
    setEditingRecurringForm({
      type: transaction.type,
      name: transaction.name,
      amount: transaction.amount.toString(),
      category: transaction.category,
      frequency: transaction.frequency,
      dayOfMonth: transaction.dayOfMonth.toString(),
      startDate: transaction.startDate,
      endDate: transaction.endDate || '',
      isActive: transaction.isActive,
      description: transaction.description || ''
    });
  };

  const handleUpdateRecurring = async (e) => {
    e.preventDefault();
    try {
      await recurringTransactionAPI.update(editingRecurringId, {
        userId,
        type: editingRecurringForm.type,
        name: editingRecurringForm.name,
        amount: parseFloat(editingRecurringForm.amount),
        category: editingRecurringForm.category,
        frequency: editingRecurringForm.frequency,
        dayOfMonth: parseInt(editingRecurringForm.dayOfMonth),
        startDate: editingRecurringForm.startDate,
        endDate: editingRecurringForm.endDate || null,
        isActive: editingRecurringForm.isActive,
        description: editingRecurringForm.description
      });
      setEditingRecurringId(null);
      setEditingRecurringForm(null);
      fetchData();
    } catch (err) {
      console.error('Failed to update recurring transaction:', err);
      alert('Failed to update recurring transaction');
    }
  };

  const handleDeleteRecurring = async (id) => {
    if (window.confirm('Are you sure you want to delete this recurring transaction?')) {
      try {
        await recurringTransactionAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete recurring transaction:', err);
        alert('Failed to delete recurring transaction');
      }
    }
  };

  const handleToggleActive = async (transaction) => {
    try {
      await recurringTransactionAPI.update(transaction.id, {
        ...transaction,
        isActive: !transaction.isActive
      });
      fetchData();
    } catch (err) {
      console.error('Failed to toggle active status:', err);
      alert('Failed to toggle active status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading...</div>
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

  // Filter transactions by selected month and year
  const getFilteredIncomeData = () => {
    return incomeData.filter(item => {
      const date = new Date(item.incomeDate);
      return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
    });
  };

  const getFilteredExpenseData = () => {
    return expenseData.filter(item => {
      const date = new Date(item.expenseDate);
      return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
    });
  };

  const filteredIncome = getFilteredIncomeData();
  const filteredExpense = getFilteredExpenseData();

  const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = filteredExpense.reduce((sum, item) => sum + item.amount, 0);
  const finalBalance = totalIncome - totalExpense;

  const getLedgerTransactions = () => {
    const transactions = [
      ...filteredIncome.map(item => ({
        date: new Date(item.incomeDate),
        description: item.description || item.source,
        category: item.category,
        income: item.amount,
        expense: 0,
        type: 'income',
        id: item.id,
        isRecurring: item.isRecurring || false
      })),
      ...filteredExpense.map(item => ({
        date: new Date(item.expenseDate),
        description: item.description || item.name,
        category: item.category,
        income: 0,
        expense: item.amount,
        type: 'expense',
        id: item.id,
        isRecurring: item.isRecurring || false
      }))
    ];
    
    transactions.sort((a, b) => b.date - a.date);
    
    // Start running balance from opening balance if available
    let runningBalance = monthlyBalance?.openingBalance || 0;
    for (let i = transactions.length - 1; i >= 0; i--) {
      runningBalance += transactions[i].income - transactions[i].expense;
      transactions[i].balance = runningBalance;
    }
    
    return transactions;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-2xl font-bold text-gray-800">Income & Expense Tracker</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleViewChange('ledger-overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'ledger-overview'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📋 Ledger Overview
          </button>
          <button
            onClick={() => handleViewChange('summary')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'summary'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📊 Summary
          </button>
          <button
            onClick={() => handleViewChange('recurring')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'recurring'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🔄 Recurring
          </button>
          <button
            onClick={() => handleViewChange('add-income')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'add-income'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            ➕ Add Income
          </button>
          <button
            onClick={() => handleViewChange('add-expense')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'add-expense'
                ? 'bg-red-500 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            ➖ Add Expense
          </button>
        </div>
      </div>

      {view === 'ledger-overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-6 py-4">
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
            >
              ← Previous Month
            </button>
            <h4 className="text-xl font-bold text-gray-800">
              {getMonthName(selectedMonth)} {selectedYear}
            </h4>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
            >
              Next Month →
            </button>
          </div>

          {monthlyBalance && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">Opening Balance</p>
                <p className="text-2xl font-bold text-blue-700">${monthlyBalance.openingBalance?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-blue-500 mt-1">Carried from previous month</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium mb-1">Projected Closing Balance</p>
                <p className="text-2xl font-bold text-green-700">${monthlyBalance.closingBalance?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-green-500 mt-1">Will carry to next month</p>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-purple-500 text-white px-6 py-4">
              <h4 className="text-xl font-bold">Transaction Ledger</h4>
              <p className="text-sm text-purple-100 mt-1">Complete view of all income and expenses</p>
            </div>
            
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Income (Money In)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expense (Money Out)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getLedgerTransactions().length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📭</span>
                        <p className="font-medium">No transactions yet</p>
                        <p className="text-sm">Add income or expenses to see them in the ledger</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  getLedgerTransactions().map((transaction, index) => (
                    <tr key={`${transaction.type}-${transaction.id}`} className={`hover:bg-gray-50 ${transaction.isRecurring ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''}`}>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {transaction.isRecurring && <span className="text-blue-500 mr-1" title="Recurring transaction">↻</span>}
                        {transaction.date.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        {transaction.income > 0 ? (
                          <span className="text-green-600">+${transaction.income.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        {transaction.expense > 0 ? (
                          <span className="text-red-600">-${transaction.expense.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold">
                        <span className={transaction.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ${transaction.balance.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {getLedgerTransactions().length > 0 && (
                <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                  <tr className="font-bold">
                    <td colSpan="3" className="px-4 py-4 text-sm text-gray-700 uppercase tracking-wide">
                      Totals
                    </td>
                    <td className="px-4 py-4 text-sm text-right text-green-600 font-bold">
                      +${totalIncome.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right text-red-600 font-bold">
                      -${totalExpense.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">Final Balance</span>
                        <span className={`text-lg font-bold ${finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${finalBalance.toFixed(2)}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
        </div>
      )}

      {view === 'summary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Total Income</p>
              <p className="text-3xl font-bold text-green-700">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">Total Expense</p>
              <p className="text-3xl font-bold text-red-700">${totalExpense.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-green-500 text-white px-4 py-3 font-semibold">
                Income Records ({filteredIncome.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredIncome.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No income records for this month.
                        </td>
                      </tr>
                    ) : (
                      filteredIncome.map((item) => (
                        <tr key={item.id} className={`hover:bg-gray-50 ${item.isRecurring ? 'bg-blue-50' : ''}`}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.isRecurring && <span className="text-blue-500 mr-1" title="Recurring transaction">↻</span>}
                            {new Date(item.incomeDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">
                            {item.description || item.source}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                            +${item.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteIncome(item.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-red-500 text-white px-4 py-3 font-semibold">
                Expense Records ({filteredExpense.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredExpense.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No expense records for this month.
                        </td>
                      </tr>
                    ) : (
                      filteredExpense.map((item) => (
                        <tr key={item.id} className={`hover:bg-gray-50 ${item.isRecurring ? 'bg-blue-50' : ''}`}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.isRecurring && <span className="text-blue-500 mr-1" title="Recurring transaction">↻</span>}
                            {new Date(item.expenseDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">
                            {item.description || item.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">
                            -${item.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteExpense(item.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'recurring' && (
        <div className="space-y-6">
          {editingRecurringId && editingRecurringForm && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Edit Recurring Transaction</h4>
              <form onSubmit={handleUpdateRecurring} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      required
                      value={editingRecurringForm.type}
                      onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="INCOME">Income</option>
                      <option value="EXPENSE">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                    <select
                      required
                      value={editingRecurringForm.frequency}
                      onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, frequency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={editingRecurringForm.name}
                    onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingRecurringForm.amount}
                      onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      required
                      value={editingRecurringForm.category}
                      onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {(editingRecurringForm.type === 'INCOME' ? categories.income : categories.expense).map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month (1-31)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      required
                      value={editingRecurringForm.dayOfMonth}
                      onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, dayOfMonth: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      required
                      value={editingRecurringForm.startDate}
                      onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                    <input
                      type="date"
                      value={editingRecurringForm.endDate}
                      onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={editingRecurringForm.description}
                    onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, description: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingRecurringForm.isActive}
                    onChange={(e) => setEditingRecurringForm({ ...editingRecurringForm, isActive: e.target.checked })}
                    className="mr-2 w-4 h-4"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Update Recurring Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRecurringId(null);
                      setEditingRecurringForm(null);
                    }}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-indigo-500 text-white px-6 py-4">
              <h4 className="text-xl font-bold">Recurring Transactions</h4>
              <p className="text-sm text-indigo-100 mt-1">Manage your recurring income and expenses</p>
            </div>

            {recurringTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">🔄</span>
                  <p className="font-medium">No recurring transactions yet</p>
                  <p className="text-sm">Add income or expenses with the &quot;Make this recurring&quot; option</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recurringTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${!transaction.isActive ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              transaction.type === 'INCOME'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.type}
                          </span>
                          <h5 className="font-bold text-gray-800">{transaction.name}</h5>
                          {!transaction.isActive && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                              Inactive
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Amount:</span> ${transaction.amount.toFixed(2)}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span> {transaction.category}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span> {transaction.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Day:</span> {transaction.dayOfMonth} of month
                          </div>
                        </div>

                        {transaction.description && (
                          <p className="mt-2 text-sm text-gray-600 italic">{transaction.description}</p>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleToggleActive(transaction)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            transaction.isActive
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {transaction.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEditRecurring(transaction)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecurring(transaction.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'add-income' && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-6">Add New Income</h4>
          
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Create Custom Category</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.type === 'INCOME' ? newCategory.name : ''}
                onChange={(e) => setNewCategory({ name: e.target.value, type: 'INCOME' })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>

          <form onSubmit={handleAddIncome} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <input
                type="text"
                required
                value={incomeForm.source}
                onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Salary, Freelance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                required
                value={incomeForm.category}
                onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.income.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {!isRecurringIncome && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={incomeForm.incomeDate}
                  onChange={(e) => setIncomeForm({ ...incomeForm, incomeDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={incomeForm.description}
                onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
                placeholder="Additional notes..."
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isRecurringIncome"
                  checked={isRecurringIncome}
                  onChange={(e) => setIsRecurringIncome(e.target.checked)}
                  className="mr-2 w-4 h-4"
                />
                <label htmlFor="isRecurringIncome" className="text-sm font-medium text-gray-700">
                  Make this recurring
                </label>
              </div>

              {isRecurringIncome && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-4">
                  <h5 className="font-semibold text-indigo-800">Recurring Settings</h5>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                    <select
                      required
                      value={recurringFormIncome.frequency}
                      onChange={(e) => setRecurringFormIncome({ ...recurringFormIncome, frequency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month (1-31)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      required
                      value={recurringFormIncome.dayOfMonth}
                      onChange={(e) => setRecurringFormIncome({ ...recurringFormIncome, dayOfMonth: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      required
                      value={recurringFormIncome.startDate}
                      onChange={(e) => setRecurringFormIncome({ ...recurringFormIncome, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                    <input
                      type="date"
                      value={recurringFormIncome.endDate}
                      onChange={(e) => setRecurringFormIncome({ ...recurringFormIncome, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                {isRecurringIncome ? 'Add Recurring Income' : 'Add Income'}
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('ledger-overview')}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {view === 'add-expense' && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-6">Add New Expense</h4>
          
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Create Custom Category</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.type === 'EXPENSE' ? newCategory.name : ''}
                onChange={(e) => setNewCategory({ name: e.target.value, type: 'EXPENSE' })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={expenseForm.name}
                onChange={(e) => setExpenseForm({ ...expenseForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Groceries, Rent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                required
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.expense.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {!isRecurringExpense && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={expenseForm.expenseDate}
                  onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Additional notes..."
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isRecurringExpense"
                  checked={isRecurringExpense}
                  onChange={(e) => setIsRecurringExpense(e.target.checked)}
                  className="mr-2 w-4 h-4"
                />
                <label htmlFor="isRecurringExpense" className="text-sm font-medium text-gray-700">
                  Make this recurring
                </label>
              </div>

              {isRecurringExpense && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-4">
                  <h5 className="font-semibold text-indigo-800">Recurring Settings</h5>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                    <select
                      required
                      value={recurringFormExpense.frequency}
                      onChange={(e) => setRecurringFormExpense({ ...recurringFormExpense, frequency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month (1-31)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      required
                      value={recurringFormExpense.dayOfMonth}
                      onChange={(e) => setRecurringFormExpense({ ...recurringFormExpense, dayOfMonth: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      required
                      value={recurringFormExpense.startDate}
                      onChange={(e) => setRecurringFormExpense({ ...recurringFormExpense, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                    <input
                      type="date"
                      value={recurringFormExpense.endDate}
                      onChange={(e) => setRecurringFormExpense({ ...recurringFormExpense, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                {isRecurringExpense ? 'Add Recurring Expense' : 'Add Expense'}
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('ledger-overview')}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default IncomeExpenseTracker;
