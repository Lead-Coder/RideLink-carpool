import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RiderDashboard from "./pages/rider/RiderDashboard";
import SearchRide from "./pages/rider/SearchRide";
import BookRide from "./pages/rider/BookRide";
import Payment from "./pages/rider/Payment";
import TrackRide from "./pages/rider/TrackRide";
import RateRide from "./pages/rider/RateRide";
import DriverDashboard from "./pages/driver/DriverDashboard";
import AddRide from "./pages/driver/AddRide";
import MyRides from "./pages/driver/MyRides";
import DriverProfile from "./pages/driver/DriverProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DriverVerification from "./pages/admin/DriverVerification";
import Reports from "./pages/admin/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rider Routes */}
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/rider/search-ride" element={<SearchRide />} />
          <Route path="/rider/book-ride" element={<BookRide />} />
          <Route path="/rider/payment" element={<Payment />} />
          <Route path="/rider/track-ride" element={<TrackRide />} />
          <Route path="/rider/rate-ride" element={<RateRide />} />
          
          {/* Driver Routes */}
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/driver/add-ride" element={<AddRide />} />
          <Route path="/driver/my-rides" element={<MyRides />} />
          <Route path="/driver/profile" element={<DriverProfile />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/driver-verification" element={<DriverVerification />} />
          <Route path="/admin/reports" element={<Reports />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
