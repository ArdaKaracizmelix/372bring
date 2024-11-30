import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DarkMode, LightMode } from '@mui/icons-material';
  import logo from './assets/logo.png';
  import appstore from './assets/appstore.png';
  import googleplay from './assets/googleplay.png';
  import huawei from './assets/huawei.png';
  import slide1 from './assets/slide1.jpg';
  import slide2 from './assets/slide2.png';
  import slide3 from './assets/slide3.jpg';
  import X from './assets/X.png';
  import fbook from './assets/fbook.png';
  import LoginIcon from '@mui/icons-material/Login';
  import insta from './assets/insta.png';
const LandingPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [slide1, slide2, slide3];

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

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

  
      <Box
  sx={{
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
  }}
>
  {/* Why Vault Bölümü */}
        <Box
          sx={{
            flex: 1,
            maxWidth: '50%',
            padding: '20px',
            border: `2px solid ${darkMode ? '#f5f5f5' : '#333'}`,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#222' : '#fff',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: darkMode ? '#f5f5f5' : '#333',
              marginBottom: 3,
            }}
          >
            Why Bring?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: darkMode ? '#aaa' : '#555',
              marginBottom: 3,
              fontSize: '1.2rem',
            }}
          >
           Why Bring?
           Bring is your go-to platform for secure, seamless, and customer-first online food ordering. Experience a smarter, faster, and more enjoyable way to satisfy your cravings with Bring.
          </Typography>
        </Box>

        {/* Slide Gösterimi */}
        <Box
          sx={{
            flex: 1,
            maxWidth: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src={slides[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            sx={{
              width: '90%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 12px 10px rgba(0, 0, 0, 0.3)',
            }}
          />
        </Box>
      </Box>


  {/* Footer */}
<Box
  sx={{
    width: '100%',
    padding: '31px 0',
    display: 'flex',
    justifyContent: 'space-between', // İki tarafı birbirinden ayırır
    alignItems: 'center',
    backgroundColor: darkMode ? '#333' : '#FF6F61',
    borderRadius: '0 0 12px 12px',
  }}
>
  {/* Sol Kısım - Uygulama İndirme */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      paddingLeft: '20px', // Sol kenardan biraz içeri almak için
    }}
  >
    <Typography
      sx={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: darkMode ? '#f5f5f5' : '#333',
      }}
    >
      Don't Forget to Download Our App:
    </Typography>
    <Box
      sx={{
        display: 'flex',
        gap: 2, // İkonlar arası boşluk
      }}
    >
      <Box
        component="img"
        src={appstore}
        alt="AppStore"
        sx={{
          width: '120px',
          borderRadius: 4,
        }}
      />
      <Box
        component="img"
        src={googleplay}
        alt="PlayStore"
        sx={{
          width: '120px',
          borderRadius: 4,
        }}
      />
      <Box
        component="img"
        src={huawei}
        alt="Huawei"
        sx={{
          width: '120px',
          borderRadius: 4,
        }}
      />
    </Box>
  </Box>

  {/* Sağ Kısım - Sosyal Medya */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      paddingRight: '100px', // Sağ kenardan biraz içeri almak için
    }}
  >
    <Typography
      sx={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: darkMode ? '#f5f5f5' : '#333',
      }}
    >
      Don't Forget to Follow Us:
    </Typography>
    <Box
      sx={{
        display: 'flex',
        gap: 2, // İkonlar arası boşluk
      }}
    >
      <Box
        component="img"
        src={X}
        alt="X"
        sx={{
          width: '60px',
          height: '40px', // Eşit yükseklik ve genişlik
          borderRadius: 4,
        }}
      />
      <Box
        component="img"
        src={fbook}
        alt="Facebook"
        sx={{
          width: '40px',
          height: '40px', // Eşit yükseklik ve genişlik
          borderRadius: 4,
        }}
      />
      <Box
        component="img"
        src={insta}
        alt="Instagram"
        sx={{
          width: '40px',
          height: '40px', // Eşit yükseklik ve genişlik
          borderRadius: 4,
        }}
      />
    </Box>
  </Box>
</Box>

        
     
    </Box>
  );
};

export default LandingPage;
