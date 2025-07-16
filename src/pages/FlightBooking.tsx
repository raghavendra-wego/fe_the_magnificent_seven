import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, ArrowRightLeft, MapPin, Users, ChevronDown, Plane, Car, Smartphone, Luggage, Search, Sparkles, MessageCircle, ArrowRight, Badge, Filter, Lightbulb, Target, TrendingDown, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import FlightSearch from "@/components/FlightSearch";
import FeatureCards from "@/components/FeatureCards";
import StoriesSection from "@/components/StoriesSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FlightBooking = () => {
  const [tripType, setTripType] = useState("round-trip");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [travelClass, setTravelClass] = useState("economy");
  const [directFlights, setDirectFlights] = useState(false);
  const [showPassengers, setShowPassengers] = useState(false);
  const [showPaymentTypes, setShowPaymentTypes] = useState(false);
  const [activeTab, setActiveTab] = useState("flights");
  const [promptSearch, setPromptSearch] = useState("");
  const [isPromptMode, setIsPromptMode] = useState(false);
  const navigate = useNavigate();
  
  const { toast } = useToast();

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  const handlePromptSearch = () => {
    console.log("handlePromptSearch called with:", promptSearch);
    
    if (!promptSearch.trim()) {
      console.log("Empty prompt search");
      return;
    }
    
    toast({
      title: "AI Search Processing",
      description: `Searching for: "${promptSearch}"`,
    });
    
    console.log("Navigating to flight-results with state:", { 
      promptQuery: promptSearch,
      searchType: 'ai-prompt' 
    });
    
    // Navigate to unified results page with the search query
    navigate('/flight-results', { 
      state: { 
        searchRequest: {
          promptQuery: promptSearch,
          from: { city: "Dubai", country: "United Arab Emirates", code: "DXB" },
          to: { city: "Cairo", country: "Egypt", code: "CAI" },
          departDate: "2024-07-16",
          tripType: "one-way",
          passengers: { adults: 1, children: 0, infants: 0 },
          travelClass: "economy"
        },
        searchType: 'ai-prompt' 
      } 
    });
  };

  const handleTraditionalSearch = () => {
    console.log("handleTraditionalSearch called");
    
    toast({
      title: "Searching flights...",
      description: "Finding the best options for you",
    });
    
    // Navigate to unified results page with traditional search data
    navigate('/flight-results', {
      state: {
        searchRequest: {
          tripType,
          departDate,
          returnDate,
          passengers,
          travelClass,
          directFlights
        },
        searchType: 'traditional'
      }
    });
  };

  const promptExamples = [
    "Under $400, nonstop, Mumbai to Singapore next month—what are my options",
    "Romantic getaway for anniversary in Europe",
    "Adventure trips for solo travelers under $1000",
    "Family vacation with kids to Disney",
    "Business trip to Tokyo next month"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              aria-label="Go to homepage"
              onClick={() => navigate("/")}
              style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
            >
              <div className="w-8 h-8 bg-wego-green rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-wego-text-dark">wego</span>
            </button>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-wego-text-light hover:text-wego-text-dark">WegoPro Business Travel</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src="https://flagcdn.com/w20/ae.png" alt="UAE" className="w-5 h-3" />
              <span className="text-sm">EN</span>
              <span className="text-sm">AED</span>
            </div>
            <a href="#" className="text-wego-text-light hover:text-wego-text-dark">Support</a>
            <a href="#" className="text-wego-text-light hover:text-wego-text-dark">My Trips</a>
            <Button variant="outline" className="border-wego-green text-wego-green hover:bg-wego-green hover:text-white">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="relative min-h-[60vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 pt-12">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/90 backdrop-blur-sm rounded-full p-1">
              <Button
                variant="ghost"
                className={`rounded-full px-6 py-2 flex items-center space-x-2 ${
                  activeTab === "flights"
                    ? 'bg-white text-wego-green shadow-sm'
                    : 'text-wego-text-light hover:text-wego-green'
                }`}
                onClick={() => setActiveTab("flights")}
              >
                <Plane className="w-4 h-4" />
                <span>Flights</span>
              </Button>
              <Button
                variant="ghost"
                className={`rounded-full px-6 py-2 flex items-center space-x-2 ${
                  activeTab === "hotels"
                    ? 'bg-white text-wego-green shadow-sm'
                    : 'text-wego-text-light hover:text-wego-green'
                }`}
                onClick={() => setActiveTab("hotels")}
              >
                <span>🏨</span>
                <span>Hotels</span>
              </Button>
            </div>
          </div>

          {/* AI Prompt Search */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Sparkles className="w-5 h-5 text-wego-green" />
                <h3 className="text-xl font-semibold text-white">Ask Wego AI</h3>
                <Sparkles className="w-5 h-5 text-wego-green" />
              </div>
              <p className="text-white/80 text-sm">Tell us what you're looking for and we'll find the perfect trip</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <MessageCircle className="w-5 h-5 text-wego-text-light" />
                </div>
                <Input
                  value={promptSearch}
                  onChange={(e) => setPromptSearch(e.target.value)}
                  placeholder="e.g., 'Under $400, nonstop, Mumbai to Singapore next month—what are my options'"
                  className="w-full h-14 pl-12 pr-32 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500"
                  onKeyDown={(e) => e.key === 'Enter' && handlePromptSearch()}
                />
                <Button
                  onClick={handlePromptSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-wego-green hover:bg-wego-green/90 text-white rounded-full px-6 h-10"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
              </div>
              
              {/* Example prompts */}
              <div className="mt-4">
                <p className="text-white/70 text-xs text-center mb-3">Try asking:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {promptExamples.slice(0, 3).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPromptSearch(example)}
                      className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-105"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Or divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-white/30"></div>
            <span className="px-4 text-white/70 text-sm font-medium">or search traditionally</span>
            <div className="flex-1 h-px bg-white/30"></div>
          </div>

          {/* Search Form */}
          <div className="max-w-6xl mx-auto">
            <FlightSearch />
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
                <Badge className="bg-blue-100 text-blue-700">
                  <Filter className="w-3 h-3 mr-1" />
                  Nonstop
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  <Filter className="w-3 h-3 mr-1" />
                  Morning Flights
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
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
          onClick={() => navigate('/flight-results', { 
            state: { 
              searchRequest: {
                from: { city: "Delhi", country: "India", code: "DEL" },
                to: { city: "Mumbai", country: "India", code: "BOM" },
                departDate: "2025-07-15T00:00:00.000Z",
                tripType: "round-trip",
                passengers: { adults: 1, children: 0, infants: 0 },
                travelClass: "economy"
              },
              searchType: 'ai-prompt'
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

export default FlightBooking;
