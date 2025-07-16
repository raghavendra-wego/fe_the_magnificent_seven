import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, ArrowRightLeft, MapPin, Users, ChevronDown, Plane, Car, Smartphone, Luggage, Search, Sparkles, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
    
    // Navigate to results page with the search query
    navigate('/flight-results', { 
      state: { 
        promptQuery: promptSearch,
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
    
    // Navigate to results page with traditional search data
    navigate('/flight-results', {
      state: {
        searchData: {
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-wego-green rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-wego-text-dark">wego</span>
            </div>
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
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
            {/* Trip Type Selector */}
            <div className="flex space-x-4 mb-6">
              {[
                { id: "one-way", label: "One-way" },
                { id: "round-trip", label: "Round-trip" },
                { id: "multi-city", label: "Multi-city" }
              ].map((type) => (
                <Button
                  key={type.id}
                  variant="ghost"
                  className={`rounded-full px-4 py-2 ${
                    tripType === type.id
                      ? 'bg-wego-green-bg text-wego-green'
                      : 'text-wego-text-light hover:bg-wego-green-bg hover:text-wego-green'
                  }`}
                  onClick={() => setTripType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* From */}
              <div className="md:col-span-3">
                <label className="text-sm text-wego-text-light mb-2 block">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-wego-text-light" />
                  <Input
                    value="Dubai, United Arab Emirates"
                    readOnly
                    className="pl-10 h-12 border-wego-border"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2 border border-wego-border hover:bg-wego-green-bg"
                >
                  <ArrowRightLeft className="h-4 w-4 text-wego-text-light" />
                </Button>
              </div>

              {/* To */}
              <div className="md:col-span-3">
                <label className="text-sm text-wego-text-light mb-2 block">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-wego-text-light" />
                  <Input
                    placeholder="Where to?"
                    className="pl-10 h-12 border-wego-border"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="md:col-span-2">
                <label className="text-sm text-wego-text-light mb-2 block">Depart</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal border-wego-border",
                        !departDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departDate ? format(departDate, "E, dd MMM yyyy") : "Wed, 16 Jul 2025"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departDate}
                      onSelect={setDepartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date (if round-trip) */}
              {tripType === "round-trip" && (
                <div className="md:col-span-2">
                  <label className="text-sm text-wego-text-light mb-2 block">Return</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal border-wego-border",
                          !returnDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "E, dd MMM yyyy") : "Return"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Search Button */}
              <div className={`md:col-span-${tripType === "round-trip" ? "1" : "3"}`}>
                <Button 
                  onClick={handleTraditionalSearch}
                  className="w-full h-12 bg-wego-green hover:bg-wego-green/90 text-white rounded-xl font-semibold"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-wego-border">
              {/* Direct Flights */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="direct-flights"
                  checked={directFlights}
                  onCheckedChange={(checked) => setDirectFlights(checked === true)}
                />
                <label htmlFor="direct-flights" className="text-sm text-wego-text-dark">
                  Direct flights only
                </label>
              </div>

              {/* Passengers */}
              <Popover open={showPassengers} onOpenChange={setShowPassengers}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-wego-border hover:bg-wego-green-bg"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {totalPassengers} {totalPassengers === 1 ? 'Adult' : 'Adult'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Adults</div>
                        <div className="text-sm text-wego-text-light">&gt;12 years</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{passengers.adults}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-wego-green hover:bg-wego-green/90"
                      onClick={() => setShowPassengers(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Class */}
              <Select value={travelClass} onValueChange={setTravelClass}>
                <SelectTrigger className="w-32 border-wego-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium-economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business Class</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Types */}
              <Popover open={showPaymentTypes} onOpenChange={setShowPaymentTypes}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-wego-border hover:bg-wego-green-bg"
                  >
                    5 Payment Types
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <p className="text-sm text-wego-text-light">
                      By selecting payment types, prices will include applicable fees.
                    </p>
                    <div className="space-y-2">
                      {[
                        "MasterCard Credit",
                        "Visa Credit", 
                        "Tabby - Pay in 4",
                        "Tabby - Pay in 3",
                        "Google Pay",
                        "American Express"
                      ].map((payment) => (
                        <div key={payment} className="flex items-center space-x-2">
                          <Checkbox id={payment} />
                          <label htmlFor={payment} className="text-sm">{payment}</label>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full bg-wego-green hover:bg-wego-green/90"
                      onClick={() => setShowPaymentTypes(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Discover Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-wego-text-dark">
          Discover The Real Value of Travel
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Car Rentals */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-wego-green mb-2">
                  Car Rentals<br />powered by Wego
                </h3>
                <p className="text-sm text-wego-text-light mb-4">
                  Embark on your adventure with<br />our car rental service.
                </p>
                <Button className="bg-wego-green hover:bg-wego-green/90 text-white rounded-full px-6">
                  Book now
                </Button>
              </div>
              <div className="w-20 h-20 bg-wego-green-bg rounded-2xl flex items-center justify-center">
                <Car className="w-10 h-10 text-wego-green" />
              </div>
            </div>
          </div>

          {/* eSIMs */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-wego-green mb-2">
                  eSIMs powered by<br />Wego
                </h3>
                <p className="text-sm text-wego-text-light mb-4">
                  Unlock instant connectivity with<br />Our eSIM Solutions
                </p>
                <Button className="bg-wego-green hover:bg-wego-green/90 text-white rounded-full px-6">
                  Buy now
                </Button>
              </div>
              <div className="w-20 h-20 bg-wego-green-bg rounded-2xl flex items-center justify-center">
                <Smartphone className="w-10 h-10 text-wego-green" />
              </div>
            </div>
          </div>

          {/* Hotels */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-wego-green mb-2">
                  10%+ Off On Hotels<br />in Azerbaijan!
                </h3>
                <p className="text-sm text-wego-text-light mb-2">
                  The right deal makes every<br />destination feel even better.
                </p>
                <p className="text-xs text-wego-text-light mb-4">
                  Use code: WEGOAZERBAIJAN25
                </p>
                <Button className="bg-wego-green hover:bg-wego-green/90 text-white rounded-full px-6">
                  Book now
                </Button>
              </div>
              <div className="w-20 h-20 bg-wego-green-bg rounded-2xl flex items-center justify-center">
                <Luggage className="w-10 h-10 text-wego-green" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
