import { useState } from 'react';
import { tradeAPI } from '../../../services/api';

export default function TradeEntryForm({ onTradeAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    assetName: '',
    orderType: 'BUY',
    entryPrice: '',
    exitPrice: '',
    profitLoss: '',
    openTime: '',
    closeTime: '',
    tradeDate: new Date().toISOString().split('T')[0],
    durationMinutes: '',
    session: '',
    strategyTag: ''
  });

  const calculateDuration = (openTime, closeTime) => {
    if (!openTime || !closeTime) return '';
    
    const open = new Date(openTime);
    const close = new Date(closeTime);
    const diffMs = close - open;
    const diffMinutes = Math.floor(diffMs / 60000);
    
    return diffMinutes > 0 ? diffMinutes : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'openTime' || name === 'closeTime') {
        const duration = calculateDuration(
          name === 'openTime' ? value : prev.openTime,
          name === 'closeTime' ? value : prev.closeTime
        );
        updated.durationMinutes = duration;
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        assetName: formData.assetName,
        orderType: formData.orderType,
        entryPrice: parseFloat(formData.entryPrice),
        exitPrice: parseFloat(formData.exitPrice),
        profitLoss: parseFloat(formData.profitLoss),
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        tradeDate: formData.tradeDate,
        durationMinutes: parseInt(formData.durationMinutes),
        session: formData.session || null,
        strategyTag: formData.strategyTag || null
      };

      await tradeAPI.create(payload);
      
      setFormData({
        assetName: '',
        orderType: 'BUY',
        entryPrice: '',
        exitPrice: '',
        profitLoss: '',
        openTime: '',
        closeTime: '',
        tradeDate: new Date().toISOString().split('T')[0],
        durationMinutes: '',
        session: '',
        strategyTag: ''
      });
      
      setIsOpen(false);
      
      if (onTradeAdded) {
        onTradeAdded();
      }
    } catch (err) {
      console.error('Failed to add trade:', err);
      setError(err.response?.data?.message || 'Failed to add trade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-6 py-4 text-left hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="text-lg font-semibold text-white">Add New Trade</h3>
              <p className="text-sm text-gray-400">Record your trading activity</p>
            </div>
          </div>
          <svg
            className={`w-6 h-6 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="assetName" className="block text-sm font-medium text-gray-300 mb-2">
                  Asset Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="assetName"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., EUR/USD, AAPL"
                />
              </div>

              <div>
                <label htmlFor="orderType" className="block text-sm font-medium text-gray-300 mb-2">
                  Order Type <span className="text-red-400">*</span>
                </label>
                <select
                  id="orderType"
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>

              <div>
                <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-300 mb-2">
                  Entry Price <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="entryPrice"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  required
                  step="0.00000001"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00000000"
                />
              </div>

              <div>
                <label htmlFor="exitPrice" className="block text-sm font-medium text-gray-300 mb-2">
                  Exit Price <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="exitPrice"
                  name="exitPrice"
                  value={formData.exitPrice}
                  onChange={handleChange}
                  required
                  step="0.00000001"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00000000"
                />
              </div>

              <div>
                <label htmlFor="profitLoss" className="block text-sm font-medium text-gray-300 mb-2">
                  Profit/Loss <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="profitLoss"
                  name="profitLoss"
                  value={formData.profitLoss}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="tradeDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Trade Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="tradeDate"
                  name="tradeDate"
                  value={formData.tradeDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="openTime" className="block text-sm font-medium text-gray-300 mb-2">
                  Open Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="openTime"
                  name="openTime"
                  value={formData.openTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="closeTime" className="block text-sm font-medium text-gray-300 mb-2">
                  Close Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="closeTime"
                  name="closeTime"
                  value={formData.closeTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="durationMinutes"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Auto-calculated"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated from open/close times</p>
              </div>

              <div>
                <label htmlFor="session" className="block text-sm font-medium text-gray-300 mb-2">
                  Session
                </label>
                <select
                  id="session"
                  name="session"
                  value={formData.session}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select session</option>
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                  <option value="Asia">Asia</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="strategyTag" className="block text-sm font-medium text-gray-300 mb-2">
                  Strategy Tag
                </label>
                <input
                  type="text"
                  id="strategyTag"
                  name="strategyTag"
                  value={formData.strategyTag}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Breakout, Scalping, Swing"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Adding Trade...' : 'Add Trade'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
