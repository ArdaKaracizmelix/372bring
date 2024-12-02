import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Rating,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Settings,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import logo from "./assets/logo.png";
const MenuPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [cart, setCart] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuAndDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const menuResponse = await axios.get(
          `http://localhost:5000/restaurants/${restaurantId}/menus`
        );
        setMenuItems(menuResponse.data);

        const detailsResponse = await axios.get(
          `http://localhost:5000/restaurants/${restaurantId}`
        );
        setRestaurantDetails(detailsResponse.data);

        const promotionsResponse = await axios.get(
          `http://localhost:5000/restaurants/${restaurantId}/promotions`
        );
        setPromotions(promotionsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load menu or restaurant information.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuAndDetails();
  }, [restaurantId]);

  const handleDarkModeToggle = () => setDarkMode(!darkMode);

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleAddToCart = (item) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.item_name === item.item_name
    );
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((cartItem) =>
        cartItem.item_name === item.item_name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [
        ...cart,
        { item_name: item.item_name, price: item.price, quantity: 1 },
      ];
    }
    setCart(updatedCart);
  
    // LocalStorage'e yaz
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    localStorage.setItem("restaurantId", restaurantId); // Restaurant ID'yi ekle
  };
  

  const handleRemoveFromCart = (itemName) => {
    const existingItem = cart.find((cartItem) => cartItem.item_name === itemName);
    let updatedCart;
    if (existingItem.quantity > 1) {
      updatedCart = cart.map((cartItem) =>
        cartItem.item_name === itemName
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    } else {
      updatedCart = cart.filter((cartItem) => cartItem.item_name !== itemName);
    }
    setCart(updatedCart);
  
    // LocalStorage'i güncelle
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };;

  const handleApplyPromoCode = () => {
    const matchedPromo = promotions.find(
      (promo) => promo.promo_code === promoCode
    );
    if (matchedPromo) {
      setDiscount(matchedPromo.discount_value);
    } else {
      setDiscount(0);
      alert("Invalid promo code.");
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity, // item.price burada artık düzgün çalışır
      0
    );
    return subtotal - (subtotal * discount) / 100;
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
       
        {[
          { text: "Dashboard", icon: <DashboardIcon />, path: "/Dashboard" },
        
     
          { text: "Last Orders", icon: <ShoppingCartIcon />, path: "/LastOrders" },
          { text: "Logout", icon: <Logout />, path: "/" },
        ].map((item, index) => (
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
            {darkMode ? (
              <LightModeIcon sx={{ color: "#f5f5f5" }} />
            ) : (
              <DarkModeIcon sx={{ color: "#000" }} />
            )}
          </IconButton>
        </Box>
      </SwipeableDrawer>

      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: darkMode ? "#121212" : "#FF6F61",
          color: darkMode ? "#f5f5f5" : "#ffffff",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={() => navigate("/Accounts")}>
            <Avatar
              sx={{
                backgroundColor: darkMode ? "#505050" : "#FF6F61",
              }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Restoran Bilgileri */}
      <Box
        sx={{
          padding: "16px",
          backgroundColor: darkMode ? "#1e1e1e" : "#fff",
          margin: "16px",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {restaurantDetails.name}
        </Typography>
        <Typography variant="body2">{restaurantDetails.address}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
          <Typography variant="body2" sx={{ marginRight: "8px" }}>
            Rating:
          </Typography>
          <Rating
            value={restaurantDetails.rating || 0}
            precision={0.1}
            readOnly
          />
        </Box>
      </Box>

      <Box sx={{ padding: "24px" }}>
        {loading ? (
          <Box sx={{ textAlign: "center", marginTop: "50px" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ marginTop: "20px" }}>
            {error}
          </Alert>
        ) : (
          <>
            <Box sx={{ marginBottom: "24px" }}>
              <Typography
                variant="h5"
                align="center"
                sx={{ marginBottom: "16px", fontWeight: "bold" }}
              >
                Active Promotions
              </Typography>
              {promotions.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Promo Code</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Discount</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Valid Until</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {promotions.map((promo, index) => (
                        <TableRow key={index}>
                          <TableCell>{promo.promo_code}</TableCell>
                          <TableCell>{promo.discount_value}%</TableCell>
                          <TableCell>{promo.description}</TableCell>
                          <TableCell>
                            {new Date(promo.end_date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info" sx={{ marginTop: "20px" }}>
                  No promotions available for this restaurant.
                </Alert>
              )}
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.item_name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.price} $</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: darkMode ? "#666" : "#FF6F61",
                            "&:hover": {
                              backgroundColor: darkMode ? "#777" : "#FF6F61",
                            },
                          }}
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ marginTop: "24px" }}>
              <Typography variant="h5" sx={{ marginBottom: "16px" }}>
                Cart
              </Typography>
              {cart.length > 0 ? (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cart.map((cartItem, index) => (
                          <TableRow key={index}>
                            <TableCell>{cartItem.item_name}</TableCell>
                            <TableCell>{cartItem.quantity}</TableCell>
                            <TableCell>{cartItem.price} $</TableCell>
                            <TableCell>
                              {(cartItem.price * cartItem.quantity).toFixed(2)} $
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  handleRemoveFromCart(cartItem.item_name)
                                }
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    sx={{ marginTop: "16px", display: "flex", alignItems: "center" }}
                  >
                    <TextField
                      label="Promo Code"
                      variant="outlined"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      sx={{ marginRight: "16px" }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleApplyPromoCode}
                      sx={{
                        backgroundColor: darkMode ? "#666" : "#FF6F61",
                        "&:hover": {
                          backgroundColor: darkMode ? "#777" : "#FF6F61",
                        },
                      }}
                    >
                      Apply Promo Code
                    </Button>
                  </Box>
                  <Typography sx={{ marginTop: "16px" }}>
                    Discount: {discount}% off
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ marginTop: "8px", fontWeight: "bold" }}
                  >
                    Total: {calculateTotal().toFixed(2)} $
                  </Typography>
                  <Button
                      variant="contained"
                      onClick={() => {
                        const totalAmount = calculateTotal().toFixed(2);
                        localStorage.setItem("totalAmount", totalAmount); // Toplam tutarı LocalStorage'a yaz
                        navigate("/Cart", { state: { total: totalAmount } });
                      }}
                      sx={{
                        marginTop: "16px",
                        backgroundColor: darkMode ? "#666" : "#FF6F61",
                        "&:hover": {
                          backgroundColor: darkMode ? "#777" : "#FF6F61",
                        },
                      }}
                    >
                      Checkout
                    </Button>

                </>
              ) : (
                <Alert severity="info">Your cart is empty.</Alert>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MenuPage;
