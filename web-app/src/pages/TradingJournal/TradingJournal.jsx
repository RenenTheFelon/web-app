import { useState } from 'react';
import BehavioralBiasPanel from './components/BehavioralBiasPanel';
import TradingDayPerformancePanel from './components/TradingDayPerformancePanel';
import ProfitabilityPanel from './components/ProfitabilityPanel';
import MostTradedInstrumentsPanel from './components/MostTradedInstrumentsPanel';
import TradeEntryForm from './components/TradeEntryForm';

export default function TradingJournal() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTradeAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trading Journal</h1>
          <p className="text-gray-400">
            Track and analyze your trading performance with comprehensive insights
          </p>
        </div>

        <TradeEntryForm onTradeAdded={handleTradeAdded} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <BehavioralBiasPanel key={`bias-${refreshKey}`} />
          <TradingDayPerformancePanel key={`performance-${refreshKey}`} />
          <ProfitabilityPanel key={`profitability-${refreshKey}`} />
          <MostTradedInstrumentsPanel key={`instruments-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
}
