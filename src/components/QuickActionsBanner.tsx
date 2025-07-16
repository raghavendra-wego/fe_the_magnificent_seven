import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Bell, 
  Share2, 
  Heart, 
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Users,
  Zap
} from "lucide-react";

interface QuickActionsBannerProps {
  cheapestPrice: number;
  averagePrice: number;
  totalFlights: number;
  onPriceAlert?: () => void;
  onShareResults?: () => void;
  onSaveSearch?: () => void;
  compact?: boolean;
}

const QuickActionsBanner = ({ 
  cheapestPrice, 
  averagePrice, 
  totalFlights,
  onPriceAlert,
  onShareResults,
  onSaveSearch,
  compact = false
}: QuickActionsBannerProps) => {
  const [isAlertSet, setIsAlertSet] = useState(false);
  const [isSearchSaved, setIsSearchSaved] = useState(false);

  const priceDifference = averagePrice - cheapestPrice;
  const savingsPercentage = ((priceDifference / averagePrice) * 100);

  const handlePriceAlert = () => {
    setIsAlertSet(true);
    onPriceAlert?.();
  };

  const handleSaveSearch = () => {
    setIsSearchSaved(true);
    onSaveSearch?.();
  };

  if (compact) {
    return (
      <Card className="border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
              {totalFlights} flights
            </Badge>
          </div>

          <div className="space-y-2">
            {/* Price Alert */}
            <div className="bg-white p-2 rounded border border-orange-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Bell className="w-3 h-3 text-orange-600" />
                  <span className="text-xs font-medium">Price Alert</span>
                </div>
                {isAlertSet && <CheckCircle className="w-3 h-3 text-green-600" />}
              </div>
              <Button
                size="sm"
                variant={isAlertSet ? "outline" : "default"}
                onClick={handlePriceAlert}
                disabled={isAlertSet}
                className="w-full text-xs h-6"
              >
                {isAlertSet ? "Alert Set" : "Set Alert"}
              </Button>
            </div>

            {/* Share Results */}
            <div className="bg-white p-2 rounded border border-orange-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Share2 className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium">Share</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onShareResults}
                className="w-full text-xs h-6"
              >
                Share Results
              </Button>
            </div>

            {/* Save Search */}
            <div className="bg-white p-2 rounded border border-orange-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-600" />
                  <span className="text-xs font-medium">Save</span>
                </div>
                {isSearchSaved && <CheckCircle className="w-3 h-3 text-green-600" />}
              </div>
              <Button
                size="sm"
                variant={isSearchSaved ? "outline" : "default"}
                onClick={handleSaveSearch}
                disabled={isSearchSaved}
                className="w-full text-xs h-6"
              >
                {isSearchSaved ? "Saved" : "Save Search"}
              </Button>
            </div>
          </div>

          {/* Price Insights */}
          <div className="mt-2 pt-2 border-t border-orange-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-gray-700">
                  Save ₹{Math.round(priceDifference / 1000)}k ({Math.round(savingsPercentage)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                ⚡ Quick Actions to Save Money
              </h3>
              <p className="text-xs text-gray-600">
                Don't miss out on the best deals
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {totalFlights} flights
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Price Alert */}
          <div className="bg-white p-3 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">Price Alert</span>
              </div>
              {isAlertSet && <CheckCircle className="w-4 h-4 text-green-600" />}
            </div>
            <p className="text-xs text-gray-600 mb-2">
              Get notified when prices drop
            </p>
            <Button
              size="sm"
              variant={isAlertSet ? "outline" : "default"}
              onClick={handlePriceAlert}
              disabled={isAlertSet}
              className="w-full text-xs"
            >
              {isAlertSet ? "Alert Set" : "Set Alert"}
            </Button>
          </div>

          {/* Share Results */}
          <div className="bg-white p-3 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Share Results</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              Share with travel companions
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={onShareResults}
              className="w-full text-xs"
            >
              Share
            </Button>
          </div>

          {/* Save Search */}
          <div className="bg-white p-3 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium">Save Search</span>
              </div>
              {isSearchSaved && <CheckCircle className="w-4 h-4 text-green-600" />}
            </div>
            <p className="text-xs text-gray-600 mb-2">
              Save for later comparison
            </p>
            <Button
              size="sm"
              variant={isSearchSaved ? "outline" : "default"}
              onClick={handleSaveSearch}
              disabled={isSearchSaved}
              className="w-full text-xs"
            >
              {isSearchSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* Price Insights */}
        <div className="mt-4 pt-3 border-t border-orange-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">
                Save up to ₹{Math.round(priceDifference / 1000)}k ({Math.round(savingsPercentage)}% off average)
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Users className="w-3 h-3" />
              <span>1,234 people viewing</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsBanner; 