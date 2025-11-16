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

  const sellCount = data.totalTrades - (data.bullPercentage * data.totalTrades / 100);
  const buyCount = data.bullPercentage * data.totalTrades / 100;
  const sellPercentage = data.bearPercentage || 0;
  const buyPercentage = data.bullPercentage || 0;

  const getBiasLabel = () => {
    if (buyPercentage > sellPercentage + 10) {
      return { text: 'Rather Bull', className: 'text-green-400' };
    } else if (sellPercentage > buyPercentage + 10) {
      return { text: 'Rather Bear', className: 'text-red-400' };
    } else {
      return { text: 'Neutral', className: 'text-yellow-400' };
    }
  };

  const biasLabel = getBiasLabel();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Behavioral Bias</h3>
        <span className="text-gray-300 text-sm">Total Trades: {data.totalTrades}</span>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🐻</span>
            <div className="text-center">
              <div className="text-red-400 font-bold text-lg">{Math.round(sellCount)}</div>
              <div className="text-gray-400 text-xs">{sellPercentage.toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🐂</span>
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">{Math.round(buyCount)}</div>
              <div className="text-gray-400 text-xs">{buyPercentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="w-full h-12 bg-gray-900 rounded-full overflow-hidden flex shadow-lg">
            <div 
              className="bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white text-sm font-semibold transition-all duration-500 ease-in-out"
              style={{ width: `${sellPercentage}%` }}
            >
              {sellPercentage > 15 && `SELL`}
            </div>
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-semibold transition-all duration-500 ease-in-out"
              style={{ width: `${buyPercentage}%` }}
            >
              {buyPercentage > 15 && `BUY`}
            </div>
          </div>
          
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out"
            style={{ left: `${buyPercentage}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-yellow-400 rounded-full border-4 border-gray-900 shadow-xl shadow-yellow-400/50 animate-pulse"></div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 text-3xl drop-shadow-lg">
                ▼
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <span className={`text-2xl font-bold ${biasLabel.className} drop-shadow-lg`}>
            {biasLabel.text}
          </span>
        </div>
      </div>
    </div>
  );
}
