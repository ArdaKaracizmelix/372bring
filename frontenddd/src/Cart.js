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
  Radio,
  RadioGroup,
  FormControlLabel,
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Cart = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryOption, setDeliveryOption] = useState("now");
  const navigate = useNavigate();

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
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
          { text: "Cart", icon: <Settings />, path: "/Cart"},
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
          <Typography variant="h6">Cart</Typography>
          
          <IconButton onClick={() => navigate("/Accounts")}>
            <Avatar sx={{ backgroundColor: darkMode ? "#505050" : "#FF6F61" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          padding: "24px",
        }}
      >
        {/* Left Side */}
        <Box sx={{ flex: 2 }}>
          {/* Delivery Address */}
          <Box
            sx={{
              marginBottom: "24px",
              padding: "16px",
              border: "1px solid",
              borderColor: darkMode ? "#555" : "#ddd",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6">Teslimat Adresi</Typography>
            <Typography>Kullanıcının adresi buraya gelecek</Typography>
          </Box>

          {/* Delivery Options */}
          <Box
            sx={{
              marginBottom: "24px",
              padding: "16px",
              border: "1px solid",
              borderColor: darkMode ? "#555" : "#ddd",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6">Teslimat Seçenekleri</Typography>
            <RadioGroup
              value={deliveryOption}
              onChange={(e) => setDeliveryOption(e.target.value)}
            >
              <FormControlLabel value="now" control={<Radio />} label="Hemen teslimat" />
              <FormControlLabel
                value="later"
                control={<Radio />}
                label="İleri tarihli gün ve saat seçin"
              />
            </RadioGroup>
          </Box>

          {/* Personal Information */}
          <Box
            sx={{
              marginBottom: "24px",
              padding: "16px",
              border: "1px solid",
              borderColor: darkMode ? "#555" : "#ddd",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6">Kişisel Bilgiler</Typography>
            <TextField label="İsim Soyisim" fullWidth sx={{ marginBottom: "16px" }} />
            <TextField label="Email" fullWidth sx={{ marginBottom: "16px" }} />
            <TextField label="Telefon Numarası" fullWidth />
          </Box>

          {/* Payment Information */}
          <Box
            sx={{
              marginBottom: "24px",
              padding: "16px",
              border: "1px solid",
              borderColor: darkMode ? "#555" : "#ddd",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6">Ödeme</Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="cash" control={<Radio />} label="Nakit" />
              <FormControlLabel value="card" control={<Radio />} label="Kartla Ödeme" />
            </RadioGroup>
            {paymentMethod === "card" && (
              <Box sx={{ marginTop: "16px" }}>
                <TextField label="Kart Numarası" fullWidth sx={{ marginBottom: "16px" }} />
                <TextField label="Son Kullanma Tarihi" fullWidth sx={{ marginBottom: "16px" }} />
                <TextField label="CVV" fullWidth />
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: darkMode ? "#666" : "#FF6F61",
              "&:hover": { backgroundColor: darkMode ? "#777" : "#FF6F61" },
              width: "100%",
            }}
          >
            Siparişi Tamamla
          </Button>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            flex: 1,
            padding: "16px",
            border: "1px solid",
            borderColor: darkMode ? "#555" : "#ddd",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">Siparişiniz</Typography>
          <Typography>Ürün 1 - 100 TL</Typography>
          <Typography>Ürün 2 - 200 TL</Typography>
          <Typography>Toplam: 300 TL</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
