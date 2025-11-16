import { useState, useEffect } from 'react';
import { tradeAPI } from '../../../services/api';

export default function TradeLogsPanel({ refreshKey }) {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrades();
  }, [refreshKey]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const { data } = await tradeAPI.getAll();
      setTrades(data || []);
    } catch (err) {
      console.error('Failed to fetch trades:', err);
      setError('Failed to load trade logs');
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(8);
  };

  const formatPL = (pl) => {
    const value = parseFloat(pl);
    return value >= 0 ? `+$${value.toFixed(2)}` : `-$${Math.abs(value).toFixed(2)}`;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Trade Logs</h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400">Loading trades...</div>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : trades.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No trades recorded yet
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {trades.map((trade) => (
            <div 
              key={trade.id}
              className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="font-semibold text-white">{trade.assetName}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  trade.orderType === 'BUY' 
                    ? 'bg-green-900/30 text-green-400 border border-green-700' 
                    : 'bg-red-900/30 text-red-400 border border-red-700'
                }`}>
                  {trade.orderType}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="text-gray-400">
                  <span className="text-xs text-gray-500">Open: </span>
                  <span>{formatPrice(trade.entryPrice)}</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-xs text-gray-500">Close: </span>
                  <span>{formatPrice(trade.exitPrice)}</span>
                </div>
                <div className={`font-semibold ${
                  parseFloat(trade.profitLoss) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatPL(trade.profitLoss)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
