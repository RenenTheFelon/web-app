import { useState, useEffect } from 'react';
import { tradeAPI } from '../../../services/api';

export default function MostTradedInstrumentsPanel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMostTraded();
  }, []);

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
        <div className="space-y-6">
          {data.map((instrument, index) => {
            const totalTrades = instrument.wins + instrument.losses;
            const winPercentage = (instrument.wins / totalTrades) * 100;
            const lossPercentage = (instrument.losses / totalTrades) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">{instrument.asset}</span>
                  <span className="text-gray-300 text-sm">
                    {instrument.wins}W / {instrument.losses}L
                  </span>
                </div>
                
                <div className="w-full h-8 bg-gray-900 rounded-lg overflow-hidden flex">
                  <div 
                    className="bg-green-600 flex items-center justify-center text-white text-xs font-semibold transition-all duration-300"
                    style={{ width: `${winPercentage}%` }}
                  >
                    {winPercentage > 15 && instrument.wins}
                  </div>
                  <div 
                    className="bg-red-600 flex items-center justify-center text-white text-xs font-semibold transition-all duration-300"
                    style={{ width: `${lossPercentage}%` }}
                  >
                    {lossPercentage > 15 && instrument.losses}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
