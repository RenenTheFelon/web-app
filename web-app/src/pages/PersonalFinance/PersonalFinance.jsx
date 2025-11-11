import { useState, useRef } from 'react';
import WealthView from './components/WealthView';
import IncomeExpenseTracker from './components/IncomeExpenseTracker';
import SpendingAnalytics from './components/SpendingAnalytics';
import GoalPlanner from './components/GoalPlanner';
import NetWorthTracker from './components/NetWorthTracker';

const PersonalFinance = () => {
  const [activeTab, setActiveTab] = useState('wealthview');
  const [trackerView, setTrackerView] = useState('ledger-overview');
  const userId = 1;

  const tabs = [
    { id: 'wealthview', label: 'WealthView', icon: '📅' },
    { id: 'tracker', label: 'Income & Expenses', icon: '💰' },
    { id: 'analytics', label: 'Spending Analytics', icon: '📊' },
    { id: 'goals', label: 'Goal Planner', icon: '🎯' },
    { id: 'networth', label: 'Net Worth', icon: '💎' }
  ];

  const handleAddIncome = () => {
    setActiveTab('tracker');
    setTrackerView('add-income');
  };

  const handleAddExpense = () => {
    setActiveTab('tracker');
    setTrackerView('add-expense');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'wealthview':
        return <WealthView userId={userId} onAddIncome={handleAddIncome} onAddExpense={handleAddExpense} />;
      case 'tracker':
        return <IncomeExpenseTracker userId={userId} initialView={trackerView} onViewChange={setTrackerView} />;
      case 'analytics':
        return <SpendingAnalytics userId={userId} />;
      case 'goals':
        return <GoalPlanner userId={userId} />;
      case 'networth':
        return <NetWorthTracker userId={userId} />;
      default:
        return <WealthView userId={userId} onAddIncome={handleAddIncome} onAddExpense={handleAddExpense} />;
    }
  };

  return (
    <section className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Personal Finance Manager</h2>
          <p className="text-gray-400">Take control of your finances with our comprehensive tools</p>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-blue-500 bg-gray-800'
                    : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default PersonalFinance;
