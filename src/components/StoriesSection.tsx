import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const StoriesSection = () => {
  const stories = [
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
      title: "Discover Amazing Destinations",
      category: "Travel Guide"
    },
    {
      image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=400&h=200&fit=crop",
      title: "Best Hotel Deals This Season",
      category: "Hotels"
    },
    {
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop",
      title: "Flight Tips for Budget Travelers",
      category: "Flights"
    },
    {
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop",
      title: "Hidden Gems Around the World",
      category: "Destinations"
    }
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-wego-text-dark">Stories</h2>
          <Button
            variant="ghost"
            className="text-wego-green hover:text-wego-green/80 hover:bg-wego-green-bg"
          >
            See all stories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-wego-green text-xs font-medium px-2 py-1 rounded-full">
                    {story.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-wego-text-dark text-sm leading-relaxed">
                  {story.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesSection;