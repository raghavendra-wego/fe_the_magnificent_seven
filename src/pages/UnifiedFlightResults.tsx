
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Bell,
  Target,
  Lightbulb
} from "lucide-react";
import { generateFlightResults, searchTraditionalFlights, convertSearchRequestToTraditional, TraditionalFlightResult } from "@/services/flightSummaryService";
import SmartSummaryBanner from "@/components/SmartSummaryBanner";
import PersonalizedFilterSuggestions from "@/components/PersonalizedFilterSuggestions";
import QuickActionsBanner from "@/components/QuickActionsBanner";
import SocialProofBanner from "@/components/SocialProofBanner";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import BookingProgressTracker from "@/components/BookingProgressTracker";
import ExitIntentModal from "@/components/ExitIntentModal";
import LiveActivityDeals from "@/components/LiveActivityDeals";

const UnifiedFlightResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchState = location.state;
  const searchRequest = searchState?.searchRequest || searchState?.searchData;
  const searchType = searchState?.searchType || 'traditional';
  
  // Traditional filter states
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
  
  // AI and smart features states
  const [flightResults, setFlightResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExitIntent, setShowExitIntent] = useState(false);

  // AI conversation state
  const [conversation, setConversation] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);

  // Check localStorage for exit intent dismissal
  useEffect(() => {
    if (localStorage.getItem('exitIntentDismissed') === 'true') {
      setShowExitIntent(false);
    }
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debug log to see what state we received
  useEffect(() => {
    console.log("FlightResults received state:", searchState);
    console.log("FlightResults searchRequest:", searchRequest);
    console.log("FlightResults searchType:", searchType);
  }, [searchState, searchRequest, searchType]);

  // Helper to convert TraditionalFlightResult to UI format
  const mapTraditionalToUIFlight = (traditionalFlight: TraditionalFlightResult) => {
    const outbound = traditionalFlight.outboundSegments;
    const inbound = traditionalFlight.inboundSegments;
    const isRoundTrip = traditionalFlight.tripType === 'roundTrip';

    // Outbound segment
    const outboundFirstLeg = outbound.legs[0];
    const outboundLastLeg = outbound.legs[outbound.legs.length - 1];
    const outboundTotalHours = Math.floor(outbound.flightDuration);
    const outboundTotalMinutes = Math.round((outbound.flightDuration - outboundTotalHours) * 60);
    const outboundDuration = `${outboundTotalHours}h ${outboundTotalMinutes}m`;

    // Inbound segment (for round trip)
    let inboundDuration = '';
    let inboundStops = 0;
    let inboundSegments = [];
    let returnDepartureTime = null;
    let returnArrivalTime = null;
    let returnDepartureAirport = null;
    let returnArrivalAirport = null;
    if (isRoundTrip && inbound) {
      const inboundTotalHours = Math.floor(inbound.flightDuration);
      const inboundTotalMinutes = Math.round((inbound.flightDuration - inboundTotalHours) * 60);
      inboundDuration = `${inboundTotalHours}h ${inboundTotalMinutes}m`;
      inboundStops = inbound.stops;
      inboundSegments = inbound.legs;
      returnDepartureTime = inbound.legs[0]?.dep || null;
      returnArrivalTime = inbound.legs[inbound.legs.length - 1]?.arr || null;
      returnDepartureAirport = inbound.legs[0]?.depAirport || null;
      returnArrivalAirport = inbound.legs[inbound.legs.length - 1]?.arrAirport || null;
    }

    return {
      price: traditionalFlight.totalPrice,
      airline: traditionalFlight.carrier,
      departureTime: outboundFirstLeg.dep,
      arrivalTime: outboundLastLeg.arr,
      duration: outboundDuration,
      stops: outbound.stops,
      departureAirport: outboundFirstLeg.depAirport,
      arrivalAirport: outboundLastLeg.arrAirport,
      aircraft: traditionalFlight.airlineCode + " Aircraft",
      baggage: "20kg", // Default values since not in API
      meal: "Included",
      metaScore: traditionalFlight.metaScore,
      tripType: traditionalFlight.tripType,
      // Additional data for detailed view
      segments: outbound.legs,
      totalDuration: outbound.flightDuration,
      // Round trip specific data
      isRoundTrip,
      inboundDuration,
      inboundStops,
      inboundSegments,
      returnDepartureTime,
      returnArrivalTime,
      returnDepartureAirport,
      returnArrivalAirport
    };
  };

  // Generate flight results based on search criteria
  useEffect(() => {
    console.log("FlightResults: searchRequest received:", searchRequest);
    
    if (searchRequest) {
      setIsLoading(true);
      // Use traditional API if searchType is 'traditional'
      if (searchType === 'traditional') {
        const fetchFlights = async () => {
          try {
            const traditionalReq = convertSearchRequestToTraditional(searchRequest);
            const apiResults: TraditionalFlightResult[] = await searchTraditionalFlights(traditionalReq);
            console.log("FlightResults: API flights:", apiResults);
            
            // Convert to UI format
            const uiFlights = apiResults.map(mapTraditionalToUIFlight);
            setFlightResults(uiFlights);
            setFilteredResults(uiFlights);
            setIsLoading(false);
            
            // Generate initial AI conversation based on search
            const initialConversation = generateInitialConversation(searchRequest, uiFlights);
            setConversation([initialConversation]);
          } catch (error) {
            console.error("FlightResults: Error fetching flights:", error);
            setIsLoading(false);
          }
        };
        fetchFlights();
      } else {
        // Simulate API call delay for AI/other types
        setTimeout(() => {
          try {
            const flights = generateFlightResults(searchRequest);
            console.log("FlightResults: Generated flights:", flights);
            setFlightResults(flights);
            setFilteredResults(flights);
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
            setFilteredResults(mockFlights);
            setIsLoading(false);
            const initialConversation = generateInitialConversation(searchRequest, mockFlights);
            setConversation([initialConversation]);
          }
        }, 1000);
      }
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
      setFilteredResults(mockFlights);
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
      // Handle both old and new duration formats
      let fastestDuration, currentDuration;
      if (typeof fastest.duration === 'string') {
        fastestDuration = parseInt(fastest.duration.split('h')[0]) * 60 + parseInt(fastest.duration.split(' ')[1].split('m')[0]);
      } else {
        fastestDuration = fastest.totalDuration || fastest.duration;
      }
      
      if (typeof flight.duration === 'string') {
        currentDuration = parseInt(flight.duration.split('h')[0]) * 60 + parseInt(flight.duration.split(' ')[1].split('m')[0]);
      } else {
        currentDuration = flight.totalDuration || flight.duration;
      }
      
      return currentDuration < fastestDuration ? flight : fastest;
    }, flights[0]);

    const premiumFlight = flights.find(f => 
      ['Emirates', 'Qatar Airways', 'Etihad', 'Turkish Airlines', 'British Airways', 'Lufthansa'].includes(f.airline) && (f.meal === 'Included' || f.metaScore > 0.8)
    ) || flights[0];

    const bestRatedFlight = flights.find(f => f.metaScore && f.metaScore > 0.9) || flights[0];

    return {
      question: `Find me the best flights from ${fromCity} to ${toCity} for ${departDate}${tripType === 'round-trip' ? ` - ${returnDate}` : ''} (${passengers} ${passengers > 1 ? 'adults' : 'adult'}, ${travelClass} class)`,
      answer: {
        cheapestFare: {
          airline: cheapestFlight?.airline || "Budget Airline",
          price: `$${cheapestFlight?.price?.toLocaleString() || "1,365"}`,
          details: `${cheapestFlight?.stops === 0 ? 'Direct' : `${cheapestFlight?.stops} stop${cheapestFlight?.stops > 1 ? 's' : ''}`} flight, great value for money from ${fromCity} to ${toCity}`
        },
        bestForYou: {
          airline: bestRatedFlight?.airline || premiumFlight?.airline || "Premium Airline",
          price: `$${bestRatedFlight?.price?.toLocaleString() || premiumFlight?.price?.toLocaleString() || "2,365"}`,
          details: `${bestRatedFlight?.stops === 0 ? 'Direct' : `${bestRatedFlight?.stops} stop${bestRatedFlight?.stops > 1 ? 's' : ''}`} flight, ${bestRatedFlight?.metaScore ? `highly rated (${(bestRatedFlight.metaScore * 5).toFixed(1)})` : 'premium experience'}, excellent service record from ${fromCity} to ${toCity}`
        },
        fastestOption: {
          airline: fastestFlight?.airline || "Fast Airline",
          price: `$${fastestFlight?.price?.toLocaleString() || "1,891"}`,
          details: `${fastestFlight?.duration || '2h 30m'} total journey time, shortest travel duration from ${fromCity} to ${toCity}`
        },
        summary: `Found ${flights.length} flight options for ${fromCity} to ${toCity} for ${departDate}${tripType === 'round-trip' ? ` - ${returnDate}` : ''}. ${bestRatedFlight?.airline || premiumFlight?.airline || 'Premium Airline'} offers the best ${bestRatedFlight?.stops === 0 ? 'direct' : 'connecting'} route with ${bestRatedFlight?.metaScore ? `excellent ratings (${(bestRatedFlight.metaScore * 5).toFixed(1)})` : 'premium service'}, while ${cheapestFlight?.airline || 'Budget Airline'} provides excellent value. Current prices are competitive - book soon as demand is high for this route.`
      }
    };
  };

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
            price: "$1,365",
            details: "Still the most affordable option with good timing"
          },
          bestForYou: {
            airline: "Premium Airline",
            price: "$1,691",
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

  const handleFilterSelect = (filter) => {
    const isSelected = selectedFilters.some(f => f.id === filter.id);

    if (isSelected) {
      // Remove filter
      const newFilters = selectedFilters.filter(f => f.id !== filter.id);
      setSelectedFilters(newFilters);
      setFilteredResults(applyFilters(flightResults, newFilters));
    } else {
      // Add filter
      const newFilters = [...selectedFilters, filter];
      setSelectedFilters(newFilters);
      setFilteredResults(applyFilters(flightResults, newFilters));
    }
  };

  const handleInsightClick = (insight: string) => {
    console.log("Insight clicked:", insight);
    // In a real app, this could trigger specific filtering or highlighting
  };

  const handleFlightSelect = (flight) => {
    navigate("/", {
      state: {
        selectedFlight: flight,
        searchRequest: searchRequest
      }
    });
  };

  const handlePriceAlert = () => {
    console.log("Price alert set");
    // In a real app, this would set up price monitoring
  };

  const handleShareResults = () => {
    console.log("Sharing results");
    // In a real app, this would share the results
  };

  const handleSaveSearch = () => {
    console.log("Search saved");
    // In a real app, this would save the search
  };

  // Exit intent handlers
  const handleExitIntent = () => {
    if (localStorage.getItem('exitIntentDismissed') === 'true') return;
    setShowExitIntent(true);
  };

  const handleStayOnPage = () => {
    setShowExitIntent(false);
    // Track that user stayed
    console.log("User chose to stay on page");
  };

  const handleLeaveAnyway = () => {
    localStorage.setItem('exitIntentDismissed', 'true');
    setShowExitIntent(false);
    // Optionally, you could redirect or do nothing
  };

  // Simple filter function (you can enhance this)
  const applyFilters = (flights, filters) => {
    let filtered = [...flights];
    
    filters.forEach(filter => {
      switch (filter.type) {
        case 'stops':
          if (filter.value === 'direct') {
            filtered = filtered.filter(f => f.stops === 0);
          }
          break;
        case 'price':
          filtered = filtered.filter(f => f.price <= filter.value);
          break;
        case 'airline':
          filtered = filtered.filter(f => f.airline.toLowerCase().includes(filter.value.toLowerCase()));
          break;
        case 'rating':
          if (filter.value === 'high') {
            filtered = filtered.filter(f => f.metaScore && f.metaScore > 0.8)
          }
          break;
        case 'duration':
          if (filter.value === 'short') {
            filtered = filtered.filter(f => {
              const duration = f.totalDuration || (typeof f.duration === 'string' ? 
                parseInt(f.duration.split('h')[0]) *60 + parseInt(f.duration.split(' ')[1].split('m')[0]) : 0);
            return duration < 8; // Less than 8 hours
            });
          }
          break;
        default:
          break;
      }
    });
    
    return filtered;
  };

  const currentAnswer = conversation[conversation.length - 1]?.answer;

  // Use searchRequest to build summary and mock results
  const fromLabel = searchRequest?.from ? `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})` : 'From';
  const toLabel = searchRequest?.to ? `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})` : 'To';
  const departLabel = searchRequest?.departDate ? formatDate(searchRequest.departDate) : 'Depart';
  const returnLabel = searchRequest?.tripType === 'round-trip' && searchRequest?.returnDate ? formatDate(searchRequest.returnDate) : null;
  const paxLabel = searchRequest?.passengers ? `${searchRequest.passengers.adults} Adult${searchRequest.passengers.adults > 1 ? 's' : ''}` : '1 Adult';
  const classLabel = searchRequest?.travelClass ? searchRequest.travelClass.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Economy';

  // Calculate price statistics
  const prices = flightResults.map(f => f.price);
  const cheapestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const priceDifference = averagePrice - cheapestPrice;
  const savingsPercentage = prices.length > 0 ? ((priceDifference / averagePrice) * 100) : 0;
  
  // Calculate additional statistics for new data structure
  const directFlights = flightResults.filter(f => f.stops === 0).length;
  const highRatedFlights = flightResults.filter(f => f.metaScore && f.metaScore > 0.8).length;
  const premiumAirlines = flightResults.filter(f => 
    ['Emirates', 'Qatar Airways', 'Etihad', 'Turkish Airlines', 'British Airways', 'Lufthansa'].includes(f.airline)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-16" onMouseLeave={handleExitIntent}>
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
              {searchType === 'ai-prompt' && (
                <Badge className="bg-purple-100 text-purple-700">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Search
                </Badge>
              )}
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
        {/* Top Banners - Full Width */}
        <div className="mb-6">
        

          {/* AI-Powered Smart Summary Banner */}
          <SmartSummaryBanner
            flightResults={flightResults}
            onInsightClick={handleInsightClick}
            searchRequest={searchRequest}
          />
        </div>

        {/* Three Column Layout */}
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-80 space-y-4">
            {/* Traditional Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Filters</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {/* Stops Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Stops</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedStops(!expandedStops)}
                    >
                      {expandedStops ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedStops && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="direct"
                          checked={stops.direct}
                          onCheckedChange={(checked) => setStops({ ...stops, direct: checked as boolean })}
                        />
                        <label htmlFor="direct" className="text-sm">Direct flights only</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="oneStop"
                          checked={stops.oneStop}
                          onCheckedChange={(checked) => setStops({ ...stops, oneStop: checked as boolean })}
                        />
                        <label htmlFor="oneStop" className="text-sm">1 stop</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="twoPlus"
                          checked={stops.twoPlus}
                          onCheckedChange={(checked) => setStops({ ...stops, twoPlus: checked as boolean })}
                        />
                        <label htmlFor="twoPlus" className="text-sm">2+ stops</label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Price Range</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedPrice(!expandedPrice)}
                    >
                      {expandedPrice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedPrice && (
                    <div className="space-y-3">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={15000}
                        min={1000}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>${priceRange[0].toLocaleString()}</span>
                        <span>${priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Options */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Booking</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedBooking(!expandedBooking)}
                    >
                      {expandedBooking ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedBooking && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="wego"
                          checked={booking.wego}
                          onCheckedChange={(checked) => setBooking({ ...booking, wego: checked as boolean })}
                        />
                        <label htmlFor="wego" className="text-sm">Book with Wego</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="airlines"
                          checked={booking.airlines}
                          onCheckedChange={(checked) => setBooking({ ...booking, airlines: checked as boolean })}
                        />
                        <label htmlFor="airlines" className="text-sm">Book with Airlines</label>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
  {/* Smart Components in Right Sidebar */}
  <PersonalizedRecommendations
              flights={filteredResults}
              onFlightSelect={handleFlightSelect}
              compact={true}
            />
          </div>

          {/* Main Content - Flight Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredResults.length} Flights Found
                </h2>
                {selectedFilters.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">with filters:</span>
                    {selectedFilters.map((filter) => (
                      <Badge key={filter.id} variant="secondary" className="bg-blue-100 text-blue-700">
                        {filter.label}
                      </Badge>
                    ))}
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

            {/* Flight Results */}
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                filteredResults.map((flight, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      {/* Onward (Outbound) Block */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-6">
                          {/* Airline Info */}
                          <div className="text-center justify-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                              <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{flight.airline}</div>
                            <div className="text-xs text-gray-500">{flight.aircraft}</div>
                           
                          </div>
                          {/* Flight Details */}
                          <div className="flex items-center space-x-8">
                            <div className="text-center">
                              <div className="text-md font-bold text-gray-900">
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
                              <div className="text-md font-bold text-gray-900">
                                {formatTime(flight.arrivalTime)}
                              </div>
                              <div className="text-sm text-gray-500">{flight.arrivalAirport}</div>
                            </div>
                          </div>
                        </div>
                        {/* Price and Actions for one-way only */}
                        {!flight.isRoundTrip && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              ${flight.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500 mb-3">
                              {flight.baggage} • {flight.meal}
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700">
                              Select
                            </Button>
                          </div>
                        )}
                      </div>
                      {/* Outbound Segments for Multi-stop flights */}
                      {flight.segments && flight.segments.length > 1 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="text-xs text-gray-500 mb-2">Onward Flight Details:</div>
                          <div className="space-y-2">
                            {flight.segments.map((segment, segIndex) => (
                              <div key={segIndex} className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-4">
                                  <span className="font-medium">{segment.flightNum}</span>
                                  <span>{segment.depAirport} → {segment.arrAirport}</span>
                                  <span>{formatTime(segment.dep)} - {formatTime(segment.arr)}</span>
                                  {segment.arrivalNextDay && (
                                    <Badge variant="secondary" className="text-xs">+1 day</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Return (Inbound) Block for Round Trip */}
                      {flight.isRoundTrip && flight.inboundSegments && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                              {/* Airline Info for Return (reuse) */}
                              <div className="text-center justify-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                  <Plane className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-900">{flight.airline}</div>
                                <div className="text-xs text-gray-500">{flight.aircraft}</div>
                              </div>
                              {/* Return Flight Details */}
                              <div className="flex items-center space-x-8">
                                <div className="text-center">
                                  <div className="text-md font-bold text-gray-900">
                                    {formatTime(flight.returnDepartureTime)}
                                  </div>
                                  <div className="text-sm text-gray-500">{flight.returnDepartureAirport}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm text-gray-500">{flight.inboundDuration}</div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-16 h-0.5 bg-gray-300"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <div className="w-16 h-0.5 bg-gray-300"></div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {flight.inboundStops === 0 ? 'Direct' : `${flight.inboundStops} stop${flight.inboundStops > 1 ? 's' : ''}`}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-md font-bold text-gray-900">
                                    {formatTime(flight.returnArrivalTime)}
                                  </div>
                                  <div className="text-sm text-gray-500">{flight.returnArrivalAirport}</div>
                                </div>
                              </div>
                            </div>
                            {/* Price and Actions for round-trip (on return block) */}
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                ${flight.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500 mb-3">
                                {flight.baggage} • {flight.meal}
                              </div>
                              <Button className="bg-green-600 hover:bg-green-700">
                                Select
                              </Button>
                            </div>
                          </div>
                          {/* Return Segments for Multi-stop flights */}
                          {flight.inboundSegments && flight.inboundSegments.length > 1 && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="text-xs text-gray-500 mb-2">Return Flight Details:</div>
                              <div className="space-y-2">
                                {flight.inboundSegments.map((segment, segIndex) => (
                                  <div key={segIndex} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-4">
                                      <span className="font-medium">{segment.flightNum}</span>
                                      <span>{segment.depAirport} → {segment.arrAirport}</span>
                                      <span>{formatTime(segment.dep)} - {formatTime(segment.arr)}</span>
                                      {segment.arrivalNextDay && (
                                        <Badge variant="secondary" className="text-xs">+1 day</Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Additional Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>Flight {flight.airline}</span>
                            <span>•</span>
                            <span>{flight.aircraft}</span>
                            <span>•</span>
                            <span>Economy</span>
                            {flight.tripType && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{flight.tripType}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>{flight.metaScore ? (flight.metaScore * 5).toFixed(1) : '4.2'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* No Results */}
            {!isLoading && filteredResults.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights match your filters</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or removing some filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFilters([]);
                      setFilteredResults(flightResults);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar - AI Features */}
          <div className="w-80 space-y-4">
         

           right side bar
             
          </div>
        </div>
      </div>

      {/* Exit Intent Modal */}
      <ExitIntentModal
        isOpen={showExitIntent}
        onClose={() => setShowExitIntent(false)}
        onStay={handleStayOnPage}
        onLeave={handleLeaveAnyway}
        cheapestPrice={cheapestPrice}
        averagePrice={averagePrice}
      />

      {/* Live Activity & Deals - Sticky Bottom */}
      <LiveActivityDeals
        totalFlights={flightResults.length}
        cheapestPrice={cheapestPrice}
        averagePrice={averagePrice}
      />
    </div>
  );
};

export default UnifiedFlightResults;
