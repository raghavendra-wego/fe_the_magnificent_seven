import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Star,
  Eye,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface SocialProofBannerProps {
  totalFlights: number;
  cheapestPrice: number;
  averagePrice: number;
}

const SocialProofBanner = ({ totalFlights, cheapestPrice, averagePrice }: SocialProofBannerProps) => {
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
    <Card className="mb-4 border-red-100 bg-gradient-to-r from-red-50 to-pink-50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                🔥 Live Activity & Deals
              </h3>
              <p className="text-xs text-gray-600">
                Real-time updates from other travelers
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Viewers */}
          <div className="bg-white p-3 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Active Viewers</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{viewers.toLocaleString()}</div>
            <p className="text-xs text-gray-500">people viewing this route</p>
          </div>

          {/* Time Limited */}
          <div className="bg-white p-3 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">Limited Time</span>
              </div>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
            <p className="text-xs text-gray-500">left for best prices</p>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white p-3 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Recent Bookings</span>
              </div>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">47</div>
            <p className="text-xs text-gray-500">booked in last hour</p>
          </div>
        </div>

        {/* Urgency Message */}
        <div className="mt-4 p-3 bg-red-100 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <div className="text-sm">
              <span className="font-medium text-red-700">Price Alert:</span>
              <span className="text-gray-700 ml-1">
                Prices are {Math.round(savingsPercentage)}% below average. 
                {timeLeft > 900 ? " Book now to secure these rates!" : " Last chance for these prices!"}
              </span>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>⭐ 4.8/5 from 12,456 reviews</span>
            <span>•</span>
            <span>🔒 Secure booking guaranteed</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>98% customer satisfaction</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialProofBanner; 