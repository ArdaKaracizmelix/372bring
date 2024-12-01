import React, {} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Signup from "./SignUp";
import Dashboard from "./Dashboard";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import Accounts from "./Accounts";
import Cart from "./Cart";
import LastOrders from "./LastOrders";
import MenuPage from "./MenuPage";

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/AboutPage" element={<AboutPage />} />
        <Route path="/ContactPage" element={<ContactPage />} />
        <Route path="/Accounts" element={<Accounts />} />
        <Route path="/Cart" element={<Cart/>} />
        <Route path="/LastOrders" element={<LastOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/MenuPage/:restaurantId" element={<MenuPage />} />
      </Routes>
    </Router>
  );
};

export default App;
