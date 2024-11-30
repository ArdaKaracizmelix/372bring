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

const MenuPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState(""); // Restoran adını tutmak için state
  const [promotions, setPromotions] = useState([]); // State to store promotions
  const [loading, setLoading] = useState(true); // Yükleniyor durumunu izler
  const [error, setError] = useState(""); // Hata durumunu izler
  const { restaurantId } = useParams(); // URL'den restaurantId alın
  const navigate = useNavigate();

  // Menü ve restoran ve promotion bilgilerini çek
  useEffect(() => {
    const fetchMenuAndPromotions = async () => {
      try {
        setLoading(true);
        setError("");
  
        // Fetch menu data
        const menuResponse = await axios.get(
          `http://localhost:5000/restaurants/${restaurantId}/menus`
        );
        setMenuItems(menuResponse.data);
  
        // Fetch restaurant info
        const restaurantResponse = await axios.get(
          `http://localhost:5000/restaurants/${restaurantId}`
        );
        setRestaurantName(restaurantResponse.data.name);
  
        // Fetch promotions
        const promotionsResponse = await axios.get(
          `http://localhost:5000/restaurants/${restaurantId}/promotions`
        );
        setPromotions(promotionsResponse.data); // Store promotions
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load menu or restaurant information.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchMenuAndPromotions();
  }, [restaurantId]);

  const handleDarkModeToggle = () => setDarkMode(!darkMode);

  const toggleDrawer = (open) => () => setDrawerOpen(open);

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
          <Typography variant="h6" onClick={() => navigate("/")}>
            Bring
          </Typography>
        </Box>
        {[
          { text: "Dashboard", icon: <DashboardIcon />, path: "/Dashboard" },
          { text: "Settings", icon: <Settings />, path: "/Settings" },
          { text: "Cart", icon: <ShoppingCartIcon />, path: "/Cart" },
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

      {/* App Bar */}
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
          <IconButton onClick={() => navigate("/Cart")}>
            <Avatar
              sx={{
                backgroundColor: darkMode ? "#505050" : "#FF6F61",
              }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
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
            <Typography
              variant="h4"
              align="center"
              sx={{ marginBottom: "24px", fontWeight: "bold" }}
            >
              {restaurantName}'s Menu
            </Typography>


          {/* Promotions Section */}
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
                        <TableCell>{new Date(promo.end_date).toLocaleDateString()}</TableCell>
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
                        >
                          Add to Cart
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MenuPage;
