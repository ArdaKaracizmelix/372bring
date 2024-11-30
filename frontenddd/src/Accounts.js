import React, { useState } from "react";
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
  Settings,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";

const Accounts = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSaveChanges = () => {
    alert("Changes saved!");
  };

  const handleAccountDeletion = () => {
    alert("Account deleted!");
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
          { text: "Settings", icon: <Settings />, path: "/Settings" },
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
        {/* Form Section */}
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
            <TextField disabled defaultValue="yekta" label="First Name" fullWidth />
            <TextField disabled defaultValue="kumap" label="Last Name" fullWidth />
            <TextField disabled defaultValue="555-555-5555" label="Phone Number" fullWidth />
            <TextField disabled defaultValue="test@example.com" label="Email" fullWidth />
          </Box>
          <Typography variant="h5" sx={{ marginTop: "32px", marginBottom: "16px" }}>
            Password
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <TextField label="Current Password" type="password" fullWidth />
            <TextField label="New Password" type="password" fullWidth />
            <Button
              variant="contained"
              sx={{
                backgroundColor: darkMode ? "#666" : "#FF6F61",
                "&:hover": {
                  backgroundColor: darkMode ? "#777" : "#FF6F61",
                },
              }}
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </Box>
          <Typography variant="h5" sx={{ marginTop: "32px", marginBottom: "16px" }}>
            Account Deletion
          </Typography>
          <Button variant="contained" color="error" onClick={handleAccountDeletion}>
            Delete My Account
          </Button>
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

export default Accounts;
