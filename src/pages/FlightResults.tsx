
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
  MessageSquare
} from "lucide-react";

const FlightResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchState = location.state;
  const searchRequest = searchState?.searchRequest;
  
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

  // AI conversation state
  const [conversation, setConversation] = useState([
    {
      question: searchRequest
        ? `Find me the best flights from ${searchRequest.from ? `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})` : ''} to ${searchRequest.to ? `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})` : ''} for ${searchRequest.departDate ? new Date(searchRequest.departDate).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : ''}`
        : searchState?.promptQuery || "Find me the best flights from Dubai to Cairo for July 16-August 8, 2025",
      answer: {
        cheapestFare: {
          airline: "flynas",
          price: "₽ 1,365",
          details: searchRequest
            ? `1 stop via Riyadh, great value for money from ${searchRequest.from ? `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})` : ''} to ${searchRequest.to ? `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})` : ''}`
            : "1 stop via Riyadh, great value for money"
        },
        bestForYou: {
          airline: "Emirates",
          price: "₽ 2,365", 
          details: searchRequest
            ? `Direct flights, premium experience, excellent service record from ${searchRequest.from ? `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})` : ''} to ${searchRequest.to ? `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})` : ''}`
            : "Direct flights, premium experience, excellent service record"
        },
        summary: searchRequest
          ? `Found 3,608 flight options for ${searchRequest.from ? `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})` : ''} to ${searchRequest.to ? `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})` : ''} for ${searchRequest.departDate ? new Date(searchRequest.departDate).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : ''} - ${searchRequest.returnDate ? new Date(searchRequest.returnDate).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : ''}`
          : searchState?.searchType === 'ai-prompt' 
            ? `Based on your request: "${searchState.promptQuery}", I found 3,608 flight options. Emirates offers the most comfortable direct route, while flynas provides excellent value with just one short stop in Riyadh. Current prices are 35% below monthly averages - book soon as peak season starts.`
            : "Found 3,608 flight options. Emirates offers the most comfortable direct route, while flynas provides excellent value with just one short stop in Riyadh. Current prices are 35% below monthly averages - book soon as peak season starts July 25th."
      }
    }
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Debug log to see what state we received
  useEffect(() => {
    console.log("FlightResults received state:", searchState);
  }, [searchState]);

  // Helper to format date
  function formatDate(date) {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  }
console.log(searchRequest)
  // Use searchRequest to build summary and mock results
  const fromLabel = searchRequest?.from ? `${searchRequest.from.city}, ${searchRequest.from.country} (${searchRequest.from.code})` : 'From';
  const toLabel = searchRequest?.to ? `${searchRequest.to.city}, ${searchRequest.to.country} (${searchRequest.to.code})` : 'To';
  const departLabel = searchRequest?.departDate ? formatDate(searchRequest.departDate) : 'Depart';
  const returnLabel = searchRequest?.tripType === 'round-trip' && searchRequest?.returnDate ? formatDate(searchRequest.returnDate) : null;
  const paxLabel = searchRequest?.passengers ? `${searchRequest.passengers.adults} Adult${searchRequest.passengers.adults > 1 ? 's' : ''}` : '1 Adult';
  const classLabel = searchRequest?.travelClass ? searchRequest.travelClass.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Economy';

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockResponse = {
        question: newQuestion,
        answer: {
          cheapestFare: {
            airline: "flynas",
            price: "₽ 1,365",
            details: "Still the most affordable option with good timing"
          },
          bestForYou: {
            airline: "EgyptAir",
            price: "₽ 1,691",
            details: "Local carrier advantage, better for Cairo connections"
          },
          summary: `Based on your question "${newQuestion}", I've refined the recommendations. EgyptAir offers better local knowledge and connections, while flynas remains the budget choice.`
        }
      };
      
      setConversation(prev => [...prev, mockResponse]);
      setNewQuestion("");
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAskQuestion();
    }
  };

  const currentAnswer = conversation[conversation.length - 1]?.answer;

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
        <div className="flex gap-6">
          {/* Left Side - Filters and Results */}
          <div className="flex-1 flex gap-6">
            {/* Filters Sidebar */}
            <div className="w-72 space-y-4">
              <div className="text-sm text-gray-600">
                Compare Wego vs. these sites: 
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-4 h-4 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm">Saudi Airlines</span>
                </div>
              </div>

              <div className="text-sm">
                <span className="font-medium">3608</span> of <span className="font-medium">3608</span> results
                <Button variant="ghost" className="text-green-600 text-sm p-0 h-auto ml-4">
                  Clear
                </Button>
              </div>

              {/* Stops Filter */}
              <div className="bg-white rounded-lg border p-4">
                <button 
                  onClick={() => setExpandedStops(!expandedStops)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="font-medium text-gray-900">STOPS</h3>
                  {expandedStops ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedStops && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="direct"
                          checked={stops.direct}
                          onCheckedChange={(checked) => setStops(prev => ({...prev, direct: checked === true}))}
                        />
                        <label htmlFor="direct" className="text-sm">Direct</label>
                      </div>
                      <span className="text-sm text-gray-500">₽ 2,119</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="one-stop"
                          checked={stops.oneStop}
                          onCheckedChange={(checked) => setStops(prev => ({...prev, oneStop: checked === true}))}
                        />
                        <label htmlFor="one-stop" className="text-sm">1 stop</label>
                      </div>
                      <span className="text-sm text-gray-500">₽ 1,365</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="two-plus"
                          checked={stops.twoPlus}
                          onCheckedChange={(checked) => setStops(prev => ({...prev, twoPlus: checked === true}))}
                        />
                        <label htmlFor="two-plus" className="text-sm">2+ stops</label>
                      </div>
                      <span className="text-sm text-gray-500">₽ 1,703</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Options Filter */}
              <div className="bg-white rounded-lg border p-4">
                <button 
                  onClick={() => setExpandedBooking(!expandedBooking)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="font-medium text-gray-900">BOOKING OPTIONS</h3>
                  {expandedBooking ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedBooking && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="book-wego"
                        checked={booking.wego}
                        onCheckedChange={(checked) => setBooking(prev => ({...prev, wego: checked === true}))}
                      />
                      <label htmlFor="book-wego" className="text-sm">Book on Wego</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="book-airlines"
                        checked={booking.airlines}
                        onCheckedChange={(checked) => setBooking(prev => ({...prev, airlines: checked === true}))}
                      />
                      <label htmlFor="book-airlines" className="text-sm">Book with Airlines</label>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="bg-white rounded-lg border p-4">
                <button 
                  onClick={() => setExpandedPrice(!expandedPrice)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="font-medium text-gray-900">PRICE</h3>
                  {expandedPrice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedPrice && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>₽ {priceRange[0]}</span>
                      <span>₽ {priceRange[1]}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={12695}
                      min={1365}
                      step={100}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500">
                      Total Price
                      <br />
                      including taxes
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Content */}
            <div className="flex-1">
              {/* Sort Tabs */}
              <div className="flex space-x-8 mb-6 border-b">
                <div className="flex flex-col items-center pb-3">
                  <span className="text-green-600 font-medium">Recommended</span>
                  <span className="text-sm text-gray-500">₽ 1,691</span>
                  <div className="w-full h-0.5 bg-green-600 mt-2"></div>
                </div>
                <div className="flex flex-col items-center pb-3">
                  <span className="text-gray-600">Cheapest</span>
                  <span className="text-sm text-gray-500">₽ 1,365</span>
                </div>
                <div className="flex flex-col items-center pb-3">
                  <span className="text-gray-600">Fastest</span>
                  <span className="text-sm text-gray-500">₽ 2,365</span>
                </div>
                <div className="ml-auto">
                  <Select defaultValue="flight-time">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight-time">Sort By Flight Time</SelectItem>
                      <SelectItem value="price">Sort By Price</SelectItem>
                      <SelectItem value="duration">Sort By Duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Flight Results */}
              <div className="space-y-4">
                {/* Emirates Result */}
                <div className="bg-white rounded-lg border border-red-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                      Fly Emirates. Fly Better.
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Sponsored</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Book directly with no extra fees</p>
                  
                  <div className="grid grid-cols-3 gap-8">
                    {/* Outbound Flight */}
                    <div className="col-span-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">EK</span>
                        </div>
                        <span className="text-sm text-gray-600">Emirates</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-lg font-bold">22:00</div>
                          <div className="text-sm text-gray-500">DXB</div>
                        </div>
                        <div className="flex flex-col items-center flex-1 mx-4">
                          <span className="text-xs text-gray-500">3h 50m</span>
                          <div className="w-full h-px bg-gray-300 my-1 relative">
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-500">Direct</span>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">00:50</div>
                          <div className="text-sm text-gray-500">CAI</div>
                          <div className="text-xs text-gray-400">+1</div>
                        </div>
                      </div>
                    </div>

                    {/* Return Flight */}
                    <div className="col-span-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">EK</span>
                        </div>
                        <span className="text-sm text-gray-600">Emirates</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-lg font-bold">13:10</div>
                          <div className="text-sm text-gray-500">CAI</div>
                        </div>
                        <div className="flex flex-col items-center flex-1 mx-4">
                          <span className="text-xs text-gray-500">3h 20m</span>
                          <div className="w-full h-px bg-gray-300 my-1 relative">
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-500">Direct</span>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">17:30</div>
                          <div className="text-sm text-gray-500">DXB</div>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 flex flex-col justify-center items-end">
                      <div className="text-2xl font-bold">₽ 2,365</div>
                      <div className="text-sm text-gray-500">Total price</div>
                      <Button className="bg-red-500 hover:bg-red-600 text-white mt-2">
                        View Deal
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Flynas Result */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">XY</span>
                        </div>
                        <span className="text-sm text-gray-600">flynas</span>
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs">Best Value</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-lg font-bold">11:25</div>
                          <div className="text-sm text-gray-500">DXB</div>
                        </div>
                        <div className="flex flex-col items-center flex-1 mx-4">
                          <span className="text-xs text-gray-500">8h 55m</span>
                          <div className="w-full h-px bg-gray-300 my-1 relative">
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-500">1 stop RUH</span>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">19:20</div>
                          <div className="text-sm text-gray-500">CAI</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-center items-end">
                      <div className="text-sm text-gray-500 mb-1">from 2 websites</div>
                      <div className="text-2xl font-bold">₽ 1,691</div>
                      <div className="text-sm text-gray-500">Total price</div>
                      <Button variant="outline" className="mt-2">
                        View Deal
                      </Button>
                    </div>
                  </div>
                </div>

                {/* EgyptAir Result */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">MS</span>
                        </div>
                        <span className="text-sm text-gray-600">EgyptAir</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-lg font-bold">23:30</div>
                          <div className="text-sm text-gray-500">CAI</div>
                        </div>
                        <div className="flex flex-col items-center flex-1 mx-4">
                          <span className="text-xs text-gray-500">3h 25m</span>
                          <div className="w-full h-px bg-gray-300 my-1 relative">
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-500">Direct</span>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">03:55</div>
                          <div className="text-sm text-gray-500">DXB</div>
                          <div className="text-xs text-gray-400">+1</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-center items-end">
                      <div className="text-2xl font-bold">₽ 1,691</div>
                      <div className="text-sm text-gray-500">Total price</div>
                      <Button variant="outline" className="mt-2">
                        View Deal
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - AI Components */}
          <div className="w-80 space-y-4">
            {/* Ask Question Input */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <label htmlFor="ask-question" className="block text-sm font-medium text-gray-700">
                    Ask another question
                  </label>
                  <Textarea
                    id="ask-question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Can I add a stopover?"
                    className="resize-none text-sm"
                    rows={2}
                    disabled={isLoading}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Ctrl/⌘ + Enter to send</p>
                    <Button 
                      onClick={handleAskQuestion}
                      disabled={!newQuestion.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Search Summary */}
            <Card className="border-blue-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Here's what we found</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ) : (
                  <>
                    {/* Callouts */}
                    <div className="space-y-3">
                      {/* Cheapest Fare */}
                      <div className="p-3 border-l-3 border-green-500 bg-green-50 rounded-r">
                        <h4 className="font-medium text-green-800 text-sm mb-1">Cheapest fare</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{currentAnswer?.cheapestFare.airline}</span>
                            <span className="text-sm font-bold text-green-700">{currentAnswer?.cheapestFare.price}</span>
                          </div>
                          <p className="text-xs text-green-700">{currentAnswer?.cheapestFare.details}</p>
                        </div>
                      </div>

                      {/* Best for You */}
                      <div className="p-3 border-l-3 border-blue-500 bg-blue-50 rounded-r">
                        <h4 className="font-medium text-blue-800 text-sm mb-1">Best for you</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{currentAnswer?.bestForYou.airline}</span>
                            <span className="text-sm font-bold text-blue-700">{currentAnswer?.bestForYou.price}</span>
                          </div>
                          <p className="text-xs text-blue-700">{currentAnswer?.bestForYou.details}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="text-sm text-gray-700 leading-relaxed">{currentAnswer?.summary}</p>
                    </div>

                    {/* Conversation History */}
                    {conversation.length > 1 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>Previous questions</span>
                        </h4>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {conversation.slice(0, -1).map((item, index) => (
                            <div key={index} className="text-xs p-2 bg-white rounded border">
                              <p className="text-gray-600">Q: {item.question}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Original Ad */}
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">الجزيرة</div>
                <div className="text-lg mb-4">END OF YEAR DEALS</div>
                <div className="text-6xl font-bold text-yellow-400 mb-2">25%</div>
                <div className="text-sm mb-4">OFF</div>
                <div className="text-lg font-bold mb-2">ON ALL FLIGHTS</div>
                <div className="text-xs mb-4">USE CODE: J25ALE25</div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
