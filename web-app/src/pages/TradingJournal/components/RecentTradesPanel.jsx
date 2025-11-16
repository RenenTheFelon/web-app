import { useState, useEffect } from 'react';
import { tradeAPI } from '../../../services/api';

export default function RecentTradesPanel({ refreshKey }) {
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
      const recentTrades = (data || []).slice(0, 10);
      setTrades(recentTrades);
    } catch (err) {
      console.error('Failed to fetch trades:', err);
      setError('Failed to load recent trades');
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(8);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400">Loading recent trades...</div>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : trades.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No recent trades
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {trades.map((trade) => {
            const isProfitable = parseFloat(trade.profitLoss) >= 0;
            const bgColor = isProfitable ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700';
            const textColor = isProfitable ? 'text-green-400' : 'text-red-400';
            
            return (
              <div 
                key={trade.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${bgColor} transition-all hover:shadow-md`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="font-semibold text-white min-w-[80px]">{trade.assetName}</span>
                  <span className="text-sm text-gray-300 min-w-[50px]">{trade.orderType}</span>
                  <span className="text-sm text-gray-400">
                    {formatPrice(trade.entryPrice)}
                  </span>
                  <span className="text-sm text-gray-500">→</span>
                  <span className="text-sm text-gray-400">
                    {formatPrice(trade.exitPrice)}
                  </span>
                </div>
                
                <div className={`font-semibold ${textColor}`}>
                  {isProfitable ? '+' : ''}{parseFloat(trade.profitLoss).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
