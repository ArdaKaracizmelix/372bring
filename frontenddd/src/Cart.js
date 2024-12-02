import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  SwipeableDrawer,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const Cart = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);


  useEffect(() => {
    const storedTotal = localStorage.getItem("totalAmount");
    if (storedTotal) {
      setTotalAmount(parseFloat(storedTotal));
    }
   
    const fetchCustomerData = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        const response = await axios.get(`http://localhost:5000/customers/${user_id}`);
        setCustomerData(response.data);
      } catch (err) {
        setError("Failed to load customer data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/drivers/available");
        if (response.status === 200) {
          setAvailableDrivers(response.data);
        }
      } catch (err) {
        console.error("Error fetching drivers:", err);
      }
    };

    fetchCustomerData();
    fetchDrivers();
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const assignRandomDriver = () => {
    if (availableDrivers.length > 0) {
      const randomDriver =
        availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
      setSelectedDriver(randomDriver);
    }
  };
//  const handlePayNow = async () => {
//       const customerId = localStorage.getItem("user_id");
//       const restaurantId = localStorage.getItem("restaurantId");
//       const storedCart = localStorage.getItem("cartItems");
//       const totalAmount = localStorage.getItem("totalAmount");
//       const orderDetails = storedCart ? JSON.parse(storedCart) : [];
    
//       if (!customerId || !restaurantId || orderDetails.length === 0) {
//         alert("Invalid order or user information.");
//         return;
//       }
    
//       const orderData = {
//         customer_id: customerId,
//         restaurant_id: restaurantId,
//         order_details: orderDetails.map((item) => ({
//           item: item.item_name,
//           quantity: item.quantity,
//         })),
//         order_status: "Preparing",
//         driver_id: selectedDriver.driver_id,
//         payment: {
//           amount: totalAmount,
//           method: paymentMethod,
//           status: "Paid",
//         },
//       };
    
//       try {
//         console.log("Order Data:", orderData); // Debug için loglama
//         const response = await axios.post(
//           "http://localhost:5000/order-and-payment",
//           orderData
//         );
    
//         if (response.status === 201) {
//           alert("Order and payment processed successfully!");
//           setCart([]);
//           localStorage.removeItem("cartItems");
//           localStorage.removeItem("restaurantId");
//           setTotalAmount(0);
//           setSelectedDriver(null);
//         } else {
//           alert("Failed to process order.");
//         }
//       } catch (error) {
//         console.error("Error processing payment:", error);
//         alert("An error occurred. Please try again.");
//       }
//     };





const handlePayNow = async () => {
  const customerId = localStorage.getItem("user_id");
  const restaurantId = localStorage.getItem("restaurantId");
  const storedCart = localStorage.getItem("cartItems");
  const totalAmount = parseFloat(localStorage.getItem("totalAmount"));
  const orderDetails = storedCart ? JSON.parse(storedCart) : [];

  if (!customerId || !restaurantId || orderDetails.length === 0) {
    alert("Invalid order or user information.");
    return;
  }

  if (!selectedDriver) {
    alert("Please assign a driver before proceeding with payment.");
    return;
  }

  const orderData = {
    customer_id: customerId,
    restaurant_id: restaurantId,
    order_details: orderDetails.map((item) => ({
      item: item.item_name,
      quantity: item.quantity,
    })),
    order_status: "Preparing",
    driver_id: selectedDriver.driver_id,
    payment: {
      amount: totalAmount,
      method: paymentMethod,
      status: "Paid",
    },
  };

  console.log("Order Data Sent:", orderData);

  try {
    const response = await axios.post("http://localhost:5000/order-and-payment", orderData);

    if (response.status === 201) {
      alert("Order and payment processed successfully!");
      setCart([]);
      localStorage.removeItem("cartItems");
      localStorage.removeItem("restaurantId");
      setTotalAmount(0);
      setSelectedDriver(null);
    } else {
      alert("Failed to process order.");
    }
  } catch (error) {
    console.error("Error processing payment:", error.response?.data || error.message);
    alert(`Error: ${error.response?.data?.error || "An error occurred."}`);
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
            flexDirection: "column",
            padding: "16px",
            gap: 2,
          }}
        >
          {[{ text: "Dashboard", icon: <DashboardIcon />, path: "/Dashboard" },
            { text: "Settings", icon: <SettingsIcon />, path: "/Settings" },
            { text: "Cart", icon: <ShoppingCartIcon />, path: "/Cart" },
            { text: "Last Orders", icon: <ShoppingCartIcon />, path: "/LastOrders" },
            { text: "Logout", icon: <LogoutIcon />, path: "/" }
          ].map((item, index) => (
            <Button
              key={index}
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{
                justifyContent: "flex-start",
                color: "#fff",
                "&:hover": { backgroundColor: darkMode ? "#555" : "#ff896b" },
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </SwipeableDrawer>

      {/* AppBar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: darkMode ? "#121212" : "#FF6F61",
          color: darkMode ? "#f5f5f5" : "#000",
        }}
      >
        <Toolbar>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Typography variant="h6">{`Total: ${totalAmount.toFixed(2)} $`}</Typography>
          </Box>
          <IconButton onClick={handleDarkModeToggle}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
          <IconButton onClick={() => navigate("/Accounts")}>
            <Avatar sx={{ backgroundColor: darkMode ? "#505050" : "#FF6F61" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: "flex", flexGrow: 1, padding: "16px", gap: "16px" }}>
        {/* User Info */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "300px",
            backgroundColor: darkMode ? "#333" : "#ffffff",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "8px" }}>
            User Info
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Typography>Name: {customerData.name || "N/A"}</Typography>
              <Typography>Phone: {customerData.phone || "N/A"}</Typography>
              <Typography>Email: {customerData.email || "N/A"}</Typography>
              <Typography>Address: {customerData.address || "N/A"}</Typography>
            </>
          )}
        </Box>

        {/* Payment Form */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: darkMode ? "#333" : "#ffffff",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            Payment Details
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: "16px" }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={handlePaymentChange}
              label="Payment Method"
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
            </Select>
          </FormControl>
          {paymentMethod === "Credit Card" && (
            <>
              <TextField
                label="Card Number"
                fullWidth
                variant="outlined"
                sx={{ marginBottom: "16px" }}
              />
              <Box sx={{ display: "flex", gap: "16px" }}>
                <TextField
                  label="Expiry Date"
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  label="CVV"
                  variant="outlined"
                  fullWidth
                />
              </Box>
            </>
          )}
          <Button
  variant="contained"
  fullWidth
  sx={{
    backgroundColor: "#FF6F61",
    marginTop: "16px",
    "&:hover": { backgroundColor: "#FF896B" },
  }}
  onClick={handlePayNow}
  disabled={loading}
>
  {loading ? "Processing..." : "Pay Now"}
</Button>
        </Box>

        {/* Available Drivers */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "300px",
            backgroundColor: darkMode ? "#333" : "#ffffff",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "8px" }}>
            Your Driver
          </Typography>
          <Button
            variant="contained"
            onClick={assignRandomDriver}
            sx={{ marginBottom: "16px", backgroundColor: "#FF6F61" }}
          >
            Assign Driver
          </Button>
          {selectedDriver ? (
            <Box>
              <Typography><strong>Assigned Driver:</strong></Typography>
              <Typography>Name: {selectedDriver.name}</Typography>
              <Typography>Contact: {selectedDriver.contact}</Typography>
              <Typography>Vehicle: {selectedDriver.vehicle_details}</Typography>
            </Box>
          ) : (
            <Typography>No driver assigned yet</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
