
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plane, 
  Clock, 
  DollarSign, 
  Star, 
  Send, 
  Sparkles,
  MessageCircle
} from "lucide-react";

interface FlightOption {
  id: string;
  airline: string;
  price: number;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  aircraft: string;
  logo: string;
}

interface AIInsight {
  cheapestFare: {
    airline: string;
    price: number;
    reasoning: string;
  };
  bestForYou: {
    airline: string;
    price: number;
    reasoning: string;
  };
  summary: string;
}

interface ConversationMessage {
  id: string;
  question: string;
  timestamp: Date;
  aiResponse?: AIInsight;
}

const AIFlightResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock flight data
  const flightOptions: FlightOption[] = [
    {
      id: "1",
      airline: "Emirates",
      price: 2365,
      departure: "22:00 DXB",
      arrival: "00:50+1 CAI",
      duration: "3h 50m",
      stops: 0,
      aircraft: "Boeing 777",
      logo: "EK"
    },
    {
      id: "2",
      airline: "flynas",
      price: 1691,
      departure: "11:25 DXB",
      arrival: "19:20 CAI",
      duration: "8h 55m",
      stops: 1,
      aircraft: "Airbus A320",
      logo: "XY"
    },
    {
      id: "3",
      airline: "EgyptAir",
      price: 1691,
      departure: "23:30 CAI",
      arrival: "03:55+1 DXB",
      duration: "3h 25m",
      stops: 0,
      aircraft: "Boeing 737",
      logo: "MS"
    }
  ];

  // Initial AI insight
  useEffect(() => {
    const initialInsight: AIInsight = {
      cheapestFare: {
        airline: "flynas",
        price: 1691,
        reasoning: "Great value with competitive pricing and reliable service via Riyadh"
      },
      bestForYou: {
        airline: "Emirates",
        price: 2365,
        reasoning: "Premium experience with direct flights, excellent service, and superior comfort"
      },
      summary: "Found excellent options for Dubai to Cairo! flynas offers the best value at ₽1,691 with a short Riyadh stopover, while Emirates provides premium direct flights at ₽2,365. Current prices are 15% below average for this route."
    };
    setCurrentInsight(initialInsight);
  }, []);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    setIsLoading(true);
    
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      question: currentQuestion,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, newMessage]);
    setCurrentQuestion("");

    // Simulate AI processing
    setTimeout(() => {
      const mockResponse: AIInsight = {
        cheapestFare: {
          airline: "flynas",
          price: 1691,
          reasoning: "Still the most economical choice with your additional requirements"
        },
        bestForYou: {
          airline: "Emirates",
          price: 2365,
          reasoning: "Best matches your refined preferences for comfort and timing"
        },
        summary: `Based on your question "${newMessage.question}", Emirates remains ideal for premium experience, while flynas offers excellent value. Prices are stable and booking soon is recommended.`
      };

      setCurrentInsight(mockResponse);
      setConversation(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, aiResponse: mockResponse }
            : msg
        )
      );
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleQuestionSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">AI Flight Search Results</h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">Dubai (DXB) → Cairo (CAI) • July 16 - Aug 8, 2025</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search Summary Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span>Here's what we found</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            ) : currentInsight ? (
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">{currentInsight.summary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cheapest Fare */}
                  <div className="border-l-4 border-green-500 bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <h3 className="font-semibold text-green-700">Cheapest fare</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-lg">₽{currentInsight.cheapestFare.price}</p>
                      <p className="font-medium text-gray-900">{currentInsight.cheapestFare.airline}</p>
                      <p className="text-sm text-gray-600">{currentInsight.cheapestFare.reasoning}</p>
                    </div>
                  </div>

                  {/* Best For You */}
                  <div className="border-l-4 border-blue-500 bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-blue-700">Best for you</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-lg">₽{currentInsight.bestForYou.price}</p>
                      <p className="font-medium text-gray-900">{currentInsight.bestForYou.airline}</p>
                      <p className="text-sm text-gray-600">{currentInsight.bestForYou.reasoning}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Flight Options */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Top Flight Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flightOptions.map((flight) => (
                <div key={flight.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">{flight.logo}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
                        <p className="text-sm text-gray-600">{flight.aircraft}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="font-semibold">{flight.departure}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{flight.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-px bg-gray-300"></div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
                        </Badge>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-semibold">{flight.arrival}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₽{flight.price}</p>
                        <Button size="sm" className="mt-2">
                          View Deal
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        {conversation.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Previous Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversation.map((message) => (
                  <div key={message.id} className="border-l-2 border-gray-200 pl-4">
                    <p className="font-medium text-gray-900">"{message.question}"</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sticky Ask Again Input */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form onSubmit={handleQuestionSubmit} className="flex space-x-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask another question (e.g., 'Can I add a stopover?')"
                className="w-full"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">Press Ctrl/⌘ + Enter to send</p>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !currentQuestion.trim()}
              className="px-6"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIFlightResults;
