import { useState, useEffect } from 'react';
import { tradeAPI } from '../../../services/api';

export default function ProfitabilityPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfitability();
  }, []);

  const fetchProfitability = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tradeAPI.getProfitability();
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load profitability data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const winRate = data.winRate || 0;
  const lossRate = 100 - winRate;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const winOffset = circumference - (winRate / 100) * circumference;

  const formatCurrency = (value) => {
    return Math.abs(value).toFixed(2);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Profitability</h3>

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-48 h-48 mb-4">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#ef4444"
              strokeWidth="20"
              fill="transparent"
              className="opacity-80"
            />
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#22c55e"
              strokeWidth="20"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={winOffset}
              className="opacity-80 transition-all duration-500"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-white">{winRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-400 mt-1">Winrate</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Total Trades Taken:</span>
          <span className="text-white font-semibold">{data.totalTrades || 0}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Winning Trades:</span>
          <span className="text-green-400 font-semibold">{data.winningTrades || 0}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Losing Trades:</span>
          <span className="text-red-400 font-semibold">{data.losingTrades || 0}</span>
        </div>

        <div className="h-px bg-gray-700 my-2"></div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Total Profit:</span>
          <span className="text-green-400 font-semibold">${formatCurrency(data.totalProfit || 0)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Total Loss:</span>
          <span className="text-red-400 font-semibold">${formatCurrency(data.totalLoss || 0)}</span>
        </div>

        <div className="h-px bg-gray-700 my-2"></div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm font-semibold">Net P/L:</span>
          <span className={`font-bold text-lg ${
            (data.netProfitLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${formatCurrency(data.netProfitLoss || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
