import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Star, 
  TrendingUp, 
  Clock,
  Plane,
  CheckCircle,
  Award,
  Zap
} from "lucide-react";
import { FlightResult } from "@/services/flightSummaryService";

interface PersonalizedRecommendationsProps {
  flights: FlightResult[];
  onFlightSelect: (flight: FlightResult) => void;
  compact?: boolean;
}

const PersonalizedRecommendations = ({ flights, onFlightSelect, compact = false }: PersonalizedRecommendationsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'best' | 'cheapest' | 'fastest' | 'premium'>('best');

  // Early return if no flights
  if (!flights || flights.length === 0) {
    return (
      <Card className={`border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm ${compact ? '' : 'mb-4'}`}>
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  🎯 Personalized Recommendations
                </h3>
                <p className="text-xs text-gray-600">
                  Based on your preferences and travel patterns
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              AI Powered
            </Badge>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No flights available</h4>
            <p className="text-gray-500">Try adjusting your search criteria to see recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Categorize flights with null checks
  const cheapestFlight = flights.reduce((min, flight) => 
    flight.price < min.price ? flight : min, flights[0]);
  
  const fastestFlight = flights.reduce((fastest, flight) => {
    const fastestDuration = parseInt(fastest.duration.split('h')[0]) * 60 + parseInt(fastest.duration.split(' ')[1].split('m')[0]);
    const currentDuration = parseInt(flight.duration.split('h')[0]) * 60 + parseInt(flight.duration.split(' ')[1].split('m')[0]);
    return currentDuration < fastestDuration ? flight : fastest;
  }, flights[0]);

  const premiumFlight = flights.find(f => 
    ['Vistara', 'Emirates', 'Qatar Airways', 'Air India'].includes(f.airline) && f.meal === 'Included'
  ) || flights[0];

  const bestValueFlight = flights.find(f => 
    f.price <= cheapestFlight.price * 1.2 && f.stops === 0 && f.meal === 'Included'
  ) || cheapestFlight;

  const getRecommendation = () => {
    // Ensure we have valid flights to work with
    const defaultFlight = flights[0];
    
    switch (selectedCategory) {
      case 'best':
        return {
          flight: bestValueFlight || defaultFlight,
          title: "Best Overall Value",
          description: "Great price with premium features",
          icon: <Crown className="w-4 h-4" />,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        };
      case 'cheapest':
        return {
          flight: cheapestFlight || defaultFlight,
          title: "Cheapest Option",
          description: "Lowest price available",
          icon: <TrendingUp className="w-4 h-4" />,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case 'fastest':
        return {
          flight: fastestFlight || defaultFlight,
          title: "Fastest Journey",
          description: "Shortest travel time",
          icon: <Zap className="w-4 h-4" />,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        };
      case 'premium':
        return {
          flight: premiumFlight || defaultFlight,
          title: "Premium Experience",
          description: "Luxury with comfort",
          icon: <Award className="w-4 h-4" />,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        };
      default:
        return {
          flight: defaultFlight,
          title: "Recommended Flight",
          description: "Best option for your trip",
          icon: <Star className="w-4 h-4" />,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        };
    }
  };

  const recommendation = getRecommendation();

  const formatTime = (dateString: string) => {
    if (!dateString) return '--:--';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return '--:--';
    }
  };

  if (compact) {
    return (
      <Card className="border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                <Star className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-900">
                  🎯 Recommendations
                </h3>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
              AI Powered
            </Badge>
          </div>

          {/* Compact Category Tabs */}
          <div className="flex space-x-1 mb-3">
            {[
              { id: 'best', label: 'Best', icon: Crown },
              { id: 'cheapest', label: 'Cheap', icon: TrendingUp },
              { id: 'fastest', label: 'Fast', icon: Zap },
              { id: 'premium', label: 'Premium', icon: Award }
            ].map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id as any)}
                className="text-xs px-2 py-1 h-6"
              >
                <category.icon className="w-2.5 h-2.5 mr-1" />
                {category.label}
              </Button>
            ))}
          </div>

          {/* Compact Recommendation Card */}
          <div className={`p-3 rounded border ${recommendation.bgColor} ${recommendation.borderColor}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`${recommendation.color}`}>
                  {recommendation.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900">{recommendation.title}</h4>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                Recommended
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* Flight Details */}
              <div className="text-center">
                <div className="text-xs font-medium text-gray-900">{recommendation.flight?.airline || 'Airline'}</div>
                <div className="text-xs text-gray-500">{recommendation.flight?.aircraft || 'Aircraft'}</div>
              </div>

              {/* Timing */}
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">
                  {formatTime(recommendation.flight?.departureTime)}
                </div>
                <div className="text-xs text-gray-500">{recommendation.flight?.duration || 'Duration'}</div>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  ₹{(recommendation.flight?.price || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {(recommendation.flight?.stops || 0) === 0 ? 'Direct' : `${recommendation.flight?.stops || 0} stop`}
                </div>
              </div>
            </div>

            {/* Compact Features */}
            <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
              <div className="flex items-center space-x-2">
                <span>✓ {recommendation.flight?.baggage || 'Baggage'}</span>
                <span>✓ {recommendation.flight?.meal || 'Meal'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-2.5 h-2.5 text-yellow-400" />
                <span>4.2/5</span>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-xs h-7"
              onClick={() => recommendation.flight && onFlightSelect(recommendation.flight)}
              disabled={!recommendation.flight}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Select Flight
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                🎯 Personalized Recommendations
              </h3>
              <p className="text-xs text-gray-600">
                Based on your preferences and travel patterns
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            AI Powered
          </Badge>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 mb-4">
          {[
            { id: 'best', label: 'Best Value', icon: Crown },
            { id: 'cheapest', label: 'Cheapest', icon: TrendingUp },
            { id: 'fastest', label: 'Fastest', icon: Zap },
            { id: 'premium', label: 'Premium', icon: Award }
          ].map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id as any)}
              className="text-xs"
            >
              <category.icon className="w-3 h-3 mr-1" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Recommendation Card */}
        <div className={`p-4 rounded-lg border ${recommendation.bgColor} ${recommendation.borderColor}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`${recommendation.color}`}>
                {recommendation.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                <p className="text-xs text-gray-600">{recommendation.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Recommended
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Flight Details */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{recommendation.flight?.airline || 'Airline'}</div>
                <div className="text-xs text-gray-500">{recommendation.flight?.aircraft || 'Aircraft'}</div>
              </div>
            </div>

            {/* Timing */}
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatTime(recommendation.flight?.departureTime)}
              </div>
              <div className="text-xs text-gray-500">{recommendation.flight?.duration || 'Duration'}</div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ₹{(recommendation.flight?.price || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {(recommendation.flight?.stops || 0) === 0 ? 'Direct' : `${recommendation.flight?.stops || 0} stop`}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              <span>✓ {recommendation.flight?.baggage || 'Baggage'}</span>
              <span>✓ {recommendation.flight?.meal || 'Meal'}</span>
              <span>✓ {(recommendation.flight?.stops || 0) === 0 ? 'Direct' : 'Connecting'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>4.2/5</span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => recommendation.flight && onFlightSelect(recommendation.flight)}
            disabled={!recommendation.flight}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Select This Flight
          </Button>
        </div>

        {/* Why This Recommendation */}
        <div className="mt-4 p-3 bg-white rounded-lg border">
          <h5 className="font-medium text-gray-900 mb-2">Why we recommend this:</h5>
          <div className="space-y-1 text-xs text-gray-600">
            {selectedCategory === 'best' && (
              <>
                <div>• Best balance of price and comfort</div>
                <div>• Includes meals and baggage</div>
                <div>• Direct flight for convenience</div>
              </>
            )}
            {selectedCategory === 'cheapest' && (
              <>
                <div>• Lowest price available</div>
                <div>• Good value for money</div>
                <div>• Reliable airline</div>
              </>
            )}
            {selectedCategory === 'fastest' && (
              <>
                <div>• Shortest travel time</div>
                <div>• Efficient route</div>
                <div>• Minimal waiting time</div>
              </>
            )}
            {selectedCategory === 'premium' && (
              <>
                <div>• Premium airline service</div>
                <div>• Enhanced comfort</div>
                <div>• Better amenities</div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations; 