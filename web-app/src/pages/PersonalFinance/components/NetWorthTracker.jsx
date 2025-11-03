import { useState, useEffect } from 'react';
import { assetAPI, recurringTransactionAPI, incomeAPI, expenseAPI } from '../../../services/api';

const NetWorthTracker = ({ userId = 1 }) => {
  const [assets, setAssets] = useState([]);
  const [summary, setSummary] = useState({ totalAssets: 0, totalLiabilities: 0, netWorth: 0 });
  const [projectionData, setProjectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'CAR',
    value: '',
    isAsset: true,
    description: ''
  });

  const assetTypes = ['CAR', 'PROPERTY', 'SAVINGS', 'INVESTMENT', 'OTHER'];

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assetsRes, summaryRes] = await Promise.all([
        assetAPI.getByUser(userId),
        assetAPI.getSummary(userId)
      ]);

      setAssets(assetsRes.data || []);
      setSummary(summaryRes.data || { totalAssets: 0, totalLiabilities: 0, netWorth: 0 });
      
      await calculateProjection();
    } catch (err) {
      setError('Failed to fetch asset data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProjection = async () => {
    try {
      const currentDate = new Date();
      const projections = [];
      
      const summaryRes = await assetAPI.getSummary(userId);
      const currentNetWorth = summaryRes.data?.netWorth || 0;
      
      const recurringRes = await recurringTransactionAPI.getActiveByUser(userId);
      const recurringData = recurringRes.data || [];
      
      const monthlyIncome = recurringData
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthlyExpenses = recurringData
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthlySavings = monthlyIncome - monthlyExpenses;
      
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const projectedNetWorth = currentNetWorth + (monthlySavings * i);
        
        projections.push({
          month: monthName,
          netWorth: projectedNetWorth,
          monthIndex: i
        });
      }
      
      setProjectionData(projections);
    } catch (err) {
      console.error('Failed to calculate projection:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'CAR',
      value: '',
      isAsset: true,
      description: ''
    });
    setShowForm(false);
    setEditingAsset(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.value) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.value) <= 0) {
      setError('Value must be greater than 0');
      return;
    }

    try {
      const assetData = {
        userId,
        name: formData.name,
        type: formData.type,
        value: parseFloat(formData.value),
        isAsset: formData.isAsset,
        description: formData.description || ''
      };

      if (editingAsset) {
        await assetAPI.update(editingAsset.id, assetData);
      } else {
        await assetAPI.create(assetData);
      }

      resetForm();
      fetchData();
    } catch (err) {
      setError(`Failed to ${editingAsset ? 'update' : 'create'} asset`);
      console.error(err);
    }
  };

  const handleEdit = (asset) => {
    setFormData({
      name: asset.name,
      type: asset.type,
      value: asset.value.toString(),
      isAsset: asset.isAsset,
      description: asset.description || ''
    });
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await assetAPI.delete(id);
      fetchData();
    } catch (err) {
      setError('Failed to delete asset');
      console.error(err);
    }
  };

  const maxProjectedValue = Math.max(...projectionData.map(p => p.netWorth), 0);
  const minProjectedValue = Math.min(...projectionData.map(p => p.netWorth), 0);
  const chartHeight = 200;

  const getYPosition = (value) => {
    if (maxProjectedValue === minProjectedValue) return chartHeight / 2;
    const range = maxProjectedValue - minProjectedValue;
    return chartHeight - ((value - minProjectedValue) / range) * chartHeight;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading net worth data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Net Worth Tracker</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          {showForm ? 'Cancel' : editingAsset ? 'Edit Asset' : '+ Add Asset/Liability'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <p className="text-sm opacity-90 mb-1">Current Net Worth</p>
          <p className="text-3xl font-bold">${summary.netWorth?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <p className="text-sm opacity-90 mb-1">Total Assets</p>
          <p className="text-3xl font-bold">${summary.totalAssets?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6">
          <p className="text-sm opacity-90 mb-1">Total Liabilities</p>
          <p className="text-3xl font-bold">${summary.totalLiabilities?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {projectionData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">12-Month Net Worth Projection</h4>
          <p className="text-sm text-gray-600 mb-4">
            Based on your recurring income and expenses
          </p>
          
          <div className="relative" style={{ height: `${chartHeight + 60}px` }}>
            <svg width="100%" height={chartHeight + 40} className="overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {projectionData.length > 1 && (
                <>
                  <path
                    d={`
                      M ${projectionData.map((p, i) => {
                        const x = (i / (projectionData.length - 1)) * 100;
                        const y = getYPosition(p.netWorth);
                        return `${x}%,${y}`;
                      }).join(' L ')}
                      L 100%,${chartHeight}
                      L 0%,${chartHeight}
                      Z
                    `}
                    fill="url(#areaGradient)"
                  />
                  
                  <path
                    d={`M ${projectionData.map((p, i) => {
                      const x = (i / (projectionData.length - 1)) * 100;
                      const y = getYPosition(p.netWorth);
                      return `${x}%,${y}`;
                    }).join(' L ')}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  
                  {projectionData.map((p, i) => {
                    const x = (i / (projectionData.length - 1)) * 100;
                    const y = getYPosition(p.netWorth);
                    return (
                      <g key={i}>
                        <circle
                          cx={`${x}%`}
                          cy={y}
                          r="4"
                          fill="#3b82f6"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={`${x}%`}
                          y={chartHeight + 20}
                          textAnchor="middle"
                          className="text-xs fill-gray-600"
                        >
                          {p.month.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}
            </svg>
            
            <div className="absolute top-2 right-2 text-xs text-gray-600">
              Peak: ${Math.max(...projectionData.map(p => p.netWorth)).toFixed(0)}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            {editingAsset ? 'Edit Asset/Liability' : 'Add Asset/Liability'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  name="isAsset"
                  checked={formData.isAsset}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  This is an Asset (uncheck for Liability)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Tesla Model 3, House, Car Loan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {assetTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value ($) *
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
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
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional notes about this asset/liability"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {editingAsset ? 'Update' : 'Add'} {formData.isAsset ? 'Asset' : 'Liability'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Assets
          </h4>
          {assets.filter(a => a.isAsset).length === 0 ? (
            <p className="text-gray-500 text-sm">No assets added yet</p>
          ) : (
            <div className="space-y-3">
              {assets.filter(a => a.isAsset).map(asset => (
                <div key={asset.id} className="flex justify-between items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{asset.name}</p>
                    <p className="text-xs text-gray-600">{asset.type}</p>
                    {asset.description && (
                      <p className="text-xs text-gray-500 mt-1">{asset.description}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-green-600">${asset.value.toFixed(2)}</p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="text-xs text-red-600 hover:text-red-800"
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

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Liabilities
          </h4>
          {assets.filter(a => !a.isAsset).length === 0 ? (
            <p className="text-gray-500 text-sm">No liabilities added yet</p>
          ) : (
            <div className="space-y-3">
              {assets.filter(a => !a.isAsset).map(asset => (
                <div key={asset.id} className="flex justify-between items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{asset.name}</p>
                    <p className="text-xs text-gray-600">{asset.type}</p>
                    {asset.description && (
                      <p className="text-xs text-gray-500 mt-1">{asset.description}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-red-600">${asset.value.toFixed(2)}</p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="text-xs text-red-600 hover:text-red-800"
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
    </div>
  );
};

export default NetWorthTracker;
