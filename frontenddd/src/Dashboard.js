import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  Avatar,
  TextField,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings,
  Logout,
  ArrowForwardIos,
  ArrowBackIos,
} from "@mui/icons-material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import logo from "./assets/logo.png";
import restaurant1 from "./assets/restaurant1.png";
import restaurant2 from "./assets/restaurant2.png";
import restaurant3 from "./assets/restaurant3.jpg";
import restaurant4 from "./assets/restaurant4.png";
import restaurant5 from "./assets/restaurant5.png";

// Import slider images
import slide1 from "./assets/dashboardkampanya1.jpg";
import slide2 from "./assets/dashboardkampanya2.png";
import slide3 from "./assets/dashboardkampanya3.jpg";

import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios to fetch data from the API

const slides = [slide1, slide2, slide3];

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [restaurantIndex, setRestaurantIndex] = useState(0);
  const [restaurants, setRestaurants] = useState([]); // State to hold fetched restaurant data
  const navigate = useNavigate();

  // Fetch restaurant data from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/restaurants"); // Replace with your API endpoint
        setRestaurants(response.data); // Set the state with the fetched restaurant data
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchRestaurants();
  }, []);

  // Dark mode toggle
  const handleDarkModeToggle = () => setDarkMode(!darkMode);

  // Sidebar toggle
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  // Slider interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Restaurant navigation
  const handleNextRestaurants = () => {
    if (restaurantIndex + 4 < restaurants.length) {
      setRestaurantIndex(restaurantIndex + 4);
    }
  };

  const handlePrevRestaurants = () => {
    if (restaurantIndex - 4 >= 0) {
      setRestaurantIndex(restaurantIndex - 4);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
        color: darkMode ? "#f5f5f5" : "#000",
        flexDirection: "column",
      }}
    >
      {/* Sidebar */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            backgroundColor: darkMode ? "#333" : "#FF6F61",
            color: darkMode ? "#f5f5f5" : "#ffffff",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: 80,
              height: "auto",
              filter: darkMode ? "invert(1)" : "none",
            }}
            onClick={() => navigate("/")}
          />
        </Box>
        {[{ text: "Dashboard", icon: <DashboardIcon />, path: "/Dashboard" },
          { text: "Settings", icon: <Settings />, path: "/Settings" },
          { text: "Cart", icon: <Settings />, path: "/Cart"},
          { text: "Logout", icon: <Logout />, path: "/" }].map((item, index) => (
          <Box
            key={index}
            onClick={() => navigate(item.path)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: "12px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "8px",
              "&:hover": { backgroundColor: darkMode ? "#555" : "#ff896b" },
            }}
          >
            {item.icon}
            <Typography>{item.text}</Typography>
          </Box>
        ))}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: 20,
          }}
        >
          <IconButton onClick={handleDarkModeToggle}>
            {darkMode ? <LightModeIcon sx={{ color: "#f5f5f5" }} /> : <DarkModeIcon sx={{ color: "#000" }} />}
          </IconButton>
        </Box>
      </SwipeableDrawer>

      {/* App Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: darkMode ? "#121212" : "#FF6F61",
          color: darkMode ? "#f5f5f5" : "#000",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <TextField
            placeholder="What do you want to eat today?"
            variant="outlined"
            sx={{
              width: "50%",
              backgroundColor: darkMode ? "#333" : "#fff",
              borderRadius: "8px",
            }}
          />
          <IconButton onClick={() => navigate("/Accounts")}>
            <Avatar sx={{ backgroundColor: darkMode ? "#505050" : "#FF6F61" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, padding: "16px" }}>
        {/* Fotoğraf Slider */}
        <Box
          sx={{
            width: "40%",
            height: "350px",
            overflow: "hidden",
            borderRadius: "12px",
            marginBottom: "20px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -110%)",
          }}
        >
          <Box
            component="img"
            src={slides[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              backgroundColor: darkMode ? "#121212" : "#f5f5f5",
            }}
          />
        </Box>

        {/* Restoran Listesi */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "400px",
            justifyContent: "center",
          }}
        >
          <IconButton onClick={handlePrevRestaurants} disabled={restaurantIndex === 0}>
            <ArrowBackIos />
          </IconButton>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
              flexGrow: 1,
            }}
          >
            {restaurants.slice(restaurantIndex, restaurantIndex + 4).map((restaurant) => (
              <Box
                key={restaurant.id}
                sx={{
                  backgroundColor: darkMode ? "#333" : "#fff",
                  padding: 2,
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <Box
                  component="img"
                  src={restaurant.image}
                  alt={restaurant.name}
                  sx={{
                    width: "100%",
                    height: "150px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginBottom: 2,
                    backgroundColor: darkMode ? "#121212" : "#ffffff",
                  }}
                />
                <Typography sx={{ marginTop: 2 }}>{restaurant.name}</Typography>
              </Box>
            ))}
          </Box>
          <IconButton onClick={handleNextRestaurants} disabled={restaurantIndex + 4 >= restaurants.length}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          width: "100%",
          padding: "16px",
          textAlign: "center",
          backgroundColor: darkMode ? "#333" : "#FF6F61",
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: darkMode ? "#f5f5f5" : "#fff" }}
        >
          © 2024 Bring. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
