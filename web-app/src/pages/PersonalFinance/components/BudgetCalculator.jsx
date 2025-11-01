import { useState } from 'react';
import { budgetAPI } from '../../../services/api';

const BudgetCalculator = ({ userId = 1 }) => {
  const [formData, setFormData] = useState({
    month: new Date().toISOString().slice(0, 7),
    income: '',
    expenses: '',
    description: ''
  });
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'income' || name === 'expenses') {
      const income = name === 'income' ? parseFloat(value) || 0 : parseFloat(formData.income) || 0;
      const expenses = name === 'expenses' ? parseFloat(value) || 0 : parseFloat(formData.expenses) || 0;
      setBalance(income - expenses);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.income || !formData.expenses) {
      setError('Please enter both income and expenses');
      return;
    }

    if (parseFloat(formData.income) < 0 || parseFloat(formData.expenses) < 0) {
      setError('Income and expenses must be positive numbers');
      return;
    }

    setLoading(true);

    try {
      const budgetData = {
        userId,
        month: formData.month,
        plannedIncome: parseFloat(formData.income),
        plannedExpenses: parseFloat(formData.expenses),
        actualIncome: 0,
        actualExpenses: 0,
        description: formData.description || `Budget for ${formData.month}`
      };

      await budgetAPI.create(budgetData);
      setSuccess(true);
      
      setFormData({
        month: new Date().toISOString().slice(0, 7),
        income: '',
        expenses: '',
        description: ''
      });
      setBalance(0);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save budget. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      month: new Date().toISOString().slice(0, 7),
      income: '',
      expenses: '',
      description: ''
    });
    setBalance(0);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Budget Calculator</h3>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">Budget saved successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <input
              type="month"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planned Income ($)
            </label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleInputChange}
              placeholder="Enter your planned income"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planned Expenses ($)
            </label>
            <input
              type="number"
              name="expenses"
              value={formData.expenses}
              onChange={handleInputChange}
              placeholder="Enter your planned expenses"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add notes about this budget"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className={`p-6 rounded-lg border-2 ${balance >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            <div className="text-sm font-medium text-gray-600 mb-2">Calculated Balance</div>
            <div className={`text-4xl font-bold ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              ${balance.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {balance >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Saving...' : 'Save Budget'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Budget Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Aim to save at least 20% of your income</li>
          <li>• Track your actual spending against your planned budget</li>
          <li>• Review and adjust your budget monthly</li>
          <li>• Build an emergency fund for unexpected expenses</li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetCalculator;
