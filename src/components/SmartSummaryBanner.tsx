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
  Zap
} from "lucide-react";
import { FlightSummary, generateFlightSummary, FlightResult, SearchRequest } from "@/services/flightSummaryService";

interface SmartSummaryBannerProps {
  flightResults: FlightResult[];
  onInsightClick?: (insight: string) => void;
  searchRequest?: SearchRequest;
}

const SmartSummaryBanner = ({ flightResults, onInsightClick, searchRequest }: SmartSummaryBannerProps) => {
  const [summary, setSummary] = useState<FlightSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSummary();
  }, [flightResults, searchRequest]);

  const loadSummary = async () => {
    setIsLoading(true);
    try {
      const result = await generateFlightSummary(flightResults, searchRequest);
      setSummary(result);
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
      <Card className="mb-6 border-green-100 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <Card className="mb-6 border-green-100 bg-gradient-to-r from-green-50 to-blue-50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                💡 Insights from Your Search
              </h3>
              <p className="text-sm text-gray-600">
                AI-powered analysis of {flightResults.length} flights
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-green-600 hover:text-green-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insights */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2 text-green-600" />
              Key Insights
            </h4>
            <div className="space-y-3">
              {summary.insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-green-100 hover:border-green-200 transition-colors cursor-pointer"
                  onClick={() => onInsightClick?.(insight)}
                >
                  <div className="text-green-600 mt-0.5">
                    {getInsightIcon(insight)}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-600" />
              Quick Stats
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  ₹{summary.priceAnalysis.cheapestPrice.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Lowest Price</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.airlineAnalysis.directFlights}
                </div>
                <div className="text-xs text-gray-500">Direct Flights</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {summary.timingAnalysis.morningFlights}
                </div>
                <div className="text-xs text-gray-500">Morning Options</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  {summary.airlineAnalysis.totalAirlines}
                </div>
                <div className="text-xs text-gray-500">Airlines</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Price Range:</span>
                <span className="font-medium text-gray-900">
                  ₹{summary.priceAnalysis.priceRange}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Average Price:</span>
                <span className="font-medium text-gray-900">
                  ₹{summary.priceAnalysis.averagePrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-green-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Based on {flightResults.length} flight options</span>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              AI Powered
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Real-time
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartSummaryBanner; 