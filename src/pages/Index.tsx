import { useState } from "react";
import Header from "@/components/Header";
import SearchTabs from "@/components/SearchTabs";
import FlightSearch from "@/components/FlightSearch";
import FeatureCards from "@/components/FeatureCards";
import StoriesSection from "@/components/StoriesSection";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Header */}
        <Header />
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              {/* Search Tabs */}
              <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
              
              {/* Search Form */}
              {activeTab === 'flights' ? (
                <FlightSearch />
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-semibold text-wego-text-dark mb-4">
                      Hotel Search Coming Soon
                    </h3>
                    <p className="text-wego-text-light">
                      We're working on bringing you the best hotel deals. Stay tuned!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <FeatureCards />

      {/* Stories Section */}
      <StoriesSection />
    </div>
  );
};

export default Index;
