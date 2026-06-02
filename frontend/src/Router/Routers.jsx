import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Tours from '../Pages/Tours';
import TourDetails from '../Pages/TourDetails';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import SearchResultList from '../Pages/SearchResultList';
import ThankYou from '../Pages/ThankYou';
import About from '../Pages/About';
import FAQ from '../Shared/FAQ';
import Contact from '../Pages/Contact';
import Gallery from '../Pages/Gallery';
import PageNotFound from '../Pages/PageNotFound';
import Blogs from '../Pages/Blogs';
import BlogDetails from '../Pages/BlogDetails';
import ScrollToTop from '../utils/scrolltoTop';
import ClientDashboard from '../Pages/ClientDashboard';
import AgencyDashboard from '../Pages/AgencyDashboard';
import AddOffering from '../Pages/AddOffering';
import ReviewSurvey from '../Pages/ReviewSurvey';

const Router = () => {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/search" element={<SearchResultList />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<BlogDetails />} />
      {/* Role-based dashboards */}
      <Route path="/my-bookings" element={<ClientDashboard />} />
      <Route path="/agency-dashboard" element={<AgencyDashboard />} />
      <Route path="/add-offering" element={<AddOffering />} />
      <Route path="/survey/:bookingId" element={<ReviewSurvey />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes></>
  );
};

export default Router;
