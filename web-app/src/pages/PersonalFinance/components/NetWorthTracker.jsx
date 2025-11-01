import { useState, useEffect } from 'react';
import { netWorthAPI } from '../../../services/api';

const NetWorthTracker = ({ userId = 1 }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    assets: '',
    liabilities: '',
    assetsBreakdown: '',
    liabilitiesBreakdown: ''
  });

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await netWorthAPI.getByUser(userId);
      const data = response.data || [];
      setRecords(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError('Failed to fetch net worth records');
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
      date: new Date().toISOString().split('T')[0],
      assets: '',
      liabilities: '',
      assetsBreakdown: '',
      liabilitiesBreakdown: ''
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.assets || !formData.liabilities || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.assets) < 0 || parseFloat(formData.liabilities) < 0) {
      setError('Assets and liabilities must be non-negative');
      return;
    }

    try {
      const netWorthData = {
        userId,
        date: formData.date,
        assets: parseFloat(formData.assets),
        liabilities: parseFloat(formData.liabilities),
        netWorth: parseFloat(formData.assets) - parseFloat(formData.liabilities),
        assetsBreakdown: formData.assetsBreakdown || '',
        liabilitiesBreakdown: formData.liabilitiesBreakdown || ''
      };

      await netWorthAPI.create(netWorthData);
      resetForm();
      fetchRecords();
    } catch (err) {
      setError('Failed to create net worth record');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      await netWorthAPI.delete(id);
      fetchRecords();
    } catch (err) {
      setError('Failed to delete record');
      console.error(err);
    }
  };

  const calculateNetWorth = () => {
    const assets = parseFloat(formData.assets) || 0;
    const liabilities = parseFloat(formData.liabilities) || 0;
    return assets - liabilities;
  };

  const getTrend = () => {
    if (records.length < 2) return null;
    const latest = records[0].netWorth;
    const previous = records[1].netWorth;
    const change = latest - previous;
    const percentChange = previous !== 0 ? (change / Math.abs(previous)) * 100 : 0;
    return { change, percentChange, isPositive: change >= 0 };
  };

  const trend = getTrend();
  const currentNetWorth = calculateNetWorth();

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
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <p className="text-sm opacity-90 mb-1">Current Net Worth</p>
            <p className="text-3xl font-bold">${records[0].netWorth.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <p className="text-sm opacity-90 mb-1">Total Assets</p>
            <p className="text-3xl font-bold">${records[0].assets.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6">
            <p className="text-sm opacity-90 mb-1">Total Liabilities</p>
            <p className="text-3xl font-bold">${records[0].liabilities.toFixed(2)}</p>
          </div>
          {trend && (
            <div className={`bg-gradient-to-br ${trend.isPositive ? 'from-emerald-500 to-emerald-600' : 'from-orange-500 to-orange-600'} text-white rounded-lg p-6`}>
              <p className="text-sm opacity-90 mb-1">Trend</p>
              <p className="text-3xl font-bold">
                {trend.isPositive ? '+' : ''}{trend.percentChange.toFixed(1)}%
              </p>
              <p className="text-sm opacity-90">
                ${Math.abs(trend.change).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Add Net Worth Record</h4>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Assets ($) *
                </label>
                <input
                  type="number"
                  name="assets"
                  value={formData.assets}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Liabilities ($) *
                </label>
                <input
                  type="number"
                  name="liabilities"
                  value={formData.liabilities}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assets Breakdown
              </label>
              <textarea
                name="assetsBreakdown"
                value={formData.assetsBreakdown}
                onChange={handleInputChange}
                placeholder="e.g., Cash: $10,000, Stocks: $50,000, Real Estate: $200,000"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Liabilities Breakdown
              </label>
              <textarea
                name="liabilitiesBreakdown"
                value={formData.liabilitiesBreakdown}
                onChange={handleInputChange}
                placeholder="e.g., Mortgage: $150,000, Car Loan: $20,000, Credit Cards: $5,000"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className={`p-6 rounded-lg border-2 ${currentNetWorth >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <div className="text-sm font-medium text-gray-600 mb-2">Calculated Net Worth</div>
              <div className={`text-4xl font-bold ${currentNetWorth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                ${currentNetWorth.toFixed(2)}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Add Record
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4">Net Worth History</h4>

        {records.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No records yet. Add your first net worth record!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record, index) => {
              const isLatest = index === 0;
              const previousRecord = index < records.length - 1 ? records[index + 1] : null;
              const change = previousRecord ? record.netWorth - previousRecord.netWorth : 0;
              const hasChange = previousRecord && change !== 0;

              return (
                <div
                  key={record.id}
                  className={`border rounded-lg p-4 ${isLatest ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold text-gray-800">{record.date}</div>
                        {isLatest && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            Latest
                          </span>
                        )}
                      </div>
                      {hasChange && (
                        <div className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {change > 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(2)} from previous
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${record.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${record.netWorth.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Assets</div>
                      <div className="text-lg font-semibold text-green-700">${record.assets.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Liabilities</div>
                      <div className="text-lg font-semibold text-red-700">${record.liabilities.toFixed(2)}</div>
                    </div>
                  </div>

                  {record.assetsBreakdown && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-600 mb-1">Assets Breakdown:</div>
                      <div className="text-sm text-gray-700 bg-white p-2 rounded">{record.assetsBreakdown}</div>
                    </div>
                  )}

                  {record.liabilitiesBreakdown && (
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">Liabilities Breakdown:</div>
                      <div className="text-sm text-gray-700 bg-white p-2 rounded">{record.liabilitiesBreakdown}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {records.length > 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Net Worth Timeline</h4>
          <div className="space-y-2">
            {records.slice().reverse().map((record, index) => {
              const maxNetWorth = Math.max(...records.map(r => Math.abs(r.netWorth)));
              const width = maxNetWorth > 0 ? (Math.abs(record.netWorth) / maxNetWorth) * 100 : 0;

              return (
                <div key={record.id} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-600 font-medium">{record.date}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-500 flex items-center justify-end pr-3 ${
                        record.netWorth >= 0 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-white text-sm font-medium">${record.netWorth.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetWorthTracker;
