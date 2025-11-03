import { useState, useEffect } from 'react';
import { recurringTransactionAPI, categoryAPI } from '../../../services/api';

const RecurringTransactionManager = ({ userId = 1 }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    type: 'INCOME',
    name: '',
    amount: '',
    category: '',
    frequency: 'MONTHLY',
    dayOfMonth: '1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [transRes, incCatRes, expCatRes] = await Promise.all([
        recurringTransactionAPI.getByUser(userId),
        categoryAPI.getByUserIdAndType(userId, 'INCOME'),
        categoryAPI.getByUserIdAndType(userId, 'EXPENSE')
      ]);

      setTransactions(transRes.data || []);
      setCategories({
        income: incCatRes.data || [],
        expense: expCatRes.data || []
      });
    } catch (err) {
      setError('Failed to fetch recurring transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'INCOME',
      name: '',
      amount: '',
      category: '',
      frequency: 'MONTHLY',
      dayOfMonth: '1',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true,
      description: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.amount || !formData.category || !formData.dayOfMonth || !formData.startDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    const dayNum = parseInt(formData.dayOfMonth);
    if (dayNum < 1 || dayNum > 31) {
      setError('Day of month must be between 1 and 31');
      return;
    }

    try {
      const payload = {
        userId,
        type: formData.type,
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        frequency: formData.frequency,
        dayOfMonth: dayNum,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        isActive: formData.isActive,
        description: formData.description || ''
      };

      if (editingId) {
        await recurringTransactionAPI.update(editingId, payload);
      } else {
        await recurringTransactionAPI.create(payload);
      }

      resetForm();
      fetchData();
    } catch (err) {
      setError(`Failed to ${editingId ? 'update' : 'create'} recurring transaction`);
      console.error(err);
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
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
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recurring transaction?')) {
      return;
    }

    try {
      await recurringTransactionAPI.delete(id);
      fetchData();
    } catch (err) {
      setError('Failed to delete recurring transaction');
      console.error(err);
    }
  };

  const toggleActive = async (transaction) => {
    try {
      await recurringTransactionAPI.update(transaction.id, {
        ...transaction,
        isActive: !transaction.isActive
      });
      fetchData();
    } catch (err) {
      setError('Failed to update transaction status');
      console.error(err);
    }
  };

  const getCurrentCategories = () => {
    return formData.type === 'INCOME' ? categories.income : categories.expense;
  };

  if (loading) {
    return <div className="text-center py-8">Loading recurring transactions...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Recurring Transactions</h3>
          <p className="text-gray-600 mt-1">Set up automatic income and expenses that repeat monthly</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Recurring Transaction'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit' : 'Add'} Recurring Transaction
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  name="frequency"
                  required
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name / Description *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Salary, Rent, Netflix subscription"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {getCurrentCategories().map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Month * (1-31)
                </label>
                <input
                  type="number"
                  name="dayOfMonth"
                  required
                  min="1"
                  max="31"
                  value={formData.dayOfMonth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
                placeholder="Any additional details..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-700">
                Active (will appear on calendar)
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                {editingId ? 'Update' : 'Create'} Recurring Transaction
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800">Your Recurring Transactions</h4>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No recurring transactions yet</p>
            <p className="text-sm mt-2">Click the button above to create your first recurring transaction</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transactions.map(transaction => (
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
                      <div>
                        <span className="font-medium">Start:</span> {transaction.startDate}
                      </div>
                      <div>
                        <span className="font-medium">End:</span> {transaction.endDate || 'Ongoing'}
                      </div>
                    </div>

                    {transaction.description && (
                      <p className="mt-2 text-sm text-gray-600 italic">{transaction.description}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => toggleActive(transaction)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        transaction.isActive
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {transaction.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
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
  );
};

export default RecurringTransactionManager;
