// AI-Powered Flight Summary Service
// This service analyzes flight search results and generates intelligent insights

// New API interfaces for traditional search
export interface TraditionalSearchRequest {
  departure: string;
  arrival: string;
  startDate: string;
  endDate?: string; // optional for one-way
}

export interface FlightLeg {
  arr: string;
  arrAirport: string;
  arrivalNextDay?: boolean;
  dep: string;
  depAirport: string;
  flightNum: string;
}

export interface FlightSegments {
  flightDuration: number;
  legs: FlightLeg[];
  stops: number;
}

export interface TraditionalFlightResult {
  airlineCode: string;
  carrier: string;
  inboundSegments?: FlightSegments;
  outboundSegments: FlightSegments;
  metaScore: number;
  totalPrice: number;
  tripType: string;
}

export interface TraditionalSearchResponse {
  data: TraditionalFlightResult[];
  summarize: string[];
}

// Legacy interfaces for backward compatibility
export interface FlightResult {
  price: number;
  airline: string;
  departureTime: string;
  duration: string;
  stops: number;
  returnDay?: string;
  baggage?: string;
  meal?: string;
  aircraft?: string;
  departureAirport?: string;
  arrivalAirport?: string;
}

export interface FlightSummary {
  insights: string[];
  priceAnalysis: {
    cheapestPrice: number;
    averagePrice: number;
    priceRange: string;
  };
  timingAnalysis: {
    morningFlights: number;
    afternoonFlights: number;
    eveningFlights: number;
    nightFlights: number;
  };
  airlineAnalysis: {
    totalAirlines: number;
    directFlights: number;
    mostCommonAirline: string;
  };
}

export interface FilterSuggestion {
  id: string;
  label: string;
  category: 'timing' | 'airline' | 'price' | 'stops' | 'baggage' | 'meal' | 'class';
  value: string;
  description: string;
  usageCount: number;
}

export interface SearchRequest {
  from?: { city: string; country: string; code: string };
  to?: { city: string; country: string; code: string };
  departDate?: string;
  returnDate?: string;
  passengers?: { adults: number; children: number; infants: number };
  travelClass?: string;
  tripType?: string;
}

// Generate realistic flight data based on search parameters
export const generateFlightResults = (searchRequest: SearchRequest): FlightResult[] => {
  const { from, to, departDate, returnDate, passengers, travelClass, tripType } = searchRequest;
  
  // Base flight data with realistic variations
  const baseFlights = [
    {
      airline: "Indigo",
      basePrice: 4800,
      aircraft: "A320",
      baggage: "20kg",
      meal: "Included"
    },
    {
      airline: "Air India",
      basePrice: 5200,
      aircraft: "A321",
      baggage: "25kg",
      meal: "Included"
    },
    {
      airline: "SpiceJet",
      basePrice: 3800,
      aircraft: "B737",
      baggage: "15kg",
      meal: "Not included"
    },
    {
      airline: "Vistara",
      basePrice: 6500,
      aircraft: "A320",
      baggage: "25kg",
      meal: "Included"
    },
    {
      airline: "GoAir",
      basePrice: 3500,
      aircraft: "A320",
      baggage: "15kg",
      meal: "Not included"
    },
    {
      airline: "AirAsia",
      basePrice: 4200,
      aircraft: "A320",
      baggage: "20kg",
      meal: "Not included"
    },
    {
      airline: "Emirates",
      basePrice: 7200,
      aircraft: "B777",
      baggage: "30kg",
      meal: "Included"
    },
    {
      airline: "Qatar Airways",
      basePrice: 6800,
      aircraft: "A350",
      baggage: "30kg",
      meal: "Included"
    },
    {
      airline: "Etihad",
      basePrice: 6900,
      aircraft: "A320",
      baggage: "25kg",
      meal: "Included"
    },
    {
      airline: "Turkish Airlines",
      basePrice: 6100,
      aircraft: "B737",
      baggage: "25kg",
      meal: "Included"
    }
  ];

  // Adjust prices based on route distance and demand
  const routeMultiplier = getRouteMultiplier(from?.code, to?.code);
  const dateMultiplier = getDateMultiplier(departDate);
  const classMultiplier = getClassMultiplier(travelClass);
  const passengerMultiplier = passengers?.adults ? passengers.adults : 1;

  return baseFlights.map((flight, index) => {
    const adjustedPrice = Math.round(
      flight.basePrice * routeMultiplier * dateMultiplier * classMultiplier * passengerMultiplier
    );
    
    // Generate realistic departure times
    const departureHour = 6 + (index * 2) % 18; // Spread flights throughout the day
    const departureDate = new Date(departDate || new Date());
    departureDate.setHours(departureHour, (index * 15) % 60, 0, 0);
    
    // Calculate duration based on route
    const duration = getRouteDuration(from?.code, to?.code);
    
    // Determine stops based on route and airline
    const stops = getStopsForRoute(from?.code, to?.code, flight.airline);
    
    return {
      price: adjustedPrice,
      airline: flight.airline,
      departureTime: departureDate.toISOString(),
      duration,
      stops,
      baggage: flight.baggage,
      meal: flight.meal,
      aircraft: flight.aircraft,
      departureAirport: from?.code || "DEL",
      arrivalAirport: to?.code || "BOM"
    };
  });
};

// Helper functions for realistic data generation
const getRouteMultiplier = (fromCode?: string, toCode?: string): number => {
  const routes: Record<string, number> = {
    "DEL-BOM": 1.0,    // Delhi to Mumbai
    "BOM-DEL": 1.0,    // Mumbai to Delhi
    "DEL-BLR": 1.2,    // Delhi to Bangalore
    "BLR-DEL": 1.2,    // Bangalore to Delhi
    "BOM-BLR": 0.9,    // Mumbai to Bangalore
    "BLR-BOM": 0.9,    // Bangalore to Mumbai
    "DEL-HYD": 1.1,    // Delhi to Hyderabad
    "HYD-DEL": 1.1,    // Hyderabad to Delhi
    "BOM-HYD": 0.8,    // Mumbai to Hyderabad
    "HYD-BOM": 0.8,    // Hyderabad to Mumbai
    "DEL-CCU": 1.3,    // Delhi to Kolkata
    "CCU-DEL": 1.3,    // Kolkata to Delhi
    "BOM-CCU": 1.4,    // Mumbai to Kolkata
    "CCU-BOM": 1.4,    // Kolkata to Mumbai
    "DEL-MAA": 1.5,    // Delhi to Chennai
    "MAA-DEL": 1.5,    // Chennai to Delhi
    "BOM-MAA": 1.1,    // Mumbai to Chennai
    "MAA-BOM": 1.1,    // Chennai to Mumbai
  };
  
  const routeKey = `${fromCode}-${toCode}`;
  return routes[routeKey] || 1.0;
};

const getDateMultiplier = (departDate?: string): number => {
  if (!departDate) return 1.0;
  
  const date = new Date(departDate);
  const today = new Date();
  const daysUntilDeparture = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Higher prices for closer dates, peak season, weekends
  if (daysUntilDeparture <= 7) return 1.4; // Last minute
  if (daysUntilDeparture <= 14) return 1.2; // Short notice
  if (daysUntilDeparture <= 30) return 1.1; // Near term
  if (daysUntilDeparture <= 90) return 1.0; // Normal
  return 0.9; // Advance booking discount
};

const getClassMultiplier = (travelClass?: string): number => {
  switch (travelClass) {
    case 'economy': return 1.0;
    case 'premium-economy': return 1.5;
    case 'business': return 3.0;
    case 'first': return 5.0;
    default: return 1.0;
  }
};

const getRouteDuration = (fromCode?: string, toCode?: string): string => {
  const routes: Record<string, string> = {
    "DEL-BOM": "2h 15m",
    "BOM-DEL": "2h 15m",
    "DEL-BLR": "2h 45m",
    "BLR-DEL": "2h 45m",
    "BOM-BLR": "1h 45m",
    "BLR-BOM": "1h 45m",
    "DEL-HYD": "2h 10m",
    "HYD-DEL": "2h 10m",
    "BOM-HYD": "1h 30m",
    "HYD-BOM": "1h 30m",
    "DEL-CCU": "2h 30m",
    "CCU-DEL": "2h 30m",
    "BOM-CCU": "2h 45m",
    "CCU-BOM": "2h 45m",
    "DEL-MAA": "3h 15m",
    "MAA-DEL": "3h 15m",
    "BOM-MAA": "2h 30m",
    "MAA-BOM": "2h 30m",
  };
  
  const routeKey = `${fromCode}-${toCode}`;
  return routes[routeKey] || "2h 30m";
};

const getStopsForRoute = (fromCode: string, toCode: string, airline: string): number => {
  // Premium airlines typically offer more direct flights
  const premiumAirlines = ["Emirates", "Qatar Airways", "Etihad", "Vistara"];
  const budgetAirlines = ["SpiceJet", "GoAir", "AirAsia"];
  
  if (premiumAirlines.includes(airline)) {
    return Math.random() < 0.8 ? 0 : 1; // 80% direct for premium
  }
  
  if (budgetAirlines.includes(airline)) {
    return Math.random() < 0.6 ? 0 : 1; // 60% direct for budget
  }
  
  return Math.random() < 0.7 ? 0 : 1; // 70% direct for others
};

// Generate realistic insights based on actual search parameters
const generateRouteInsights = (flights: FlightResult[], searchRequest?: SearchRequest): string[] => {
  const { from, to, departDate, returnDate, passengers, travelClass, tripType } = searchRequest || {};
  const insights: string[] = [];

  if (flights.length === 0) {
    return ["No flights found for your search criteria"];
  }

  // Price analysis insights
  const prices = flights.map(f => f.price);
  const cheapestPrice = Math.min(...prices);
  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const maxPrice = Math.max(...prices);
  const priceVariation = ((maxPrice - cheapestPrice) / cheapestPrice * 100);
  const priceRange = maxPrice - cheapestPrice;

  // Price-based insights
  if (priceVariation > 100) {
    insights.push(`Huge price variation (${Math.round(priceVariation)}%) - book early for savings up to $${(priceRange / 1000).toFixed(0)}k`);
  } else if (priceVariation > 50) {
    insights.push(`Significant price variation (${Math.round(priceVariation)}%) - flexible dates could save $${(priceRange / 1000).toFixed(0)}k`);
  } else if (priceVariation > 25) {
    insights.push(`Moderate price variation (${Math.round(priceVariation)}%) - compare all options for best deal`);
  }

  // Timing analysis
  const timingAnalysis = flights.reduce((acc, flight) => {
    const hour = new Date(flight.departureTime).getHours();
    if (hour >= 6 && hour < 12) acc.morning++;
    else if (hour >= 12 && hour < 18) acc.afternoon++;
    else if (hour >= 18 && hour < 22) acc.evening++;
    else acc.night++;
    return acc;
  }, { morning: 0, afternoon: 0, evening: 0, night: 0 });

  const totalFlights = flights.length;
  const morningPercentage = (timingAnalysis.morning / totalFlights) * 100;
  const eveningPercentage = (timingAnalysis.evening / totalFlights) * 100;

  // Timing insights
  if (morningPercentage > 40) {
    insights.push(`${Math.round(morningPercentage)}% of flights depart in the morning (6 AM - 12 PM)`);
  }
  if (eveningPercentage > 30) {
    insights.push(`${Math.round(eveningPercentage)}% of flights are evening departures (6 PM - 10 PM)`);
  }

  // Airline analysis
  const airlineCounts = flights.reduce((acc, flight) => {
    acc[flight.airline] = (acc[flight.airline] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const airlineEntries = Object.entries(airlineCounts).sort(([,a], [,b]) => b - a);
  const topAirline = airlineEntries[0];
  const secondAirline = airlineEntries[1];

  // Airline insights
  if (topAirline && topAirline[1] > 2) {
    const percentage = Math.round((topAirline[1] / totalFlights) * 100);
    insights.push(`${topAirline[0]} dominates with ${percentage}% of flights (${topAirline[1]} options)`);
  }

  if (secondAirline && secondAirline[1] > 1) {
    insights.push(`${secondAirline[0]} offers ${secondAirline[1]} competitive alternatives`);
  }

  // Direct vs connecting flights analysis
  const directFlights = flights.filter(f => f.stops === 0);
  const connectingFlights = flights.filter(f => f.stops > 0);
  const directPercentage = (directFlights.length / totalFlights) * 100;

  if (directPercentage > 70) {
    insights.push(`${Math.round(directPercentage)}% of flights are direct - great for convenience`);
  } else if (directPercentage < 30) {
    insights.push(`Only ${Math.round(directPercentage)}% direct flights - consider layovers for better prices`);
  }

  // Duration analysis
  const durations = flights.map(f => {
    const parts = f.duration.split(' ');
    const hours = parseInt(parts[0].replace('h', ''));
    const minutes = parseInt(parts[1].replace('m', ''));
    return hours * 60 + minutes;
  });
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  if (maxDuration - minDuration > 60) {
    insights.push(`Flight duration varies from ${Math.floor(minDuration/60)}h ${minDuration%60}m to ${Math.floor(maxDuration/60)}h ${maxDuration%60}m`);
  }

  // Baggage and meal analysis
  const baggageIncluded = flights.filter(f => f.baggage && parseInt(f.baggage) >= 20).length;
  const mealIncluded = flights.filter(f => f.meal === 'Included').length;
  const baggagePercentage = (baggageIncluded / totalFlights) * 100;
  const mealPercentage = (mealIncluded / totalFlights) * 100;

  if (baggagePercentage > 60) {
    insights.push(`${Math.round(baggagePercentage)}% of flights include checked baggage (20kg+)`);
  }
  if (mealPercentage > 50) {
    insights.push(`${Math.round(mealPercentage)}% of flights include in-flight meals`);
  }

  // Route-specific insights
  const routeKey = `${from?.code}-${to?.code}`;
  const routeInsights: Record<string, string[]> = {
    "DEL-BOM": [
      "Indigo and Air India dominate this route with frequent flights",
      "Morning flights (6-10 AM) are 20% more expensive than evening options",
      "Direct flights available from all major airlines",
      "Peak season (Oct-Mar) sees 30% price increase",
      "Weekend flights typically cost 15% more"
    ],
    "BOM-DEL": [
      "Evening flights (6-9 PM) offer the best value for money",
      "SpiceJet and GoAir provide budget options under $4,000",
      "Weekend flights are 15% more expensive than weekdays",
      "Last-minute bookings (within 7 days) cost 40% more",
      "Business travelers prefer early morning departures"
    ],
    "DEL-BLR": [
      "Vistara offers premium experience with competitive pricing",
      "Early morning flights (5-7 AM) are cheapest",
      "Flight duration varies from 2h 30m to 3h 15m",
      "Tech professionals prefer afternoon departures",
      "Monsoon season (Jun-Sep) affects pricing by 10-15%"
    ],
    "BLR-DEL": [
      "Air India has the most frequent flights on this route",
      "Afternoon flights (2-5 PM) have the best availability",
      "Premium economy options available on select airlines",
      "Corporate travelers dominate morning flights",
      "Festival season (Oct-Nov) sees 25% price surge"
    ],
    "BOM-BLR": [
      "Shortest domestic route with 1h 45m flight time",
      "Budget airlines dominate with prices starting at $3,500",
      "Multiple flights throughout the day",
      "High frequency route - flights every 30 minutes",
      "Startup hub connection - popular with tech travelers"
    ],
    "BLR-BOM": [
      "High frequency route with flights every 30 minutes",
      "Indigo offers the most competitive pricing",
      "Evening flights are most popular",
      "Business travelers prefer early morning departures",
      "Weekend leisure travelers prefer afternoon flights"
    ],
    "DEL-HYD": [
      "Hyderabad route sees moderate competition",
      "Air India and Indigo lead with most options",
      "Flight duration consistently around 2h 10m",
      "IT professionals frequent this route",
      "Weekend flights are 10% more expensive"
    ],
    "HYD-DEL": [
      "Hyderabad to Delhi offers good connectivity",
      "Multiple airlines serve this route",
      "Business travelers prefer morning departures",
      "Leisure travelers choose evening flights",
      "Festival season affects availability"
    ],
    "DEL-CCU": [
      "Kolkata route has limited direct options",
      "Connecting flights often cheaper than direct",
      "Flight duration varies significantly (2h 30m - 4h)",
      "Cultural tourism affects seasonal pricing",
      "Weekend flights are 20% more expensive"
    ],
    "CCU-DEL": [
      "Kolkata to Delhi sees moderate traffic",
      "Air India dominates this route",
      "Business travelers prefer direct flights",
      "Leisure travelers accept connections for savings",
      "Monsoon season affects reliability"
    ]
  };

  const routeSpecific = routeInsights[routeKey] || [
    "Multiple airlines serve this route with good connectivity",
    "Prices vary significantly based on departure time",
    "Direct flights available from major carriers",
    "Consider flexible dates for better pricing",
    "Book early for best seat selection"
  ];

  // Date-specific insights
  if (departDate) {
    const departDateObj = new Date(departDate);
    const dayOfWeek = departDateObj.getDay();
    const today = new Date();
    const daysUntilDeparture = Math.ceil((departDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      insights.push("Weekend flights are typically 10-15% more expensive");
    }
    
    if (daysUntilDeparture <= 7) {
      insights.push("Last-minute booking - prices are 30-40% higher than advance booking");
    } else if (daysUntilDeparture <= 14) {
      insights.push("Short notice booking - consider flexible dates for better deals");
    } else if (daysUntilDeparture <= 30) {
      insights.push("Booking within 30 days - prices are moderate");
    } else if (daysUntilDeparture <= 90) {
      insights.push("Advance booking - good prices available");
    } else {
      insights.push("Long-term booking - prices are at their lowest");
    }
  }

  // Class-specific insights
  if (travelClass === 'business') {
    insights.push("Business class options limited - book early for availability");
  } else if (travelClass === 'premium-economy') {
    insights.push("Premium economy available on select airlines only");
  }

  // Passenger-specific insights
  if (passengers?.adults && passengers.adults > 2) {
    insights.push("Group booking - consider booking together for group discounts");
  }
  if (passengers?.children && passengers.children > 0) {
    insights.push("Family travel - check baggage allowances for children");
  }

  // Combine route-specific and data-driven insights
  const allInsights = [...insights, ...routeSpecific];
  
  // Return top 4-5 most relevant insights
  return allInsights.slice(0, 5);
};

// AI-powered flight summary generation with route-specific insights
export const generateFlightSummary = async (flightResults: FlightResult[], searchRequest?: SearchRequest): Promise<FlightSummary> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { from, to, departDate, returnDate, passengers, travelClass, tripType } = searchRequest || {};
  const prices = flightResults.map(f => f.price);
  const cheapestPrice = Math.min(...prices);
  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const priceRange = `${Math.min(...prices).toLocaleString()} - ${Math.max(...prices).toLocaleString()}`;

  // Analyze timing patterns
  const timingAnalysis = flightResults.reduce((acc, flight) => {
    const hour = new Date(flight.departureTime).getHours();
    if (hour >= 6 && hour < 12) acc.morningFlights++;
    else if (hour >= 12 && hour < 18) acc.afternoonFlights++;
    else if (hour >= 18 && hour < 22) acc.eveningFlights++;
    else acc.nightFlights++;
    return acc;
  }, { morningFlights: 0, afternoonFlights: 0, eveningFlights: 0, nightFlights: 0 });

  // Analyze airlines
  const airlineCounts = flightResults.reduce((acc, flight) => {
    acc[flight.airline] = (acc[flight.airline] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonAirline = Object.entries(airlineCounts)
    .sort(([,a], [,b]) => b - a)[0][0];

  const directFlights = flightResults.filter(f => f.stops === 0).length;

  // Generate route-specific insights
  const insights = generateRouteInsights(flightResults, searchRequest);

  return {
    insights,
    priceAnalysis: {
      cheapestPrice,
      averagePrice: Math.round(averagePrice),
      priceRange
    },
    timingAnalysis,
    airlineAnalysis: {
      totalAirlines: Object.keys(airlineCounts).length,
      directFlights,
      mostCommonAirline
    }
  };
};

// Behavioral clustering for filter suggestions with route-specific recommendations
export const getFilterSuggestions = async (userId?: string, searchRequest?: SearchRequest): Promise<FilterSuggestion[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const { from, to, departDate, travelClass, passengers } = searchRequest || {};

  // Route-specific filter recommendations
  const routeKey = `${from?.code}-${to?.code}`;
  const routeFilters: Record<string, FilterSuggestion[]> = {
    "DEL-BOM": [
      { id: "nonstop", label: "Nonstop", category: "stops", value: "0", description: "Direct flights only", usageCount: 1250 },
      { id: "morning", label: "Morning Flights", category: "timing", value: "morning", description: "6 AM - 12 PM", usageCount: 890 },
      { id: "premium-airlines", label: "Premium Airlines", category: "airline", value: "premium", description: "Vistara, Air India", usageCount: 650 }
    ],
    "BOM-DEL": [
      { id: "evening", label: "Evening Flights", category: "timing", value: "evening", description: "6 PM - 10 PM", usageCount: 1100 },
      { id: "budget-airlines", label: "Budget Airlines", category: "airline", value: "budget", description: "SpiceJet, GoAir", usageCount: 950 },
      { id: "baggage-included", label: "Baggage Included", category: "baggage", value: "included", description: "Free checked baggage", usageCount: 2100 }
    ],
    "DEL-BLR": [
      { id: "early-morning", label: "Early Morning", category: "timing", value: "early", description: "Before 9 AM", usageCount: 780 },
      { id: "nonstop", label: "Nonstop", category: "stops", value: "0", description: "Direct flights only", usageCount: 920 },
      { id: "meal-included", label: "Meal Included", category: "meal", value: "included", description: "In-flight meal service", usageCount: 450 }
    ],
    "BLR-DEL": [
      { id: "afternoon", label: "Afternoon Flights", category: "timing", value: "afternoon", description: "12 PM - 6 PM", usageCount: 850 },
      { id: "premium-economy", label: "Premium Economy", category: "class", value: "premium-economy", description: "Extra legroom", usageCount: 340 },
      { id: "full-service", label: "Full-Service Airlines", category: "airline", value: "premium", description: "Air India, Vistara", usageCount: 650 }
    ]
  };

  // Default filters if route not found
  const defaultFilters: FilterSuggestion[] = [
    { id: "nonstop", label: "Nonstop", category: "stops", value: "0", description: "Direct flights only", usageCount: 1250 },
    { id: "morning", label: "Morning Flights", category: "timing", value: "morning", description: "6 AM - 12 PM", usageCount: 890 },
    { id: "baggage-included", label: "Baggage Included", category: "baggage", value: "included", description: "Free checked baggage", usageCount: 2100 }
  ];

  return routeFilters[routeKey] || defaultFilters;
};

// Apply filters to flight results
export const applyFilters = (flights: FlightResult[], filters: FilterSuggestion[]): FlightResult[] => {
  return flights.filter(flight => {
    return filters.every(filter => {
      switch (filter.category) {
        case 'stops':
          return filter.value === '0' ? flight.stops === 0 : true;
        case 'timing':
          const hour = new Date(flight.departureTime).getHours();
          if (filter.value === 'morning') return hour >= 6 && hour < 12;
          if (filter.value === 'afternoon') return hour >= 12 && hour < 18;
          if (filter.value === 'evening') return hour >= 18 && hour < 22;
          if (filter.value === 'early') return hour < 9;
          return true;
        case 'airline':
          if (filter.value === 'premium') {
            return ['Air India', 'Vistara', 'Emirates', 'Qatar Airways', 'Etihad'].includes(flight.airline);
          }
          if (filter.value === 'budget') {
            return ['SpiceJet', 'GoAir', 'AirAsia'].includes(flight.airline);
          }
          return true;
        case 'baggage':
          if (filter.value === 'included') {
            return flight.baggage && parseInt(flight.baggage) >= 20;
          }
          return true;
        case 'meal':
          if (filter.value === 'included') {
            return flight.meal === 'Included';
          }
          return true;
        case 'class':
          if (filter.value === 'premium-economy') {
            return flight.airline === 'Vistara' || flight.airline === 'Air India';
          }
          return true;
        default:
          return true;
      }
    });
  });
}; 

// Traditional Search API function
export const searchTraditionalFlights = async (searchRequest: TraditionalSearchRequest): Promise<TraditionalFlightResult[]> => {
  try {
    const response = await fetch('http://localhost:5566/v1/flights/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    
    // Handle the new API response structure with data and summarize fields
    if (responseData.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    
    // Fallback for direct array response (backward compatibility)
    if (Array.isArray(responseData)) {
      return responseData;
    }
    
    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('Error fetching traditional flight results:', error);
    // Return mock data as fallback
    return generateMockTraditionalResults(searchRequest);
  }
};

// Combined API function that returns both flight data and summary
export const searchTraditionalFlightsWithSummary = async (searchRequest: TraditionalSearchRequest): Promise<{ flights: TraditionalFlightResult[], summary: string[] }> => {
  try {
    const response = await fetch('http://localhost:5566/v1/flights/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    
    // Handle the new API response structure with data and summarize fields
    if (responseData.data && Array.isArray(responseData.data)) {
      return {
        flights: responseData.data,
        summary: responseData.summarize || []
      };
    }
    
    // Fallback for direct array response (backward compatibility)
    if (Array.isArray(responseData)) {
      return {
        flights: responseData,
        summary: []
      };
    }
    
    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('Error fetching traditional flight results:', error);
    // Return mock data as fallback
    const mockFlights = generateMockTraditionalResults(searchRequest);
    return {
      flights: mockFlights,
      summary: [
        `Found ${mockFlights.length} flight options starting from $${Math.min(...mockFlights.map(f => f.totalPrice)).toLocaleString()}`,
        `The cheapest option is with ${mockFlights[0]?.carrier || 'Unknown'} at $${Math.min(...mockFlights.map(f => f.totalPrice)).toLocaleString()}`,
        `${mockFlights.filter(f => f.outboundSegments.stops === 0).length} direct flights available`
      ]
    };
  }
};

// Helper function to convert search request to traditional API format
export const convertSearchRequestToTraditional = (searchRequest: SearchRequest): TraditionalSearchRequest => {
  const departure = searchRequest.from?.code || 'DEL';
  const arrival = searchRequest.to?.code || 'BOM';
  // Convert date format from YYYY-MM-DD to YYYYMMDD
  const startDate = searchRequest.departDate ? 
    searchRequest.departDate.replace(/-/g, '') : 
    new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const endDate = searchRequest.returnDate ? 
    searchRequest.returnDate.replace(/-/g, '') : 
    undefined;

  return {
    departure,
    arrival,
    startDate,
    endDate,
  };
};

// AI Search API interfaces
export interface AISearchRequest {
  message: string;
}

export interface AISearchResponse {
  data: TraditionalFlightResult[];
  summarize: string[];
  extractedParams?: {
    startDate: string;
    endDate?: string;
    tripType: string;
    maxPrice?: number;
    maxStops?: number;
    possibleCities?: Array<{
      departure: string;
      arrival: string;
    }>;
  };
  originalQuery: string;
  possibleCities?: Array<{
    departure: string;
    arrival: string;
  }>;
}

// AI Search API function
export const searchAIFlights = async (searchRequest: AISearchRequest): Promise<AISearchResponse> => {
  try {
    const response = await fetch('http://localhost:5566/v1/flights/ai-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    
    // Handle the AI search response structure
    if (responseData.data && Array.isArray(responseData.data)) {
      return {
        data: responseData.data,
        summarize: responseData.summarize || [],
        extractedParams: responseData.extractedParams,
        originalQuery: responseData.originalQuery,
        possibleCities: responseData.possibleCities
      };
    }
    
    throw new Error('Invalid response format from AI search API');
  } catch (error) {
    console.error('Error fetching AI flight results:', error);
    // Return mock data as fallback
    const mockFlights = generateMockTraditionalResults({
      departure: 'DXB',
      arrival: 'JED',
      startDate: '20250718',
      endDate: '20250808'
    });
    return {
      data: mockFlights,
      summarize: [
        "Found 20 flight options starting from $1,925",
        "The cheapest option is with Etihad Airways at $1,925",
        "7 direct flights available"
      ],
      extractedParams: {
        startDate: '20250718',
        endDate: '20250808',
        tripType: 'roundTrip',
        maxPrice: 400,
        maxStops: 0,
        possibleCities: [
          { departure: 'DXB', arrival: 'JED' },
          { departure: 'BOM', arrival: 'SIN' },
          { departure: 'LHR', arrival: 'CDG' }
        ]
      },
      originalQuery: searchRequest.message,
      possibleCities: [
        { departure: 'DXB', arrival: 'JED' },
        { departure: 'BOM', arrival: 'SIN' },
        { departure: 'LHR', arrival: 'CDG' }
      ]
    };
  }
};


// Mock data generator for traditional results (fallback)
const generateMockTraditionalResults = (searchRequest: TraditionalSearchRequest): TraditionalFlightResult[] => {
  const airlines = [
    { code: 'AF', carrier: 'Air France' },
    { code: 'EK', carrier: 'Emirates' },
    { code: 'QR', carrier: 'Qatar Airways' },
    { code: 'EY', carrier: 'Etihad Airways' },
    { code: 'TK', carrier: 'Turkish Airlines' },
    { code: 'SV', carrier: 'Saudia' },
    { code: 'LX', carrier: 'Swiss International' },
    { code: 'LH', carrier: 'Lufthansa' },
    { code: 'BA', carrier: 'British Airways' },
    { code: 'KL', carrier: 'KLM' },
  ];

  // Generate departure date from startDate
  const departDate = new Date(
    parseInt(searchRequest.startDate.substring(0, 4)),
    parseInt(searchRequest.startDate.substring(4, 6)) - 1,
    parseInt(searchRequest.startDate.substring(6, 8))
  );

  // Generate return date if provided
  const returnDate = searchRequest.endDate ? new Date(
    parseInt(searchRequest.endDate.substring(0, 4)),
    parseInt(searchRequest.endDate.substring(4, 6)) - 1,
    parseInt(searchRequest.endDate.substring(6, 8))
  ) : null;

  return airlines.map((airline, index) => {
    // Generate realistic departure times
    const departHour = 6 + (index * 2) % 18;
    const departTime = new Date(departDate);
    departTime.setHours(departHour, (index * 15) % 60, 0, 0);

    // Generate arrival time (departure + duration)
    const duration = 2.5 + (index * 0.5);
    const arrivalTime = new Date(departTime);
    arrivalTime.setHours(arrivalTime.getHours() + Math.floor(duration), 
                        arrivalTime.getMinutes() + Math.round((duration % 1) * 60));

    // Check if arrival is next day
    const arrivalNextDay = arrivalTime.getDate() !== departTime.getDate();

    return {
      airlineCode: airline.code,
      carrier: airline.carrier,
      outboundSegments: {
        flightDuration: duration,
        legs: [
          {
            arr: arrivalTime.toISOString().slice(0, 16).replace('T', 'T'),
            arrAirport: searchRequest.arrival,
            arrivalNextDay,
            dep: departTime.toISOString().slice(0, 16).replace('T', 'T'),
            depAirport: searchRequest.departure,
            flightNum: `${airline.code}${1000 + index}`,
          }
        ],
        stops: index % 2 === 0 ? 0 : 1,
      },
      inboundSegments: returnDate ? {
        flightDuration: 2.5 + (index * 0.3),
        legs: [
          {
            arr: returnDate.toISOString().slice(0, 16).replace('T', 'T'),
            arrAirport: searchRequest.departure,
            dep: new Date(returnDate.getTime() - (2.5 + index * 0.3) * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', 'T'),
            depAirport: searchRequest.arrival,
            flightNum: `${airline.code}${2000 + index}`,
          }
        ],
        stops: index % 3 === 0 ? 0 : 1
      } : undefined,
      metaScore: 0.6 + (index * 0.05),
      totalPrice: 1500 + (index * 200),
      tripType: searchRequest.endDate ? 'roundTrip' : 'oneWay',
    };
  });
}; 