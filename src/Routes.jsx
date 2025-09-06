import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MainDashboard from './pages/main-dashboard';
import AdvancedChart from './pages/advanced-chart';
import SocialTradingFeed from './pages/social-trading-feed';
import AlertsManagement from './pages/alerts-management';
import MarketScanner from './pages/market-scanner';
import AIMarketAssistant from './pages/ai-market-assistant';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<AdvancedChart />} />
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/advanced-chart" element={<AdvancedChart />} />
        <Route path="/social-trading-feed" element={<SocialTradingFeed />} />
        <Route path="/alerts-management" element={<AlertsManagement />} />
        <Route path="/market-scanner" element={<MarketScanner />} />
        <Route path="/ai-market-assistant" element={<AIMarketAssistant />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;