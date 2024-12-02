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
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,

  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
const Accounts = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const user_id = localStorage.getItem("user_id"); // Assuming customer ID is stored in localStorage
        const response = await axios.get(`http://localhost:5000/customers/${user_id}`);
        setCustomerData(response.data);
      } catch (err) {
        setError("Failed to load customer data.");
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Send password change request to the server
    try {
      const user_id = localStorage.getItem("user_id");
      const response = await axios.put(`http://localhost:5000/customers/change-password`, {
        user_id,
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        alert("Password updated successfully!");
      } else {
        alert("Failed to update password.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("Error changing password.");
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
      {/* Sidebar - Swipeable Drawer */}
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
          { text: "Last Order", icon: <ShoppingCartIcon/>, path: "/LastOrders"},
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

      {/* Top Bar */}
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
          <Typography variant="h6">Account Details</Typography>
          <IconButton onClick={() => navigate("/Accounts")}>
            <Avatar sx={{ backgroundColor: darkMode ? "#505050" : "#FF6F61" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box
            sx={{
              width: "90%",
              maxWidth: "800px",
              backgroundColor: darkMode ? "#202020" : "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "24px",
              margin: "16px",
            }}
          >
            <Typography variant="h5" align="center" sx={{ marginBottom: "16px" }}>
              My Account
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <TextField
                disabled
                value={customerData.name || ""}
                label="Name"
                fullWidth
              />
              <TextField
                disabled
                value={customerData.phone || ""}
                label="Phone Number"
                fullWidth
              />
              <TextField
                disabled
                value={customerData.email || ""}
                label="Email"
                fullWidth
              />
              <TextField
                disabled
                value={customerData.address || ""}
                label="Address"
                fullWidth
              />
              {/* Password change fields */}
              <TextField
                type="password"
                label="Current Password"
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                type="password"
                label="New Password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                type="password"
                label="Confirm New Password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordChange}
                sx={{ marginTop: 2 }}
              >
                Change Password
              </Button>
            </Box>
            
            
          </Box>
        )}
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

export default Accounts;
