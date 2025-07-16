# Smart Flight Summarizer & Personalized Filter Assistant

A modern, AI-powered flight booking platform that enhances user engagement through intelligent flight summaries, personalized filter suggestions, and advanced engagement features.

## 🚀 Features

### AI-Powered Flight Intelligence
- **Smart Flight Summaries**: AI-generated comprehensive flight analysis including price trends, timing insights, airline dominance, and route-specific recommendations
- **Personalized Filter Suggestions**: Dynamic filter recommendations based on user behavior clustering and search patterns
- **Real-time Data Generation**: Dynamic flight data generation based on actual search parameters for realistic insights

### Enhanced User Engagement
- **Quick Actions Banner**: Price alerts, social sharing, and save functionality
- **Social Proof Banner**: Live activity indicators and urgency triggers
- **Personalized Recommendations**: Best value, cheapest, fastest, and premium flight suggestions
- **Booking Progress Tracker**: Visual progress tracking with confidence scoring
- **Exit Intent Modal**: Smart retention with localStorage-based dismissal tracking

### Modern UI/UX
- **Responsive Design**: Optimized for all devices with mobile-first approach
- **Interactive Components**: Smooth animations and intuitive user interactions
- **Smart Layout**: Fixed sidebar with compact components to maximize results visibility
- **Loading States**: Elegant loading indicators and error handling

### Flight Search & Booking
- **Advanced Search**: Multi-city support with flexible date selection
- **Real-time Results**: Dynamic flight results with AI-powered insights
- **Smart Navigation**: Seamless flow from search to booking with breadcrumb navigation
- **Data-driven Insights**: Comprehensive analysis of flight options with actionable recommendations

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **AI Integration**: Custom flight summary service with dynamic data generation
- **Package Manager**: npm/bun

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── FlightSearch.tsx
│   ├── Header.tsx
│   ├── SmartSummaryBanner.tsx
│   ├── PersonalizedFilterSuggestions.tsx
│   ├── QuickActionsBanner.tsx
│   ├── SocialProofBanner.tsx
│   ├── PersonalizedRecommendations.tsx
│   ├── BookingProgressTracker.tsx
│   └── ExitIntentModal.tsx
├── pages/             # Application pages
│   ├── Index.tsx      # Homepage
│   ├── FlightBooking.tsx
│   ├── FlightResults.tsx
│   └── AIFlightResults.tsx
├── services/          # Business logic and API services
│   └── flightSummaryService.ts
├── hooks/             # Custom React hooks
└── lib/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/raghavendra-wego/fe_the_magnificent_seven.git

# Navigate to the project directory
cd fe_the_magnificent_seven

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

## 🎯 Key Features in Detail

### AI Flight Summarizer
- Generates comprehensive flight analysis based on search parameters
- Provides price variation insights, timing trends, and airline dominance analysis
- Offers route-specific seasonal and traveler-type recommendations
- Includes passenger-specific booking context and recommendations

### Personalized Filter Assistant
- Dynamic filter suggestions based on user search patterns
- Clustering-based recommendations for optimal flight selection
- Real-time adaptation to user preferences and behavior

### Engagement Optimization
- **Psychological Triggers**: Implements FOMO, social proof, scarcity, and authority principles
- **Smart Retention**: Exit intent detection with personalized incentives
- **Progress Tracking**: Visual booking progress with confidence indicators
- **Social Features**: Share functionality and live activity indicators

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 🚀 Deployment


### Custom Domain
To connect a custom domain, navigate to Project > Settings > Domains and click Connect Domain.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.
