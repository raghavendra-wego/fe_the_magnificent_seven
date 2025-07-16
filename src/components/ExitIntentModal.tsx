import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Gift, 
  Clock, 
  Star,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Zap
} from "lucide-react";

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStay: () => void;
  onLeave?: () => void;
  cheapestPrice: number;
  averagePrice: number;
}

const ExitIntentModal = ({ isOpen, onClose, onStay, onLeave, cheapestPrice, averagePrice }: ExitIntentModalProps) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const priceDifference = averagePrice - cheapestPrice;
  const savingsPercentage = ((priceDifference / averagePrice) * 100);

  const handleStay = () => {
    onStay();
    onClose();
  };

  const handleClose = () => {
    if (onLeave) {
      onLeave();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Wait! Don't miss these amazing deals</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Urgency Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  Limited Time Offer
                </span>
              </div>
              <div className="text-lg font-bold text-red-600">
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                Save ₹{Math.round(priceDifference / 1000)}k
              </div>
              <div className="text-sm text-green-700">
                That's {Math.round(savingsPercentage)}% off average prices!
              </div>
            </div>
          </div>

          {/* Incentives */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Stay and get:</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                <Gift className="w-4 h-4 text-yellow-600" />
                <div>
                  <div className="text-sm font-medium">Free Cancellation</div>
                  <div className="text-xs text-gray-600">Cancel up to 24h before flight</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <Star className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium">Priority Support</div>
                  <div className="text-xs text-gray-600">24/7 customer service</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium">Price Drop Protection</div>
                  <div className="text-xs text-gray-600">Get refund if price drops</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>⭐ 4.8/5 from 12,456 reviews</span>
              <span>🔒 Secure booking guaranteed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleClose}
              variant="outline" 
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Leave Anyway
            </Button>
            <Button 
              onClick={handleStay}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Stay & Book Now
            </Button>
          </div>

          {/* Final Incentive */}
          <div className="text-center">
            <div className="text-xs text-gray-500">
              <Zap className="w-3 h-3 inline mr-1" />
              <span>98% of users who stay complete their booking</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal; 