import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { CalendarIcon, ArrowRightLeft, MapPin, Users, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sample airport data for predictive search
const AIRPORTS = [
  { city: "Dubai", country: "United Arab Emirates", airport: "Dubai International Airport", code: "DXB" },
  { city: "London", country: "United Kingdom", airport: "Heathrow Airport", code: "LHR" },
  { city: "New York", country: "United States", airport: "John F. Kennedy International Airport", code: "JFK" },
  { city: "Singapore", country: "Singapore", airport: "Changi Airport", code: "SIN" },
  { city: "Sydney", country: "Australia", airport: "Sydney Kingsford Smith Airport", code: "SYD" },
  { city: "Mumbai", country: "India", airport: "Chhatrapati Shivaji Maharaj International Airport", code: "BOM" },
  { city: "Paris", country: "France", airport: "Charles de Gaulle Airport", code: "CDG" },
  { city: "Frankfurt", country: "Germany", airport: "Frankfurt am Main Airport", code: "FRA" },
  { city: "Bangkok", country: "Thailand", airport: "Suvarnabhumi Airport", code: "BKK" },
  { city: "Tokyo", country: "Japan", airport: "Haneda Airport", code: "HND" }
];

const FlightSearch = () => {
  const [tripType, setTripType] = useState("round-trip");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [travelClass, setTravelClass] = useState("economy");
  const [directFlights, setDirectFlights] = useState(false);
  const [showPassengers, setShowPassengers] = useState(false);
  const [showPaymentTypes, setShowPaymentTypes] = useState(false);

  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromDropdown, setFromDropdown] = useState(false);
  const [toDropdown, setToDropdown] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

  const [departPopoverOpen, setDepartPopoverOpen] = useState(false);
  const [returnPopoverOpen, setReturnPopoverOpen] = useState(false);

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const navigate = useNavigate();

  // Filtered airport lists
  const filteredFrom = AIRPORTS.filter(a => {
    const q = fromInput.toLowerCase();
    return (
      a.city.toLowerCase().includes(q) ||
      a.airport.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q)
    );
  });
  const filteredTo = AIRPORTS.filter(a => {
    const q = toInput.toLowerCase();
    return (
      a.city.toLowerCase().includes(q) ||
      a.airport.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl ml-0">
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
        <div className="md:col-span-3 relative">
          <label className="text-sm text-wego-text-light mb-2 block">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-wego-text-light" />
            <Input
              value={selectedFrom ? `${selectedFrom.city} (${selectedFrom.code})` : fromInput}
              onChange={e => {
                setFromInput(e.target.value);
                setSelectedFrom(null);
                setFromDropdown(true);
              }}
              onFocus={() => setFromDropdown(true)}
              onBlur={() => setTimeout(() => setFromDropdown(false), 100)}
              placeholder="From where?"
              className="pl-10 h-12 border-wego-border"
              autoComplete="off"
            />
            {fromDropdown && fromInput && !selectedFrom && (
              <div className="absolute z-10 left-0 right-0 bg-white border border-wego-border rounded-b shadow max-h-60 overflow-y-auto text-left">
                {filteredFrom.length === 0 && (
                  <div className="p-3 text-sm text-gray-400">No results</div>
                )}
                {filteredFrom.map((a) => (
                  <div
                    key={a.code}
                    className="p-3 cursor-pointer hover:bg-wego-green-bg hover:text-wego-green transition-colors border-b last:border-b-0 flex flex-col gap-0.5"
                    style={{ alignItems: 'flex-start' }}
                    onMouseDown={() => {
                      setSelectedFrom(a);
                      setFromInput(`${a.city} (${a.code})`);
                      setFromDropdown(false);
                    }}
                  >
                    <div className="font-medium text-base">{a.city} <span className="text-xs text-gray-400">({a.code})</span></div>
                    <div className="text-xs text-gray-500">{a.airport}, {a.country}</div>
                  </div>
                ))}
              </div>
            )}
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
        <div className="md:col-span-3 relative">
          <label className="text-sm text-wego-text-light mb-2 block">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-wego-text-light" />
            <Input
              value={selectedTo ? `${selectedTo.city} (${selectedTo.code})` : toInput}
              onChange={e => {
                setToInput(e.target.value);
                setSelectedTo(null);
                setToDropdown(true);
              }}
              onFocus={() => setToDropdown(true)}
              onBlur={() => setTimeout(() => setToDropdown(false), 100)}
              placeholder="Where to?"
              className="pl-10 h-12 border-wego-border"
              autoComplete="off"
            />
            {toDropdown && toInput && !selectedTo && (
              <div className="absolute z-10 left-0 right-0 bg-white border border-wego-border rounded-b shadow max-h-60 overflow-y-auto text-left">
                {filteredTo.length === 0 && (
                  <div className="p-3 text-sm text-gray-400">No results</div>
                )}
                {filteredTo.map((a) => (
                  <div
                    key={a.code}
                    className="p-3 cursor-pointer hover:bg-wego-green-bg hover:text-wego-green transition-colors border-b last:border-b-0 flex flex-col gap-0.5"
                    style={{ alignItems: 'flex-start' }}
                    onMouseDown={() => {
                      setSelectedTo(a);
                      setToInput(`${a.city} (${a.code})`);
                      setToDropdown(false);
                    }}
                  >
                    <div className="font-medium text-base">{a.city} <span className="text-xs text-gray-400">({a.code})</span></div>
                    <div className="text-xs text-gray-500">{a.airport}, {a.country}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="md:col-span-2">
          <label className="text-sm text-wego-text-light mb-2 block">Depart</label>
          <Popover open={departPopoverOpen} onOpenChange={setDepartPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-wego-border",
                  !departDate && "text-muted-foreground"
                )}
                onClick={() => setDepartPopoverOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departDate ? format(departDate, "E, dd MMM yyyy") : "Wed, 16 Jul 2025"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={(date) => {
                  setDepartDate(date);
                  setDepartPopoverOpen(false);
                }}
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
            <Popover open={returnPopoverOpen} onOpenChange={setReturnPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal border-wego-border",
                    !returnDate && "text-muted-foreground"
                  )}
                  onClick={() => setReturnPopoverOpen(true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "E, dd MMM yyyy") : "Return"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => {
                    setReturnDate(date);
                    setReturnPopoverOpen(false);
                  }}
                  initialFocus
                  disabled={departDate ? { before: departDate } : undefined}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Search Button */}
        <div className={`md:col-span-${tripType === "round-trip" ? "1" : "3"}`}>
          <Button
            className="w-full h-12 bg-wego-green hover:bg-wego-green/90 text-white rounded-xl font-semibold"
            onClick={() => {
              const searchRequest = {
                from: selectedFrom,
                to: selectedTo,
                departDate: departDate ? departDate.toISOString() : undefined,
                returnDate: returnDate ? returnDate.toISOString() : undefined,
                passengers,
                travelClass,
                directFlights,
                paymentTypes: [], // You can add selected payment types if needed
                tripType
              };
              navigate('/flight-results', { state: { searchRequest, searchType: 'traditional' } });
            }}
            disabled={!selectedFrom || !selectedTo}
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
              {totalPassengers} {totalPassengers === 1 ? 'Adult' : 'Passenger'}
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
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-sm text-wego-text-light">2-12 years</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{passengers.children}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPassengers(p => ({ ...p, children: p.children + 1 }))}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Infants</div>
                  <div className="text-sm text-wego-text-light">&lt;2 years</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{passengers.infants}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPassengers(p => ({ ...p, infants: p.infants + 1 }))}
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
  );
};

export default FlightSearch;