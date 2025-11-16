import { useState, useEffect } from 'react';
import { tradeAPI } from '../../../services/api';

export default function MostTradedInstrumentsPanel({ refreshKey }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMostTraded();
  }, [refreshKey]);

  const fetchMostTraded = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tradeAPI.getMostTraded(3);
      setData(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load most traded instruments');
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

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Most Traded 3 Instruments</h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-400">No trades recorded yet</p>
        </div>
      ) : (
        <div className="space-y-5">
          {data.map((instrument, index) => {
            const totalTrades = instrument.wins + instrument.losses;
            const winPercentage = totalTrades > 0 ? (instrument.wins / totalTrades) * 100 : 0;
            const lossPercentage = totalTrades > 0 ? (instrument.losses / totalTrades) * 100 : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">{instrument.asset}</span>
                  <span className="text-gray-400 text-sm font-medium">
                    {instrument.wins}W / {instrument.losses}L
                  </span>
                </div>
                
                <div className="w-full h-10 bg-gray-900 rounded-lg overflow-hidden flex shadow-inner">
                  {winPercentage > 0 && (
                    <div 
                      className="bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ease-in-out hover:from-green-500 hover:to-green-400"
                      style={{ width: `${winPercentage}%` }}
                    >
                      {winPercentage > 20 && `${winPercentage.toFixed(0)}%`}
                    </div>
                  )}
                  {lossPercentage > 0 && (
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ease-in-out hover:from-red-400 hover:to-red-500"
                      style={{ width: `${lossPercentage}%` }}
                    >
                      {lossPercentage > 20 && `${lossPercentage.toFixed(0)}%`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
