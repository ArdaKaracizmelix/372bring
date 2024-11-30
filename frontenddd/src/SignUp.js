import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      alert('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/customers/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully!');
        navigate('/');
      } else {
        alert(data.message || 'Error creating account.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while signing up.');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF6F61',
      }}
    >
      <Box
        sx={{
          width: 350,
          padding: 4,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
          Sign Up
        </Typography>
        <TextField
          fullWidth
          label="Name"
          type="text"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Phone Number"
          type="text"
          variant="outlined"
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          fullWidth
          label="Address"
          type="text"
          variant="outlined"
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: 2, backgroundColor: '#FF6F61' }}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
        <Typography
          variant="body2"
          sx={{ marginTop: 2, textAlign: 'center' }}
        >
          Already have an account?{' '}
          <Button
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', textTransform: 'none' }}
          >
            Login
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
