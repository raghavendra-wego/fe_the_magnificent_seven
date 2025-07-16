import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import SearchTabs from "@/components/SearchTabs";
import FlightSearch from "@/components/FlightSearch";
import FeatureCards from "@/components/FeatureCards";
import StoriesSection from "@/components/StoriesSection";
import { 
  Sparkles, 
  Users, 
  TrendingUp, 
  Target, 
  Zap,
  ArrowRight,
  Lightbulb,
  Filter,
  TrendingDown
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const navigate = useNavigate();

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

      {/* AI Features Demo Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Smart Flight Summarizer & Personalized Filter Assistant
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experience the future of flight search with AI-powered insights and personalized recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* AI Summary Feature */}
              <Card className="border-green-200 bg-white shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AI-Powered Search Summary</CardTitle>
                      <p className="text-sm text-gray-600">Intelligent insights from your search results</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <TrendingDown className="w-4 h-4 text-green-600 mt-0.5" />
                      <p className="text-sm text-gray-700">Most budget flights today depart after 6 PM</p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <Target className="w-4 h-4 text-green-600 mt-0.5" />
                      <p className="text-sm text-gray-700">Indigo has all the nonstop flights under ₹5,000</p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <Zap className="w-4 h-4 text-green-600 mt-0.5" />
                      <p className="text-sm text-gray-700">Monday return flights are 30% more expensive</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personalized Filters */}
              <Card className="border-blue-200 bg-white shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">"Users Like You" Filter Suggestions</CardTitle>
                      <p className="text-sm text-gray-600">Personalized recommendations based on behavior</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Filter className="w-3 h-3 mr-1" />
                        Nonstop
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Filter className="w-3 h-3 mr-1" />
                        Morning Flights
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Filter className="w-3 h-3 mr-1" />
                        Baggage Included
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Based on behavioral patterns of similar travelers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Button */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                onClick={() => navigate('/ai-flight-results', { 
                  state: { 
                    searchRequest: {
                      from: { city: "Delhi", country: "India", code: "DEL" },
                      to: { city: "Mumbai", country: "India", code: "BOM" },
                      departDate: "2025-07-15T00:00:00.000Z",
                      tripType: "round-trip",
                      passengers: { adults: 1, children: 0, infants: 0 },
                      travelClass: "economy"
                    },
                    searchType: 'ai-powered'
                  } 
                })}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try AI-Powered Flight Search
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Experience the smart features in action
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
