import { useState, useEffect } from 'react';
import { tradeAPI } from '../../../services/api';

export default function BehavioralBiasPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBehavioralBias();
  }, []);

  const fetchBehavioralBias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tradeAPI.getBehavioralBias();
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load behavioral bias data');
    } finally {
      setLoading(false);
    }
  };

  const getBiasLabel = (bias) => {
    switch (bias) {
      case 'RATHER_BULL':
        return { text: 'Rather Bull', className: 'text-blue-400' };
      case 'RATHER_BEAR':
        return { text: 'Rather Bear', className: 'text-gray-400' };
      case 'NEUTRAL':
        return { text: 'Neutral', className: 'text-gray-300' };
      default:
        return { text: 'Unknown', className: 'text-gray-300' };
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-center h-48">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const biasLabel = getBiasLabel(data.bias);
  const bullPercentage = data.bullPercentage || 0;
  const bearPercentage = data.bearPercentage || 0;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Behavioral Bias</h3>
        <span className="text-gray-300 text-sm">Total Trades: {data.totalTrades}</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">🐂</span>
          <span className="text-2xl">🐻</span>
        </div>

        <div className="relative">
          <div className="w-full h-10 bg-gray-900 rounded-lg overflow-hidden flex">
            <div 
              className="bg-green-600 flex items-center justify-center text-white text-sm font-semibold transition-all duration-300"
              style={{ width: `${bullPercentage}%` }}
            >
              {bullPercentage > 10 && `${bullPercentage.toFixed(1)}%`}
            </div>
            <div 
              className="bg-red-600 flex items-center justify-center text-white text-sm font-semibold transition-all duration-300"
              style={{ width: `${bearPercentage}%` }}
            >
              {bearPercentage > 10 && `${bearPercentage.toFixed(1)}%`}
            </div>
          </div>
          
          <div 
            className="absolute top-0 h-10 w-1 bg-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/50 -translate-x-1/2"
            style={{ left: `${bullPercentage}%` }}
          >
            <div className="absolute -top-8 left-0 text-yellow-400 text-2xl">
              ▼
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <span className={`text-2xl font-bold ${biasLabel.className}`}>
            {biasLabel.text}
          </span>
        </div>
      </div>
    </div>
  );
}
