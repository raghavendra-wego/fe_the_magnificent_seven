
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
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
  Target,
  Lightbulb
} from "lucide-react";
import SmartSummaryBanner from "@/components/SmartSummaryBanner";
import PersonalizedFilterSuggestions from "@/components/PersonalizedFilterSuggestions";
import QuickActionsBanner from "@/components/QuickActionsBanner";
import SocialProofBanner from "@/components/SocialProofBanner";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import BookingProgressTracker from "@/components/BookingProgressTracker";
import ExitIntentModal from "@/components/ExitIntentModal";
import {
  FlightResult,
  FilterSuggestion,
  generateFlightResults,
  applyFilters
} from "@/services/flightSummaryService";

const AIFlightResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchState = location.state;
  const searchRequest = searchState?.searchRequest;

  const [flightResults, setFlightResults] = useState<FlightResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<FlightResult[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);

  // Check localStorage for exit intent dismissal
  useEffect(() => {
    if (localStorage.getItem('exitIntentDismissed') === 'true') {
      setShowExitIntent(false);
    }
  }, []);

  // Load flights and filters on mount or when searchRequest changes
  useEffect(() => {
    if (!searchRequest) return;
    const flights = generateFlightResults(searchRequest);
    setFlightResults(flights);
    setFilteredResults(flights);
    setSelectedFilters([]);
  }, [searchRequest]);

  // Debug log to see what state we received
  useEffect(() => {
    console.log("AIFlightResults received state:", searchState);
  }, [searchState]);

  // Helper to format date
  function formatDate(date: string) {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  }

  // Helper to format time
  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Use searchRequest to build summary and mock results
  const fromLabel = searchRequest?.from ? `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})` : 'From';
  const toLabel = searchRequest?.to ? `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})` : 'To';
  const departLabel = searchRequest?.departDate ? formatDate(searchRequest.departDate) : 'Depart';
  const returnLabel = searchRequest?.tripType === 'round-trip' && searchRequest?.returnDate ? formatDate(searchRequest.returnDate) : null;
  const paxLabel = searchRequest?.passengers ? `${searchRequest.passengers.adults} Adult${searchRequest.passengers.adults > 1 ? 's' : ''}` : '1 Adult';
  const classLabel = searchRequest?.travelClass ? searchRequest.travelClass.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Economy';

  const handleFilterSelect = (filter: FilterSuggestion) => {
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

  const handleFlightSelect = (flight: FlightResult) => {
    navigate("/flight-booking", {
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

  // Calculate price statistics for components
  const prices = flightResults.map(f => f.price);
  const cheapestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

  return (
    <div className="min-h-screen bg-gray-50" onMouseLeave={handleExitIntent}>
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
        {/* Top Banners - Full Width */}
        <div className="mb-6">
          {/* Social Proof Banner - Creates urgency and FOMO */}
          <SocialProofBanner
            totalFlights={flightResults.length}
            cheapestPrice={cheapestPrice}
            averagePrice={averagePrice}
          />

          {/* AI-Powered Smart Summary Banner */}
          <SmartSummaryBanner
            flightResults={flightResults}
            onInsightClick={handleInsightClick}
            searchRequest={searchRequest}
          />
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-6">
          {/* Main Results Section */}
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
              {filteredResults.map((flight, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleFlightSelect(flight)}>
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

            {/* No Results */}
            {filteredResults.length === 0 && (
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

          {/* Right Sidebar */}
          <div className="w-80 space-y-4">


            {/* Personalized Recommendations - Compact */}
            <PersonalizedRecommendations
              flights={filteredResults}
              onFlightSelect={handleFlightSelect}
              compact={true}
            />
            {/* Quick Actions Banner - Compact */}
            <QuickActionsBanner
              cheapestPrice={cheapestPrice}
              averagePrice={averagePrice}
              totalFlights={flightResults.length}
              onPriceAlert={handlePriceAlert}
              onShareResults={handleShareResults}
              onSaveSearch={handleSaveSearch}
              compact={true}
            />
            {/* Booking Progress Tracker - Compact */}
            <BookingProgressTracker
              totalFlights={flightResults.length}
              cheapestPrice={cheapestPrice}
              averagePrice={averagePrice}
              compact={true}
            />

            {/* Personalized Filter Suggestions - Compact */}
            <PersonalizedFilterSuggestions
              userId="demo-user-123"
              onFilterSelect={handleFilterSelect}
              selectedFilters={selectedFilters}
              searchRequest={searchRequest}
              compact={true}
            />
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

export default AIFlightResults;
