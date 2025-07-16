import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  TrendingUp, 
  Sparkles,
  Filter,
  Clock,
  Plane,
  Package,
  Utensils,
  Crown,
  Zap
} from "lucide-react";
import { FilterSuggestion, getFilterSuggestions, SearchRequest } from "@/services/flightSummaryService";

interface PersonalizedFilterSuggestionsProps {
  userId?: string;
  onFilterSelect?: (filter: FilterSuggestion) => void;
  selectedFilters?: FilterSuggestion[];
  searchRequest?: SearchRequest;
  compact?: boolean;
}

const PersonalizedFilterSuggestions = ({ 
  userId, 
  onFilterSelect, 
  selectedFilters = [],
  searchRequest,
  compact = false
}: PersonalizedFilterSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<FilterSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCluster, setUserCluster] = useState<string>("");

  useEffect(() => {
    loadSuggestions();
  }, [userId, searchRequest]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const result = await getFilterSuggestions(userId, searchRequest);
      setSuggestions(result);
      
      // Determine user cluster based on suggestions
      if (result.some(f => f.id === "nonstop") && result.some(f => f.id === "morning")) {
        setUserCluster("budget-traveler");
      } else if (result.some(f => f.id === "full-service") && result.some(f => f.id === "meal-included")) {
        setUserCluster("premium-traveler");
      } else if (result.some(f => f.id === "early-morning") && result.some(f => f.id === "premium-economy")) {
        setUserCluster("business-traveler");
      }
    } catch (error) {
      console.error("Failed to load filter suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilterIcon = (category: string) => {
    switch (category) {
      case 'timing':
        return <Clock className="w-4 h-4" />;
      case 'airline':
        return <Plane className="w-4 h-4" />;
      case 'stops':
        return <TrendingUp className="w-4 h-4" />;
      case 'baggage':
        return <Package className="w-4 h-4" />;
      case 'meal':
        return <Utensils className="w-4 h-4" />;
      case 'class':
        return <Crown className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  const getClusterInfo = (cluster: string) => {
    switch (cluster) {
      case "budget-traveler":
        return {
          name: "Budget Traveler",
          description: "You prefer value for money",
          icon: <TrendingUp className="w-4 h-4" />,
          color: "text-green-600"
        };
      case "premium-traveler":
        return {
          name: "Premium Traveler", 
          description: "You prefer comfort and service",
          icon: <Crown className="w-4 h-4" />,
          color: "text-purple-600"
        };
      case "business-traveler":
        return {
          name: "Business Traveler",
          description: "You prefer efficiency and reliability", 
          icon: <Zap className="w-4 h-4" />,
          color: "text-blue-600"
        };
      default:
        return {
          name: "Smart Traveler",
          description: "Based on similar travelers",
          icon: <Users className="w-4 h-4" />,
          color: "text-gray-600"
        };
    }
  };

  const isFilterSelected = (filter: FilterSuggestion) => {
    return selectedFilters.some(f => f.id === filter.id);
  };

  if (isLoading) {
    return (
      <Card className={`border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 ${compact ? '' : 'mb-4'}`}>
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="flex items-center space-x-3 mb-3">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  const clusterInfo = getClusterInfo(userCluster);

  if (compact) {
    return (
      <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-900">
                  🔍 Smart Filters
                </h3>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
              AI
            </Badge>
          </div>

          <div className="mb-2">
            <p className="text-xs text-gray-600 flex items-center">
              {clusterInfo.icon}
              <span className={`ml-1 ${clusterInfo.color}`}>
                {clusterInfo.name}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-1">
            {suggestions.slice(0, 6).map((filter) => (
              <Button
                key={filter.id}
                variant={isFilterSelected(filter) ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterSelect?.(filter)}
                className={`
                  rounded-full px-2 py-1 h-6 text-xs font-medium transition-all duration-200
                  ${isFilterSelected(filter) 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
                  }
                `}
              >
                <span>{filter.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                🔍 Filters Used by Users Like You
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 text-xs">
                  AI Powered
                </Badge>
              </h3>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                {clusterInfo.icon}
                <span className={`ml-1 ${clusterInfo.color}`}>
                  {clusterInfo.name} • {clusterInfo.description}
                </span>
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {suggestions.length} suggestions
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((filter) => (
            <Button
              key={filter.id}
              variant={isFilterSelected(filter) ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterSelect?.(filter)}
              className={`
                rounded-full px-3 py-1 h-8 text-xs font-medium transition-all duration-200
                ${isFilterSelected(filter) 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
                }
              `}
            >
              <div className="flex items-center space-x-1">
                <span className="text-blue-600">
                  {getFilterIcon(filter.category)}
                </span>
                <span>{filter.label}</span>
                {filter.usageCount > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-600 text-xs px-1 py-0">
                    {filter.usageCount.toLocaleString()}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-blue-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Based on behavioral patterns of similar travelers</span>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Smart Matching</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedFilterSuggestions; 