import { useState, useEffect } from 'react';
import { tradeAPI } from '../../../services/api';

export default function BehavioralBiasPanel({ refreshKey }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBehavioralBias();
  }, [refreshKey]);

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

  const sellPercentage = data.sellPercentage || 0;
  const buyPercentage = data.buyPercentage || 0;
  const sellCount = data.sellCount || 0;
  const buyCount = data.buyCount || 0;
  const totalTrades = data.totalTrades || 0;

  const getBiasLabel = () => {
    if (data.bias === 'RATHER_BULL') {
      return { text: 'Rather Bull', className: 'text-blue-400' };
    } else if (data.bias === 'RATHER_BEAR') {
      return { text: 'Rather Bear', className: 'text-red-400' };
    } else {
      return { text: 'Neutral', className: 'text-gray-300' };
    }
  };

  const biasLabel = getBiasLabel();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Behavioral Bias</h3>
        <span className="text-gray-300 text-sm">Total Trades: {totalTrades}</span>
      </div>

      <div className="space-y-6">
        {/* Icons and counts */}
        <div className="flex items-start justify-between px-4">
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">🐻</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className={`text-2xl font-bold ${biasLabel.className}`}>
              {biasLabel.text}
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">🐂</span>
          </div>
        </div>

        {/* Progress bar with knob */}
        <div className="relative px-4">
          <div className="w-full h-3 bg-gray-400 rounded-full overflow-hidden flex">
            <div 
              className="bg-blue-500 transition-all duration-500"
              style={{ width: `${buyPercentage}%` }}
            />
          </div>
          
          {/* Knob indicator */}
          <div 
            className="absolute top-1/2 transition-all duration-500"
            style={{ left: `${buyPercentage}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-xs">
              ▲
            </div>
          </div>
        </div>

        {/* Counts below */}
        <div className="flex items-center justify-between px-4 text-sm">
          <div className="text-gray-300">
            {sellCount} ({sellPercentage.toFixed(1)}%)
          </div>
          <div className="text-gray-300">
            {buyCount} ({buyPercentage.toFixed(1)}%)
          </div>
        </div>
      </div>
    </div>
  );
}
