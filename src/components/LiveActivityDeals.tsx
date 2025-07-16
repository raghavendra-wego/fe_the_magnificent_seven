import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Eye,
  Clock,
  CheckCircle,
  Bell,
  Heart,
  Share2
} from "lucide-react";

interface LiveActivityDealsProps {
  totalFlights: number;
  cheapestPrice: number;
  averagePrice: number;
}

const LiveActivityDeals = ({ totalFlights, cheapestPrice, averagePrice }: LiveActivityDealsProps) => {
  const [viewers, setViewers] = useState(1234);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 3));
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const priceDifference = averagePrice - cheapestPrice;
  const savingsPercentage = ((priceDifference / averagePrice) * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-red-50 to-pink-50 border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Live Activity */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">🔥 Live Activity & Deals</span>
              <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                Live
              </Badge>
            </div>

            {/* Compact Metrics */}
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 text-blue-600" />
                <span className="font-medium">{viewers.toLocaleString()}</span>
                <span className="text-gray-500">viewing</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-orange-600" />
                <span className="font-medium text-red-600">{formatTime(timeLeft)}</span>
                <span className="text-gray-500">left</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="font-medium">47</span>
                <span className="text-gray-500">booked</span>
              </div>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-600">
              <span className="font-medium text-red-700">{Math.round(savingsPercentage)}% below average</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 h-7 px-2 text-xs">
                <Bell className="w-3 h-3 mr-1" />
                Alert
              </Button>
              <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                <Heart className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                <Share2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityDeals; 