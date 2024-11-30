import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings,
  Logout,
  Menu as MenuIcon,
} from '@mui/icons-material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import logo from './assets/logo.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

const LastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // LocalStorage'den user_id'yi al
        const userId = localStorage.getItem('user_id');
    
        if (!userId) {
          console.error('User ID not found in localStorage.');
          alert('You must be logged in to view your orders.');
          return;
        }
    
        // API çağrısını userId ile yap
        const response = await fetch(`http://127.0.0.1:5000/orders/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched orders:', data);
          setOrders(data); // Gelen siparişleri orders state'ine aktar
        } else {
          console.error('Failed to fetch orders:', response.statusText);
          alert('Failed to fetch your orders. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('An error occurred while fetching your orders.');
      }
    };
    
    
    


    fetchOrders();
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#f5f5f5' : '#000',
        flexDirection: 'column',
      }}
    >
      {/* Sidebar - Swipeable Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            backgroundColor: darkMode ? '#333' : '#FF6F61',
            color: darkMode ? '#f5f5f5' : '#ffffff',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: 80,
              height: 'auto',
              filter: darkMode ? 'invert(1)' : 'none',
            }}
            onClick={() => navigate('/')}
          />
        </Box>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/Dashboard' },
          { text: 'Settings', icon: <Settings />, path: '/Settings' },
          { text: 'Cart', icon: <ShoppingCartIcon />, path: '/Cart' },
          { text: 'Last Orders', icon: <ShoppingCartIcon />, path: '/LastOrders' },
          { text: 'Logout', icon: <Logout />, path: '/' },
        ].map((item, index) => (
          <Box
            key={index}
            onClick={() => navigate(item.path)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '8px',
              '&:hover': { backgroundColor: darkMode ? '#555' : '#ff896b' },
            }}
          >
            {item.icon}
            <Typography>{item.text}</Typography>
          </Box>
        ))}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 20,
          }}
        >
          <IconButton onClick={handleDarkModeToggle}>
            {darkMode ? <LightModeIcon sx={{ color: '#f5f5f5' }} /> : <DarkModeIcon sx={{ color: '#000' }} />}
          </IconButton>
        </Box>
      </SwipeableDrawer>

      {/* Top Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: darkMode ? '#121212' : '#FF6F61',
          color: darkMode ? '#f5f5f5' : '#ffffff',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Last Orders</Typography>
          <IconButton onClick={() => navigate("/Accounts")}>
            <Avatar sx={{ backgroundColor: darkMode ? '#505050' : '#FF6F61' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Table Container */}
      <Box
        sx={{
          width: '90%',
          maxWidth: '800px',
          margin: '24px auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '24px',
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ marginBottom: 2, fontWeight: 'bold' }}
        >
          Your Recent Orders
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Restaurant</TableCell>
                <TableCell align="center">Order Details</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Date</TableCell>
              </TableRow>
            </TableHead>
           <TableBody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{order.restaurant_name || 'Unknown'}</TableCell>
                    <TableCell align="center">{order.order_details || 'N/A'}</TableCell>
                    <TableCell align="center">{order.quantity || 0}</TableCell>
                    <TableCell align="center">{order.order_status || 'Pending'}</TableCell>
                    <TableCell align="center">{order.timestamp || 'Unknown Date'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          width: '100%',
          padding: '20px 0',
          textAlign: 'center',
          backgroundColor: darkMode ? '#333' : '#FF6F61',
          marginTop: 'auto',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#ffffff',
          }}
        >
          © 2024 Bring. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LastOrders;
