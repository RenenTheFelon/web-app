import { useState, useEffect } from 'react';
import { incomeAPI, expenseAPI } from '../../../services/api';

const IncomeExpenseTracker = ({ userId = 1 }) => {
  const [activeTab, setActiveTab] = useState('income');
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    source: ''
  });

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];
  const expenseCategories = ['Food', 'Transportation', 'Housing', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Other'];

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        incomeAPI.getByUser(userId),
        expenseAPI.getByUser(userId)
      ]);
      setIncomes(incomeRes.data || []);
      setExpenses(expenseRes.data || []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      source: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.category || !formData.amount || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    try {
      const data = {
        userId,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description
      };

      if (activeTab === 'income') {
        data.source = formData.source || formData.category;
        if (editingId) {
          await incomeAPI.update(editingId, data);
        } else {
          await incomeAPI.create(data);
        }
      } else {
        if (editingId) {
          await expenseAPI.update(editingId, data);
        } else {
          await expenseAPI.create(data);
        }
      }

      resetForm();
      fetchData();
    } catch (err) {
      setError(`Failed to ${editingId ? 'update' : 'create'} ${activeTab}`);
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      category: item.category,
      amount: item.amount.toString(),
      date: item.date,
      description: item.description || '',
      source: item.source || ''
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab}?`)) return;

    try {
      if (activeTab === 'income') {
        await incomeAPI.delete(id);
      } else {
        await expenseAPI.delete(id);
      }
      fetchData();
    } catch (err) {
      setError(`Failed to delete ${activeTab}`);
      console.error(err);
    }
  };

  const currentItems = activeTab === 'income' ? incomes : expenses;
  const currentCategories = activeTab === 'income' ? incomeCategories : expenseCategories;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => { setActiveTab('income'); resetForm(); }}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'income'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => { setActiveTab('expenses'); resetForm(); }}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'expenses'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Expenses
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit' : 'Add'} {activeTab === 'income' ? 'Income' : 'Expense'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {currentCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {activeTab === 'income' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="e.g., Company name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add notes..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {editingId ? 'Update' : 'Add'} {activeTab === 'income' ? 'Income' : 'Expense'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {activeTab === 'income' ? 'Income' : 'Expense'} History
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {currentItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No {activeTab} entries yet. Add your first entry!
              </p>
            ) : (
              currentItems.map(item => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{item.category}</div>
                      <div className="text-sm text-gray-600">{item.date}</div>
                    </div>
                    <div className={`text-lg font-bold ${activeTab === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {activeTab === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  
                  {activeTab === 'income' && item.source && (
                    <p className="text-xs text-gray-500 mb-2">Source: {item.source}</p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseTracker;
