import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Shield, 
  Star,
  TrendingUp,
  Users,
  Award,
  Zap
} from "lucide-react";

interface BookingProgressTrackerProps {
  totalFlights: number;
  cheapestPrice: number;
  averagePrice: number;
  compact?: boolean;
}

const BookingProgressTracker = ({ totalFlights, cheapestPrice, averagePrice, compact = false }: BookingProgressTrackerProps) => {
  const [progress, setProgress] = useState(0);
  const [confidence, setConfidence] = useState(85);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    // Simulate progress as user interacts
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
      setProgress(prev => Math.min(100, prev + 0.5));
      setConfidence(prev => Math.min(95, prev + 0.1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const priceDifference = averagePrice - cheapestPrice;
  const savingsPercentage = ((priceDifference / averagePrice) * 100);

  const getConfidenceColor = (level: number) => {
    if (level >= 90) return "text-green-600";
    if (level >= 80) return "text-blue-600";
    if (level >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceMessage = (level: number) => {
    if (level >= 90) return "Excellent choice!";
    if (level >= 80) return "Great value!";
    if (level >= 70) return "Good option";
    return "Consider alternatives";
  };

  if (compact) {
    return (
      <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-900">
                  📊 Progress
                </h3>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
              {Math.round(progress)}%
            </Badge>
          </div>

          {/* Compact Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Search Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Confidence Score */}
            <div className="bg-white p-2 rounded border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium">Confidence</span>
                </div>
                <div className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>
                  {Math.round(confidence)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-green-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
            </div>

            {/* Price Confidence */}
            <div className="bg-white p-2 rounded border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Award className="w-3 h-3 text-orange-600" />
                  <span className="text-xs font-medium">Savings</span>
                </div>
                <div className="text-sm font-bold text-green-600">
                  {Math.round(savingsPercentage)}%
                </div>
              </div>
              <div className="text-xs text-green-600">
                ✓ Great value
              </div>
            </div>
          </div>

          {/* Compact Success Indicators */}
          <div className="p-2 bg-green-50 rounded border border-green-200">
            <div className="flex items-center space-x-1 mb-1">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-700">Why you're on track:</span>
            </div>
            <div className="space-y-0.5 text-xs text-green-700">
              <div>• {totalFlights} options found</div>
              <div>• {Math.round(savingsPercentage)}% below average</div>
              <div>• Multiple airlines available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                📊 Your Booking Journey
              </h3>
              <p className="text-xs text-gray-600">
                Track your progress and build confidence
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {Math.round(progress)}% Complete
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Search Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Confidence Score */}
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Confidence Score</span>
              </div>
              <div className={`text-lg font-bold ${getConfidenceColor(confidence)}`}>
                {Math.round(confidence)}%
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {getConfidenceMessage(confidence)}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>

          {/* Time Investment */}
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Time Spent</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              Average: 3-5 minutes
            </p>
            <div className="text-xs text-green-600">
              ✓ Good research time
            </div>
          </div>

          {/* Price Confidence */}
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">Price Confidence</span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {Math.round(savingsPercentage)}%
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              Below average price
            </p>
            <div className="text-xs text-green-600">
              ✓ Great value found
            </div>
          </div>
        </div>

        {/* Success Indicators */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Why you're on the right track:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-green-700">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Found {totalFlights} options to compare</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Prices {Math.round(savingsPercentage)}% below average</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Multiple airlines available</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Flexible timing options</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Next steps to complete your booking:</span>
          </div>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Review flight details and amenities</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Compare with 2-3 alternatives</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Check cancellation policies</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Complete booking and payment</span>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>⭐ 98% of users complete booking</span>
            <span>•</span>
            <span>🔒 Secure payment guaranteed</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>2,456 bookings today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingProgressTracker; 