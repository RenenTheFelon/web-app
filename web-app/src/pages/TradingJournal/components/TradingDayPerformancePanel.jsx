import { useState, useEffect } from 'react';
import { tradeAPI } from '../../../services/api';

export default function TradingDayPerformancePanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTradingDayPerformance();
  }, []);

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);
    
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);
    
    return {
      startDate: sunday.toISOString().split('T')[0],
      endDate: saturday.toISOString().split('T')[0]
    };
  };

  const fetchTradingDayPerformance = async () => {
    try {
      setLoading(true);
      setError(null);
      const { startDate, endDate } = getWeekDates();
      const response = await tradeAPI.getTradingDayPerformance(startDate, endDate);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load trading day performance');
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };

  const getDayAbbreviation = (dayNumber) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayNumber];
  };

  const getBestDay = () => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
    const bestDay = data.reduce((best, current) => {
      return (current.profitLoss > best.profitLoss) ? current : best;
    }, data[0]);
    
    return bestDay.profitLoss > 0 ? getDayName(bestDay.dayOfWeek) : null;
  };

  const getMaxAbsoluteValue = () => {
    if (!data || !Array.isArray(data) || data.length === 0) return 1;
    
    const maxValue = Math.max(...data.map(d => Math.abs(d.profitLoss)));
    return maxValue > 0 ? maxValue : 1;
  };

  const getBarHeight = (profitLoss) => {
    const maxValue = getMaxAbsoluteValue();
    const percentage = (Math.abs(profitLoss) / maxValue) * 100;
    return Math.max(percentage, profitLoss !== 0 ? 10 : 5);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
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

  const bestDay = getBestDay();

  const allDaysData = [0, 1, 2, 3, 4, 5, 6].map(dayNum => {
    const dayData = data?.find(d => d.dayOfWeek === dayNum);
    return {
      dayOfWeek: dayNum,
      profitLoss: dayData?.profitLoss || 0
    };
  });

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Trading Day Performance</h3>
        {bestDay && (
          <span className="text-sm text-gray-300">
            Best Day: <span className="text-green-400 font-semibold">{bestDay}</span>
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2 h-48 mb-4">
        {allDaysData.map((day) => {
          const barHeight = getBarHeight(day.profitLoss);
          const isPositive = day.profitLoss > 0;
          const isNegative = day.profitLoss < 0;
          const isZero = day.profitLoss === 0;
          
          return (
            <div key={day.dayOfWeek} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-48">
                <div 
                  className={`w-full rounded-t transition-all duration-300 ${
                    isPositive ? 'bg-green-600' : 
                    isNegative ? 'bg-red-600' : 
                    'bg-gray-700'
                  }`}
                  style={{ height: `${barHeight}%` }}
                />
              </div>
              <div className="mt-2 text-center">
                <div className={`text-xs font-semibold ${
                  isPositive ? 'text-green-400' : 
                  isNegative ? 'text-red-400' : 
                  'text-gray-400'
                }`}>
                  {day.profitLoss !== 0 ? formatCurrency(day.profitLoss) : '$0'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {getDayAbbreviation(day.dayOfWeek)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
