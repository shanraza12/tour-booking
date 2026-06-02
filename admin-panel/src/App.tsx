import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import UserManagement from "./pages/Users/UserManagement";
import BlogManagement from "./pages/blogs/BlogManagement";
import TourManagement from "./pages/Tours/TourManagement";
import BookingManagement from "./pages/Bookings/BookingManagement";
import { ToastContainer } from 'react-toastify';
import AuthGuard from "./AuthGuard/AuthGuard";
import PaymentManagement from "./pages/Payments/PaymentManagement";
import CustomerManagement from "./pages/customers/CustomerManagement";
import ActivityLogs from "./pages/Logs/ActivityLogs";
import StaffManagement from "./pages/Staff/StaffManagement";

export default function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          <Route element={<AuthGuard requiredRole="admin" />} >
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/blogs" element={<BlogManagement />} />
            <Route path="/tours" element={<TourManagement />} />
            <Route path="/bookings" element={<BookingManagement />} />
            <Route path="/payments" element={<PaymentManagement />} />
            <Route path="/logs" element={<ActivityLogs />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
