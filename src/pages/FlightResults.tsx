
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  Plane, 
  Clock,
  ArrowRightLeft,
  Star,
  Filter,
  Menu,
  TrendingDown,
  Calendar,
  Info,
  Sparkles,
  RefreshCw,
  Send,
  MessageSquare,
  Users,
  Zap,
  Award,
  Shield,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Bell
} from "lucide-react";
import { generateFlightResults } from "@/services/flightSummaryService";

const FlightResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchState = location.state;
  const searchRequest = searchState?.searchRequest || searchState?.searchData;
  
  const [stops, setStops] = useState({
    direct: false,
    oneStop: false,
    twoPlus: false
  });
  const [booking, setBooking] = useState({
    wego: false,
    airlines: false
  });
  const [priceRange, setPriceRange] = useState([1365, 12695]);
  const [expandedStops, setExpandedStops] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState(true);
  const [expandedPrice, setExpandedPrice] = useState(true);
  const [flightResults, setFlightResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // AI conversation state
  const [conversation, setConversation] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);

  // Debug log to see what state we received
  useEffect(() => {
    console.log("FlightResults received state:", searchState);
    console.log("FlightResults searchRequest:", searchRequest);
  }, [searchState, searchRequest]);

  // Generate flight results based on search criteria
  useEffect(() => {
    console.log("FlightResults: searchRequest received:", searchRequest);
    
    if (searchRequest) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        try {
          const flights = generateFlightResults(searchRequest);
          console.log("FlightResults: Generated flights:", flights);
          setFlightResults(flights);
          setIsLoading(false);
          
          // Generate initial AI conversation based on search
          const initialConversation = generateInitialConversation(searchRequest, flights);
          setConversation([initialConversation]);
        } catch (error) {
          console.error("FlightResults: Error generating flights:", error);
          // Fallback to mock data if generation fails
          const mockFlights = [
            {
              airline: "Emirates",
              aircraft: "Boeing 777",
              departureTime: "2024-07-16T10:00:00Z",
              arrivalTime: "2024-07-16T12:30:00Z",
              departureAirport: "DXB",
              arrivalAirport: "CAI",
              duration: "2h 30m",
              stops: 0,
              price: 2500,
              baggage: "20kg",
              meal: "Included"
            },
            {
              airline: "EgyptAir",
              aircraft: "Airbus A320",
              departureTime: "2024-07-16T14:00:00Z",
              arrivalTime: "2024-07-16T16:45:00Z",
              departureAirport: "DXB",
              arrivalAirport: "CAI",
              duration: "2h 45m",
              stops: 0,
              price: 1800,
              baggage: "15kg",
              meal: "Not included"
            }
          ];
          setFlightResults(mockFlights);
          setIsLoading(false);
          
          const initialConversation = generateInitialConversation(searchRequest, mockFlights);
          setConversation([initialConversation]);
        }
      }, 1000);
    } else {
      // If no searchRequest, show some default data
      console.log("FlightResults: No searchRequest, showing default data");
      setIsLoading(false);
      
      // Create a default search request for demo purposes
      const defaultSearchRequest = {
        from: { city: "Dubai", country: "United Arab Emirates", code: "DXB" },
        to: { city: "Cairo", country: "Egypt", code: "CAI" },
        departDate: "2024-07-16",
        returnDate: null,
        tripType: "one-way",
        passengers: { adults: 1, children: 0, infants: 0 },
        travelClass: "economy"
      };
      
      const mockFlights = [
        {
          airline: "Emirates",
          aircraft: "Boeing 777",
          departureTime: "2024-07-16T10:00:00Z",
          arrivalTime: "2024-07-16T12:30:00Z",
          departureAirport: "DXB",
          arrivalAirport: "CAI",
          duration: "2h 30m",
          stops: 0,
          price: 2500,
          baggage: "20kg",
          meal: "Included"
        },
        {
          airline: "EgyptAir",
          aircraft: "Airbus A320",
          departureTime: "2024-07-16T14:00:00Z",
          arrivalTime: "2024-07-16T16:45:00Z",
          departureAirport: "DXB",
          arrivalAirport: "CAI",
          duration: "2h 45m",
          stops: 0,
          price: 1800,
          baggage: "15kg",
          meal: "Not included"
        }
      ];
      
      setFlightResults(mockFlights);
      const initialConversation = generateInitialConversation(defaultSearchRequest, mockFlights);
      setConversation([initialConversation]);
    }
  }, [searchRequest]);

  // Helper to format date
  function formatDate(date) {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  }

  // Helper to format time
  function formatTime(dateString) {
    if (!dateString) return '--:--';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return '--:--';
    }
  }

  // Generate initial conversation based on search criteria
  const generateInitialConversation = (searchRequest, flights) => {
    const fromCity = searchRequest?.from?.city || 'Origin';
    const toCity = searchRequest?.to?.city || 'Destination';
    const departDate = searchRequest?.departDate ? formatDate(searchRequest.departDate) : '';
    const returnDate = searchRequest?.returnDate ? formatDate(searchRequest.returnDate) : '';
    const tripType = searchRequest?.tripType || 'one-way';
    const passengers = searchRequest?.passengers?.adults || 1;
    const travelClass = searchRequest?.travelClass || 'economy';

    // Find best options
    const cheapestFlight = flights.reduce((min, flight) => 
      flight.price < min.price ? flight : min, flights[0]);
    
    const fastestFlight = flights.reduce((fastest, flight) => {
      const fastestDuration = parseInt(fastest.duration.split('h')[0]) * 60 + parseInt(fastest.duration.split(' ')[1].split('m')[0]);
      const currentDuration = parseInt(flight.duration.split('h')[0]) * 60 + parseInt(flight.duration.split(' ')[1].split('m')[0]);
      return currentDuration < fastestDuration ? flight : fastest;
    }, flights[0]);

    const premiumFlight = flights.find(f => 
      ['Emirates', 'Qatar Airways', 'Etihad', 'Turkish Airlines'].includes(f.airline) && f.meal === 'Included'
    ) || flights[0];

    return {
      question: `Find me the best flights from ${fromCity} to ${toCity} for ${departDate}${tripType === 'round-trip' ? ` - ${returnDate}` : ''} (${passengers} ${passengers > 1 ? 'adults' : 'adult'}, ${travelClass} class)`,
      answer: {
        cheapestFare: {
          airline: cheapestFlight?.airline || "Budget Airline",
          price: `₹${cheapestFlight?.price?.toLocaleString() || "1,365"}`,
          details: `${cheapestFlight?.stops === 0 ? 'Direct' : `${cheapestFlight?.stops} stop${cheapestFlight?.stops > 1 ? 's' : ''}`} flight, great value for money from ${fromCity} to ${toCity}`
        },
        bestForYou: {
          airline: premiumFlight?.airline || "Premium Airline",
          price: `₹${premiumFlight?.price?.toLocaleString() || "2,365"}`,
          details: `${premiumFlight?.stops === 0 ? 'Direct' : `${premiumFlight?.stops} stop${premiumFlight?.stops > 1 ? 's' : ''}`} flight, premium experience, excellent service record from ${fromCity} to ${toCity}`
        },
        fastestOption: {
          airline: fastestFlight?.airline || "Fast Airline",
          price: `₹${fastestFlight?.price?.toLocaleString() || "1,891"}`,
          details: `${fastestFlight?.duration || '2h 30m'} total journey time, shortest travel duration from ${fromCity} to ${toCity}`
        },
        summary: `Found ${flights.length} flight options for ${fromCity} to ${toCity} for ${departDate}${tripType === 'round-trip' ? ` - ${returnDate}` : ''}. ${premiumFlight?.airline || 'Premium Airline'} offers the most comfortable ${premiumFlight?.stops === 0 ? 'direct' : 'connecting'} route, while ${cheapestFlight?.airline || 'Budget Airline'} provides excellent value. Current prices are 25% below monthly averages - book soon as demand is high for this route.`
      }
    };
  };

  console.log(searchRequest);
  // Use searchRequest to build summary and mock results
  const fromLabel = searchRequest?.from ? `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})` : 'From';
  const toLabel = searchRequest?.to ? `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})` : 'To';
  const departLabel = searchRequest?.departDate ? formatDate(searchRequest.departDate) : 'Depart';
  const returnLabel = searchRequest?.tripType === 'round-trip' && searchRequest?.returnDate ? formatDate(searchRequest.returnDate) : null;
  const paxLabel = searchRequest?.passengers ? `${searchRequest.passengers.adults} Adult${searchRequest.passengers.adults > 1 ? 's' : ''}` : '1 Adult';
  const classLabel = searchRequest?.travelClass ? searchRequest.travelClass.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Economy';

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    setIsAskingQuestion(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockResponse = {
        question: newQuestion,
        answer: {
          cheapestFare: {
            airline: "Budget Airline",
            price: "₹1,365",
            details: "Still the most affordable option with good timing"
          },
          bestForYou: {
            airline: "Premium Airline",
            price: "₹1,691",
            details: "Local carrier advantage, better connections"
          },
          summary: `Based on your question "${newQuestion}", I've refined the recommendations. Premium Airline offers better local knowledge and connections, while Budget Airline remains the budget choice.`
        }
      };
      
      setConversation(prev => [...prev, mockResponse]);
      setNewQuestion("");
      setIsAskingQuestion(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAskQuestion();
    }
  };

  const currentAnswer = conversation[conversation.length - 1]?.answer;

  // Calculate price statistics
  const prices = flightResults.map(f => f.price);
  const cheapestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const priceDifference = averagePrice - cheapestPrice;
  const savingsPercentage = prices.length > 0 ? ((priceDifference / averagePrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              aria-label="Go to homepage"
              onClick={() => navigate("/")}
              style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">wego</span>
            </button>
            <nav className="hidden md:flex space-x-6">
              <button
                className="text-green-600 border-b-2 border-green-600 pb-2 font-medium focus:outline-none bg-transparent"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => navigate("/")}
                aria-label="Go to homepage via Flights"
              >
                Flights
              </button>
              <a href="#" className="text-gray-600 hover:text-gray-900">Hotels</a>
             </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src="https://flagcdn.com/w20/ae.png" alt="UAE" className="w-5 h-3" />
              <span className="text-sm">EN</span>
              <span className="text-sm">AED</span>
            </div>
            <a href="#" className="text-gray-600 hover:text-gray-900">Support</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">My Trips</a>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Search Summary Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{searchRequest?.tripType === 'one-way' ? 'One-way' : searchRequest?.tripType === 'multi-city' ? 'Multi-city' : 'Round-trip'}</span>
              <span className="text-sm font-medium">{paxLabel}</span>
              <span className="text-sm font-medium">{classLabel}</span>
              <span className="text-sm font-medium">5 Payment Types</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">From</span>
              <span className="font-medium">{fromLabel}</span>
            </div>
            <ArrowRightLeft className="w-4 h-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <span className="text-sm">To</span>
              <span className="font-medium">{toLabel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Depart</span>
              <span className="font-medium">{departLabel}</span>
            </div>
            {searchRequest?.tripType === 'round-trip' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Return</span>
                <span className="font-medium">{returnLabel}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* AI-Powered Results Summary */}
        {currentAnswer && (
          <Card className="mb-6 border-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">AI-Powered Flight Analysis</h2>
                    <p className="text-sm text-gray-600">Based on your search criteria and preferences</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                  AI Powered
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Cheapest Option */}
                <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">Best Value</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Cheapest
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {currentAnswer.cheapestFare?.price}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {currentAnswer.cheapestFare?.airline}
                  </div>
                  <div className="text-xs text-gray-600">
                    {currentAnswer.cheapestFare?.details}
                  </div>
                </div>

                {/* Best For You */}
                <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">Recommended</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      Best Overall
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {currentAnswer.bestForYou?.price}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {currentAnswer.bestForYou?.airline}
                  </div>
                  <div className="text-xs text-gray-600">
                    {currentAnswer.bestForYou?.details}
                  </div>
                </div>

                {/* Fastest Option */}
                <div className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-semibold text-gray-900">Fastest</span>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                      Quickest
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {currentAnswer.fastestOption?.price}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {currentAnswer.fastestOption?.airline}
                  </div>
                  <div className="text-xs text-gray-600">
                    {currentAnswer.fastestOption?.details}
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                    <Info className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Analysis Summary</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {currentAnswer.summary}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Banner */}
        {!isLoading && flightResults.length > 0 && (
          <Card className="mb-6 border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      ⚡ Quick Actions to Save Money
                    </h3>
                    <p className="text-xs text-gray-600">
                      Don't miss out on the best deals
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {flightResults.length} flights
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Price Alert */}
                <div className="bg-white p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Price Alert</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Get notified when prices drop
                  </p>
                  <Button size="sm" variant="default" className="w-full text-xs">
                    Set Alert
                  </Button>
                </div>

                {/* Share Results */}
                <div className="bg-white p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Share2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Share Results</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Share with travel companions
                  </p>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    Share
                  </Button>
                </div>

                {/* Save Search */}
                <div className="bg-white p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">Save Search</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Save for later comparison
                  </p>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    Save
                  </Button>
                </div>
              </div>

              {/* Price Insights */}
              <div className="mt-4 pt-3 border-t border-orange-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">
                      Save up to ₹{Math.round(priceDifference / 1000)}k ({Math.round(savingsPercentage)}% off average)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>1,234 people viewing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Main Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLoading ? 'Loading...' : `${flightResults.length} Flights Found`}
                </h2>
                {!isLoading && flightResults.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">from</span>
                    <span className="font-medium">{fromLabel}</span>
                    <span className="text-sm text-gray-500">to</span>
                    <span className="font-medium">{toLabel}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Flight Results */}
            {!isLoading && (
              <div className="space-y-4">
                {flightResults.map((flight, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {/* Airline Info */}
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                              <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{flight.airline}</div>
                            <div className="text-xs text-gray-500">{flight.aircraft}</div>
                          </div>

                          {/* Flight Details */}
                          <div className="flex items-center space-x-8">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">
                                {formatTime(flight.departureTime)}
                              </div>
                              <div className="text-sm text-gray-500">{flight.departureAirport}</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-sm text-gray-500">{flight.duration}</div>
                              <div className="flex items-center space-x-1">
                                <div className="w-16 h-0.5 bg-gray-300"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <div className="w-16 h-0.5 bg-gray-300"></div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">
                                {(() => {
                                  const departure = new Date(flight.departureTime);
                                  const durationParts = flight.duration.split(' ');
                                  const hours = parseInt(durationParts[0].replace('h', ''));
                                  const minutes = parseInt(durationParts[1].replace('m', ''));
                                  const arrival = new Date(departure.getTime() + (hours * 60 + minutes) * 60000);
                                  return formatTime(arrival.toISOString());
                                })()}
                              </div>
                              <div className="text-sm text-gray-500">{flight.arrivalAirport}</div>
                            </div>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ₹{flight.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 mb-3">
                            {flight.baggage} • {flight.meal}
                          </div>
                          <Button className="bg-green-600 hover:bg-green-700">
                            Select
                          </Button>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>Flight {flight.airline} {Math.floor(Math.random() * 9999) + 1000}</span>
                            <span>•</span>
                            <span>{flight.aircraft}</span>
                            <span>•</span>
                            <span>Economy</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>4.2</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && flightResults.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
                  <Button variant="outline" onClick={() => navigate("/flight-booking")}>
                    Modify Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-4">
            {/* AI Chat Interface */}
            <Card className="border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-900">
                        🤖 AI Travel Assistant
                      </h3>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                    AI Powered
                  </Badge>
                </div>

                {/* Chat Messages */}
                <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
                  {conversation.map((msg, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-white p-2 rounded border border-purple-200">
                        <p className="text-xs text-gray-700">{msg.question}</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded border border-purple-200">
                        <p className="text-xs text-gray-700">{msg.answer.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask about flights, prices, or recommendations..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="text-xs min-h-[60px] resize-none"
                  />
                  <Button
                    size="sm"
                    onClick={handleAskQuestion}
                    disabled={isAskingQuestion || !newQuestion.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                
                {/* Stops */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Stops</span>
                    <button
                      onClick={() => setExpandedStops(!expandedStops)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedStops ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  {expandedStops && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="direct"
                          checked={stops.direct}
                          onCheckedChange={(checked) => setStops(prev => ({ ...prev, direct: checked === true }))}
                        />
                        <label htmlFor="direct" className="text-sm">Direct flights only</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="oneStop"
                          checked={stops.oneStop}
                          onCheckedChange={(checked) => setStops(prev => ({ ...prev, oneStop: checked === true }))}
                        />
                        <label htmlFor="oneStop" className="text-sm">1 stop</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="twoPlus"
                          checked={stops.twoPlus}
                          onCheckedChange={(checked) => setStops(prev => ({ ...prev, twoPlus: checked === true }))}
                        />
                        <label htmlFor="twoPlus" className="text-sm">2+ stops</label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Price Range</span>
                    <button
                      onClick={() => setExpandedPrice(!expandedPrice)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedPrice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  {expandedPrice && (
                    <div className="space-y-3">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={20000}
                        min={1000}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>₹{priceRange[0].toLocaleString()}</span>
                        <span>₹{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Options */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Booking Options</span>
                    <button
                      onClick={() => setExpandedBooking(!expandedBooking)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedBooking ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  {expandedBooking && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="wego"
                          checked={booking.wego}
                          onCheckedChange={(checked) => setBooking(prev => ({ ...prev, wego: checked === true }))}
                        />
                        <label htmlFor="wego" className="text-sm">Book with wego</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="airlines"
                          checked={booking.airlines}
                          onCheckedChange={(checked) => setBooking(prev => ({ ...prev, airlines: checked === true }))}
                        />
                        <label htmlFor="airlines" className="text-sm">Book with airlines</label>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
