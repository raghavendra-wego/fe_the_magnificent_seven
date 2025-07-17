
import { useState, useEffect, useRef } from "react";
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
  ArrowLeftRight,
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
import { searchTraditionalFlightsWithSummary, searchAIFlights, convertSearchRequestToTraditional, TraditionalFlightResult } from "@/services/flightSummaryService";
import SmartSummaryBanner from "@/components/SmartSummaryBanner";
import PersonalizedFilterSuggestions from "@/components/PersonalizedFilterSuggestions";
import QuickActionsBanner from "@/components/QuickActionsBanner";
import SocialProofBanner from "@/components/SocialProofBanner";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import BookingProgressTracker from "@/components/BookingProgressTracker";
import ExitIntentModal from "@/components/ExitIntentModal";


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
  const [apiSummarize, setApiSummarize] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price'); // 'price', 'duration', 'departure', 'airline'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  
  // AI search response data
  const [aiSearchData, setAiSearchData] = useState({
    possibleCities: [],
    extractedParams: null,
    originalQuery: ''
  });

  // Ref to prevent duplicate API calls
  const isFetchingRef = useRef(false);

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
      aircraftCode: traditionalFlight.airlineCode,
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
    
    // Reset fetching flag when searchRequest changes
    isFetchingRef.current = false;
    
    if (searchRequest && !isFetchingRef.current) {
      isFetchingRef.current = true;
      setIsLoading(true);
      // Use traditional API if searchType is 'traditional'
      if (searchType === 'traditional') {
        const fetchFlights = async () => {
          try {
            const traditionalReq = convertSearchRequestToTraditional(searchRequest);
            
            // Fetch both flight results and summary data in a single API call
            const { flights: apiResults, summary: summaryData } = await searchTraditionalFlightsWithSummary(traditionalReq);
            
            console.log("FlightResults: API flights:", apiResults);
            console.log("FlightResults: API summary:", summaryData);
            
            // Convert to UI format
            const uiFlights = apiResults.map(mapTraditionalToUIFlight);
            setFlightResults(uiFlights);
            setFilteredResults(sortFlights(uiFlights));
            setApiSummarize(summaryData);
            setIsLoading(false);
            isFetchingRef.current = false;
            
            // Generate initial AI conversation based on search
            const initialConversation = generateInitialConversation(searchRequest, uiFlights);
            setConversation([initialConversation]);
          } catch (error) {
            console.error("FlightResults: Error fetching flights:", error);
            setIsLoading(false);
            isFetchingRef.current = false;
          }
        };
        fetchFlights();
      } else if (searchType === 'ai-search') {
        const fetchAIFlights = async () => {
          try {
            // Call AI search API with the message
            const aiResponse = await searchAIFlights({ message: searchRequest.message });
            console.log("FlightResults: AI response:", aiResponse);
            
            // Store AI search data for destination display
            console.log("AI Search possibleCities:", aiResponse.possibleCities);
            console.log("AI Search extractedParams:", aiResponse.extractedParams);
            setAiSearchData({
              possibleCities: aiResponse.possibleCities || [],
              extractedParams: aiResponse.extractedParams,
              originalQuery: aiResponse.originalQuery
            });
            
            // Convert to UI format
            const uiFlights = aiResponse.data.map(mapTraditionalToUIFlight);
            setFlightResults(uiFlights);
            setFilteredResults(sortFlights(uiFlights));
            setApiSummarize(aiResponse.summarize);
            setIsLoading(false);
            isFetchingRef.current = false;
            
            // Generate initial AI conversation based on search
            const initialConversation = generateInitialConversation(searchRequest, uiFlights);
            setConversation([initialConversation]);
          } catch (error) {
            console.error("FlightResults: Error fetching AI flights:", error);
            setIsLoading(false);
            isFetchingRef.current = false;
            // Show error state instead of mock data
            setFlightResults([]);
            setFilteredResults([]);
            setApiSummarize([]);
          }
        };
        fetchAIFlights();
              } else {
          // Handle other search types (legacy support)
          console.log("FlightResults: Unsupported search type:", searchType);
          setIsLoading(false);
          isFetchingRef.current = false;
          setFlightResults([]);
          setFilteredResults([]);
        }
    } else {
      // If no searchRequest, show empty state
      console.log("FlightResults: No searchRequest, showing empty state");
      setIsLoading(false);
      isFetchingRef.current = false;
      setFlightResults([]);
      setFilteredResults([]);
    }
  }, [searchRequest, searchType]);

  // Re-sort when sort criteria changes
  useEffect(() => {
    if (flightResults.length > 0) {
      setFilteredResults(sortFlights(applyFilters(flightResults, selectedFilters)));
    }
  }, [sortBy, sortOrder, flightResults, selectedFilters]);

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
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
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
    
    // Determine trip type from available data
    let tripType = searchRequest?.tripType || 'one-way';
    if (searchType === 'ai-search' && aiSearchData.extractedParams) {
      const extracted = aiSearchData.extractedParams;
      tripType = extracted.tripType === 'oneWay' ? 'one-way' : 
                  extracted.tripType === 'roundTrip' ? 'round-trip' : tripType;
    }
    if (flights.length > 0 && flights[0].tripType) {
      tripType = flights[0].tripType === 'roundTrip' ? 'round-trip' : 
                 flights[0].tripType === 'oneWay' ? 'one-way' : tripType;
    }
    
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
      setFilteredResults(sortFlights(applyFilters(flightResults, newFilters)));
    } else {
      // Add filter
      const newFilters = [...selectedFilters, filter];
      setSelectedFilters(newFilters);
      setFilteredResults(sortFlights(applyFilters(flightResults, newFilters)));
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

  // Sort flights based on current sort criteria
  const sortFlights = (flights) => {
    return [...flights].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'duration':
          // Convert duration string to minutes for comparison
          aValue = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split(' ')[1].split('m')[0]);
          bValue = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split(' ')[1].split('m')[0]);
          break;
        case 'departure':
          aValue = new Date(a.departureTime).getTime();
          bValue = new Date(b.departureTime).getTime();
          break;
        case 'airline':
          aValue = a.airline.toLowerCase();
          bValue = b.airline.toLowerCase();
          break;
        default:
          aValue = a.price;
          bValue = b.price;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const currentAnswer = conversation[conversation.length - 1]?.answer;

  // Use searchRequest to build summary and mock results
  let fromLabel = 'From';
  let toLabel = 'To';
  
  // For AI search, extract destination info from possibleCities or flight results
  if (searchType === 'ai-search') {
    console.log("Extracting destinations for AI search:", { aiSearchData, flightResults });
    if (aiSearchData.possibleCities && aiSearchData.possibleCities.length > 0) {
      const firstCity = aiSearchData.possibleCities[0];
      fromLabel = `${firstCity.departure}`;
      toLabel = `${firstCity.arrival}`;
      console.log("Using possibleCities for destinations:", { fromLabel, toLabel });
    } else if (flightResults.length > 0) {
      // Extract from first flight result if possibleCities not available
      const firstFlight = flightResults[0];
      fromLabel = firstFlight.departureAirport || 'From';
      toLabel = firstFlight.arrivalAirport || 'To';
      console.log("Using flight results for destinations:", { fromLabel, toLabel });
    }
  } else if (searchRequest?.from && searchRequest?.to) {
    // For traditional search, both from and to should be available
    fromLabel = `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})`;
    toLabel = `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})`;
  } else if (searchRequest?.from) {
    // Only from is available
    fromLabel = `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})`;
  } else if (searchRequest?.to) {
    // Only to is available
    toLabel = `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})`;
  }
  
  // Determine trip type and dates based on search type and available data
  let tripType = searchRequest?.tripType || 'one-way';
  let departDate = searchRequest?.departDate;
  let returnDate = searchRequest?.returnDate;
  
  // For AI search, use the extracted params if available
  if (searchType === 'ai-search' && aiSearchData.extractedParams) {
    const extracted = aiSearchData.extractedParams;
    console.log("AI Search extracted params:", extracted);
    
    tripType = extracted.tripType === 'oneWay' ? 'one-way' : 
                extracted.tripType === 'roundTrip' ? 'round-trip' : tripType;
    
    // Convert date format from YYYYMMDD to YYYY-MM-DD for display
    if (extracted.startDate) {
      const startDateStr = extracted.startDate;
      departDate = `${startDateStr.slice(0, 4)}-${startDateStr.slice(4, 6)}-${startDateStr.slice(6, 8)}`;
      console.log("Converted start date:", { original: extracted.startDate, converted: departDate });
    }
    if (extracted.endDate) {
      const endDateStr = extracted.endDate;
      returnDate = `${endDateStr.slice(0, 4)}-${endDateStr.slice(4, 6)}-${endDateStr.slice(6, 8)}`;
      console.log("Converted end date:", { original: extracted.endDate, converted: returnDate });
    }
  }
  
  // Also check flight results for trip type if available
  if (flightResults.length > 0) {
    const firstFlight = flightResults[0];
    if (firstFlight.tripType) {
      const originalTripType = tripType;
      tripType = firstFlight.tripType === 'roundTrip' ? 'round-trip' : 
                 firstFlight.tripType === 'oneWay' ? 'one-way' : tripType;
      console.log("Trip type from flight results:", { 
        original: originalTripType, 
        flightTripType: firstFlight.tripType, 
        final: tripType 
      });
    }
  }
  
  const departLabel = departDate ? formatDate(departDate) : 'Depart';
  const returnLabel = tripType === 'round-trip' && returnDate ? formatDate(returnDate) : null;
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
              <span className="text-sm text-gray-500">{tripType === 'one-way' ? 'One-way' : tripType === 'multi-city' ? 'Multi-city' : 'Round-trip'}</span>
              <span className="text-sm font-medium">{paxLabel}</span>
              <span className="text-sm font-medium">{classLabel}</span>
              <span className="text-sm font-medium">5 Payment Types</span>
              {searchType === 'ai-search' && (
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
            {tripType === 'round-trip' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Return</span>
                <span className="font-medium">{returnLabel}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">


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
              
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setFilteredResults(sortFlights(applyFilters(flightResults, selectedFilters)));
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="price">Price</option>
                    <option value="duration">Duration</option>
                    <option value="departure">Departure Time</option>
                    <option value="airline">Airline</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      setFilteredResults(sortFlights(applyFilters(flightResults, selectedFilters)));
                    }}
                    className="px-2"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Flight Results */}
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="relative">
                    {/* Sticky loading skeleton */}
                    <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-6 py-2 flex items-center justify-end">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                    </div>
                    <CardContent className="p-6 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredResults.map((flight, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer relative">
                    {/* Sticky Price and Select Button at Top */}
                    <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-6 py-2 flex items-center justify-end">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl font-bold text-green-600">
                          ${flight.price.toLocaleString()}
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1">
                          Select
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 pt-4">
                      {/* Onward (Outbound) Block */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-6">
                          {/* Airline Info */}
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                              <img src={`https://assets.wego.com/image/upload/h_240,c_fill,f_auto,fl_lossy,q_auto:best,g_auto/v20250717/flights/airlines_square/${flight.aircraftCode}.png`} alt={flight.airline} className="w-6 h-6" />
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
                              <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <img src={`https://assets.wego.com/image/upload/h_240,c_fill,f_auto,fl_lossy,q_auto:best,g_auto/v20250717/flights/airlines_square/${flight.aircraftCode}.png`} alt={flight.airline} className="w-6 h-6" />
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
                            {flight.isRoundTrip && (
                              <>
                                <span>•</span>
                                <span className="capitalize">Round-trip</span>
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
                      setFilteredResults(sortFlights(flightResults));
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
            {/* AI-Powered Smart Summary Banner */}
            <SmartSummaryBanner
              flightResults={flightResults}
              onInsightClick={handleInsightClick}
              searchRequest={searchRequest}
              apiSummarize={apiSummarize}
            />
            
            {/* AI Search Query Display */}
            {searchType === 'ai-search' && searchRequest?.message && (
              <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        AI Search Query
                      </h3>
                      <p className="text-xs text-gray-600">
                        "{searchRequest.message}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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


    </div>
  );
};

export default UnifiedFlightResults;
