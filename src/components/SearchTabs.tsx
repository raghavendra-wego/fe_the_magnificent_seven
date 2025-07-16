import { Plane, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface SearchTabsProps {
  activeTab: 'flights' | 'hotels';
  onTabChange: (tab: 'flights' | 'hotels') => void;
}

const SearchTabs = ({ activeTab, onTabChange }: SearchTabsProps) => {
  return (
    <div className="flex space-x-2 mb-6">
      <Button
        variant={activeTab === 'flights' ? 'default' : 'ghost'}
        className={`rounded-full px-6 py-3 ${
          activeTab === 'flights'
            ? 'bg-white text-wego-green shadow-lg hover:bg-white'
            : 'text-white hover:bg-white/10 bg-transparent'
        }`}
        onClick={() => onTabChange('flights')}
      >
        <Plane className="h-4 w-4 mr-2" />
        Flights
      </Button>
      <Button
        variant={activeTab === 'hotels' ? 'default' : 'ghost'}
        className={`rounded-full px-6 py-3 ${
          activeTab === 'hotels'
            ? 'bg-white text-wego-green shadow-lg hover:bg-white'
            : 'text-white hover:bg-white/10 bg-transparent'
        }`}
        onClick={() => onTabChange('hotels')}
      >
        <Building2 className="h-4 w-4 mr-2" />
        Hotels
      </Button>
    </div>
  );
};

export default SearchTabs;