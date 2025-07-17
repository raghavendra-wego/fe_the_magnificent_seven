import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, 
  TrendingDown, 
  Clock, 
  Plane, 
  Users,
  RefreshCw,
  Lightbulb,
  Target,
  Zap,
  ChevronRight
} from "lucide-react";
import { FlightSummary, generateFlightSummary, FlightResult, SearchRequest } from "@/services/flightSummaryService";

interface SmartSummaryBannerProps {
  flightResults: FlightResult[];
  onInsightClick?: (insight: string) => void;
  searchRequest?: SearchRequest;
  apiSummarize?: string[]; // New prop for API summary data
}

const SmartSummaryBanner = ({ flightResults, onInsightClick, searchRequest, apiSummarize }: SmartSummaryBannerProps) => {
  const [summary, setSummary] = useState<FlightSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded

  useEffect(() => {
    loadSummary();
  }, [flightResults, searchRequest, apiSummarize]);

 

  const loadSummary = async () => {
    setIsLoading(true);
    try {
      // If API summarize data is available, use it; otherwise generate locally
      if (apiSummarize && apiSummarize.length > 0) {
        // Create a summary object using API data
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
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';

        const directFlights = flightResults.filter(f => f.stops === 0).length;

        const result: FlightSummary = {
          insights: apiSummarize, // Use API summarize data as insights
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
        setSummary(result);
      } else {
        // Fallback to local generation
        const result = await generateFlightSummary(flightResults, searchRequest);
        setSummary(result);
      }
      setIsExpanded(true); // Reset to expanded when new data loads
    } catch (error) {
      console.error("Failed to generate summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSummary();
    setIsRefreshing(false);
  };

  const getInsightIcon = (insight: string) => {
    if (insight.toLowerCase().includes("budget") || insight.toLowerCase().includes("cheaper")) {
      return <TrendingDown className="w-4 h-4" />;
    }
    if (insight.toLowerCase().includes("time") || insight.toLowerCase().includes("depart")) {
      return <Clock className="w-4 h-4" />;
    }
    if (insight.toLowerCase().includes("airline") || insight.toLowerCase().includes("indigo")) {
      return <Plane className="w-4 h-4" />;
    }
    return <Lightbulb className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Card className="border-green-100 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <Card className="border-green-100 bg-gradient-to-r from-green-50 to-blue-50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                💡 Insights
              </h3>
              <p className="text-xs text-gray-600">
                {flightResults.length} flights analyzed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-green-600 hover:text-green-700 p-1 h-6 w-6"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-700 p-1 h-6 w-6"
            >
              <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Collapsible Content */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-4">
            {/* Insights */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center text-sm">
                <Target className="w-3 h-3 mr-1 text-green-600" />
                Key Insights  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              {apiSummarize && apiSummarize.length > 0 ? 'API Powered' : 'AI Powered'}
              </Badge>
             
              </h4>
              <div className="space-y-2">
                {summary.insights.slice(0, 3).map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-2 bg-white rounded border border-green-100 hover:border-green-200 transition-colors cursor-pointer"
                    onClick={() => onInsightClick?.(insight)}
                  >
                    <div className="text-green-600 mt-0.5">
                      {getInsightIcon(insight)}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center text-sm">
                <Zap className="w-3 h-3 mr-1 text-blue-600" />
                Quick Stats  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
              Real-time
              </Badge>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border">
                  <div className="text-lg font-bold text-green-600">
                    ${summary.priceAnalysis.cheapestPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Lowest</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-lg font-bold text-blue-600">
                    {summary.airlineAnalysis.directFlights}
                  </div>
                  <div className="text-xs text-gray-500">Direct</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-lg font-bold text-purple-600">
                    {summary.timingAnalysis.morningFlights}
                  </div>
                  <div className="text-xs text-gray-500">Morning</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-lg font-bold text-orange-600">
                    {summary.airlineAnalysis.totalAirlines}
                  </div>
                  <div className="text-xs text-gray-500">Airlines</div>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-white rounded border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Price Range:</span>
                  <span className="font-medium text-gray-900">
                    ${summary.priceAnalysis.priceRange}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-600">Average:</span>
                  <span className="font-medium text-gray-900">
                    ${summary.priceAnalysis.averagePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-green-100">
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Users className="w-3 h-3" />
              <span>{flightResults.length} options</span>
            </div>
            <div className="flex space-x-1">
             
            </div>
          </div>
        </div>

        {/* Collapsed State Indicator */}
        {!isExpanded && (
          <div className="text-center py-1">
            <p className="text-xs text-gray-500">
              Click to expand insights
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSummaryBanner; 