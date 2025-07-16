import { Car, Smartphone, Hotel, Plane, Search, CreditCard, Headphones } from "lucide-react";
import { Button } from "./ui/button";

const FeatureCards = () => {
  const promoCards = [
    {
      title: "Car Rentals powered by Wego",
      description: "Embark on your adventures with our car rental service.",
      buttonText: "Book now",
      icon: Car,
      bgColor: "bg-gradient-to-br from-green-100 to-green-50",
      illustration: "🚗"
    },
    {
      title: "eSIMs powered by Wego",
      description: "Unlock Instant Connectivity with Our eSIM Solutions",
      buttonText: "Buy now",
      icon: Smartphone,
      bgColor: "bg-gradient-to-br from-green-100 to-green-50",
      illustration: "📱"
    },
    {
      title: "10% Off On Hotels in Azerbaijan!",
      description: "The right deal makes every destination feel even better.",
      buttonText: "Book now",
      icon: Hotel,
      bgColor: "bg-gradient-to-br from-green-100 to-green-50",
      illustration: "🏨",
      promoCode: "Use code: WEGOAZERBIJAN10"
    }
  ];

  const featureCards = [
    {
      title: "Best Travel Deals in The United Arab Emirates",
      icon: Plane,
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100"
    },
    {
      title: "Thousands of Flights & Hotel Deals",
      icon: Search,
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100"
    },
    {
      title: "Multiple Payment Methods",
      icon: CreditCard,
      bgColor: "bg-green-50",
      iconBg: "bg-green-100"
    },
    {
      title: "24/7 Customer Service Support",
      icon: Headphones,
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100"
    }
  ];

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-wego-text-dark">
          Discover The Real Value of Travel
        </h2>

        {/* Promotional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {promoCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-2xl p-6 relative overflow-hidden`}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-wego-green mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-wego-text-light mb-4">
                  {card.description}
                </p>
                {card.promoCode && (
                  <p className="text-xs text-wego-text-light mb-4 font-medium">
                    {card.promoCode}
                  </p>
                )}
                <Button
                  size="sm"
                  className="bg-wego-green hover:bg-wego-green/90 text-white rounded-lg"
                >
                  {card.buttonText}
                </Button>
              </div>
              <div className="absolute right-4 top-4 text-4xl opacity-50">
                {card.illustration}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featureCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-2xl p-6 text-center`}
            >
              <div className={`${card.iconBg} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                <card.icon className="h-8 w-8 text-wego-green" />
              </div>
              <h3 className="font-semibold text-wego-text-dark text-sm">
                {card.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;