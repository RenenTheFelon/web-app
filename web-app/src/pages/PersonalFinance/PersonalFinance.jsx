import { useState } from 'react';
import BudgetCalendar from './components/BudgetCalendar';
import BudgetCalculator from './components/BudgetCalculator';
import IncomeExpenseTracker from './components/IncomeExpenseTracker';
import SpendingAnalytics from './components/SpendingAnalytics';
import GoalPlanner from './components/GoalPlanner';
import NetWorthTracker from './components/NetWorthTracker';

const PersonalFinance = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const userId = 1;

  const tabs = [
    { id: 'calendar', label: 'Budget Calendar', icon: '📅' },
    { id: 'calculator', label: 'Budget Calculator', icon: '🧮' },
    { id: 'tracker', label: 'Income & Expenses', icon: '💰' },
    { id: 'analytics', label: 'Spending Analytics', icon: '📊' },
    { id: 'goals', label: 'Goal Planner', icon: '🎯' },
    { id: 'networth', label: 'Net Worth', icon: '💎' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <BudgetCalendar userId={userId} />;
      case 'calculator':
        return <BudgetCalculator userId={userId} />;
      case 'tracker':
        return <IncomeExpenseTracker userId={userId} />;
      case 'analytics':
        return <SpendingAnalytics userId={userId} />;
      case 'goals':
        return <GoalPlanner userId={userId} />;
      case 'networth':
        return <NetWorthTracker userId={userId} />;
      default:
        return <BudgetCalendar userId={userId} />;
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Personal Finance Manager</h2>
          <p className="text-gray-600">Take control of your finances with our comprehensive tools</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default PersonalFinance;
