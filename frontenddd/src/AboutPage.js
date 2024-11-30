import React, { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import LoginIcon from '@mui/icons-material/Login';

const AboutPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: darkMode ? '#121212' : '#f8f9fa',
        color: darkMode ? '#f5f5f5' : '#000',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Bar */}
            <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: '70%',
          transform: 'translateX(-50%)',
          width: '60%',
          maxWidth: 300,
          height: '60px',
          backgroundColor: darkMode ? '#333' : '#FF6F61',
          display: 'flex',
          justifyContent: 'space-between', // Eşit aralık için bu özellik
          alignItems: 'center',
          padding: '0 20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Butonları eşit mesafe ile yerleştirir
            width: '100%', // Box genişliğini %100 yaparak içerikleri yayar
          }}
        >
          <Button
            variant="text"
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: darkMode ? '#f5f5f5' : '#FFFFFF',
            }}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            HOME
          </Button>

          <Button
            variant="text"
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: darkMode ? '#f5f5f5' : '#FFFFFF',
            }}
            onClick={() => {
              window.location.href = "/AboutPage";
            }}
          >
            ABOUT
          </Button>

          <Button
            variant="text"
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: darkMode ? '#f5f5f5' : '#FFFFFF',
            }}
            onClick={() => {
              window.location.href = "/ContactPage";
            }}
          >
            CONTACT
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleDarkModeToggle} color="inherit">
            {darkMode ? <LightMode sx={{ color: '#FFFFFF' }} /> : <DarkMode />}
          </IconButton>
        </Box>
      </Box>
    
      {/* Logo */}
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          position: 'absolute',
          top: 10,
          left: 40,
          width: 80,
          height: 'auto',
          filter: darkMode ? 'invert(1)' : 'none',
        }}
        onClick={() => {
          window.location.href = "/";
        }}
      />
      {/* Login and Signup Buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          gap: 2,
        }}
      >
        <Button
            variant="contained"
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              backgroundColor: darkMode ? '#555' : '#FF6F61',
              color: '#fff',
              '&:hover': {
                backgroundColor: darkMode ? '#666' : '#FF6F61',
              },
              width: '60%',
              maxWidth: 900,
              height: '60px',
            }}
            onClick={() => navigate('/login')}
            startIcon={<LoginIcon />} 
          >
            Login
          </Button>
          <Button
          variant="contained"
          sx={{
            fontWeight: 'bold',
            fontSize: '1rem',
            backgroundColor: darkMode ? '#555' : '#FF6F61',
            color: '#fff',
            '&:hover': {
              backgroundColor: darkMode ? '#666' : '#FF6F61',
            },
            width: '60%',
          maxWidth: 900,
          height: '60px',
          }}
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
      </Box>

      {/* Content (Boş alan) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: darkMode ? '#f5f5f5' : '#333',
          }}
        >
          About Us Page
        </Typography>
      </Box>

     {/* Footer */}
     <Box
        sx={{
          width: '100%',
          padding: '50px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: darkMode ? '#333' : '#FF6F61',
        }}
      >
        <Typography variant="body2" sx={{ color: darkMode ? '#f5f5f5' : '#fff' }}>
          © 2024 Bring. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AboutPage;
