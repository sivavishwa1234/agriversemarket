import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import MyCrops from "./pages/farmer/MyCrops";
import AdminTasks from "./pages/farmer/AdminTasks";
import AICropRecommendation from "./pages/farmer/AICropRecommendation";
import SellProducts from "./pages/farmer/SellProducts";
import ProfileSettings from "./pages/farmer/ProfileSettings";
import FarmerConnections from "./pages/farmer/Connections";
import OrderManagement from "./pages/farmer/OrderManagement";
import PaymentVerification from "./pages/farmer/PaymentVerification";
import FarmerAnalytics from "./pages/farmer/Analytics";
import CropProtectionTimeline from "./pages/farmer/CropProtectionTimeline";
import CustomerComplaintsFarmer from "./pages/farmer/CustomerComplaints";
import CustomerDashboard from "./pages/CustomerDashboard";
import Products from "./pages/customer/Products";
import MyOrders from "./pages/customer/MyOrders";
import Cart from "./pages/customer/Cart";
import Payment from "./pages/customer/Payment";
import OrderTrackingPage from "./pages/customer/OrderTrackingPage";
import Connections from "./pages/customer/Connections";
import Complaints from "./pages/customer/Complaints";
import CustomerProfileSettings from "./pages/customer/ProfileSettings";
import AdminDashboard from "./pages/AgentDashboard";
import FarmerManagement from "./pages/agent/FarmerManagement";
import SendTasks from "./pages/agent/SendTasks";
import MarketOverview from "./pages/agent/MarketOverview";
import ReportsAnalytics from "./pages/agent/ReportsAnalytics";
import AdminProfileSettings from "./pages/agent/ProfileSettings";
import CropTemplateCreator from "./pages/agent/CropTemplateCreator";
import { AIChatbot } from "./components/AIChatbot";
import OrderTracking from "./pages/OrderTracking";
import ProductDetail from "./pages/ProductDetail";
import CropGuidance from "./pages/CropGuidance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />}>
            <Route path="my-crops" element={<MyCrops />} />
            <Route path="admin-tasks" element={<AdminTasks />} />
            <Route path="ai-recommendation" element={<AICropRecommendation />} />
            <Route path="market-products" element={<SellProducts />} />
          <Route path="order-management" element={<OrderManagement />} />
          <Route path="payment-verification" element={<PaymentVerification />} />
          <Route path="analytics" element={<FarmerAnalytics />} />
          <Route path="crop-protection" element={<CropProtectionTimeline />} />
          <Route path="customer-complaints" element={<CustomerComplaintsFarmer />} />
          <Route path="connections" element={<FarmerConnections />} />
          <Route path="profile-settings" element={<ProfileSettings />} />
          </Route>
          <Route path="/customer-dashboard" element={<CustomerDashboard />}>
            <Route path="products" element={<Products />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="cart" element={<Cart />} />
            <Route path="payment" element={<Payment />} />
            <Route path="order-tracking" element={<OrderTrackingPage />} />
            
            <Route path="complaints" element={<Complaints />} />
            <Route path="profile" element={<CustomerProfileSettings />} />
          </Route>
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route path="farmer-management" element={<FarmerManagement />} />
            <Route path="crop-template-creator" element={<CropTemplateCreator />} />
            <Route path="send-tasks" element={<SendTasks />} />
            <Route path="market-overview" element={<MarketOverview />} />
            <Route path="reports-analytics" element={<ReportsAnalytics />} />
            <Route path="profile-settings" element={<AdminProfileSettings />} />
          </Route>
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/crop-guidance" element={<CropGuidance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
