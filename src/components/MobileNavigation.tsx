import React from 'react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isVisible: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  isVisible 
}) => {
  if (!isVisible) return null;

  const tabs = [
    {
      id: 'medications',
      label: 'Medications',
      icon: '💊',
      description: 'Manage medications'
    },
    {
      id: 'patient',
      label: 'Patient',
      icon: '👤',
      description: 'Patient information'
    },
    {
      id: 'results',
      label: 'Safety',
      icon: '🛡️',
      description: 'Safety checks'
    },
    {
      id: 'about',
      label: 'About',
      icon: 'ℹ️',
      description: 'About MEPS'
    }
  ];

  return (
    <div className="mobile-nav md:hidden">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`mobile-nav-item ${
              activeTab === tab.id ? 'active' : 'inactive'
            }`}
            aria-label={tab.description}
          >
            <div className="text-2xl mb-1">{tab.icon}</div>
            <div className="text-xs font-medium">{tab.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
