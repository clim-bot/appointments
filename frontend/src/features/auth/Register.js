import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { TextField, Button, Container, Typography, Box, FormControlLabel, Checkbox } from '@mui/material';
import { useSnackbar } from 'notistack';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setError('');

    let isValid = true;
    if (name.trim() === '') {
      setNameError('Name is required');
      isValid = false;
    }
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    if (!isValid) return;

    try {
      await axiosInstance.post('/auth/register', { name, email, password });
      enqueueSnackbar('Registration successful! Please check your email to activate your account.', { variant: 'success' });
      navigate('/login');
    } catch (error) {
      setError('Error registering user');
      enqueueSnackbar('Registration failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center">Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                color="primary"
              />
            }
            label="Show Password"
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </Box>
          <Box mt={2}>
            <Typography align="center">
              Already have an account? <Button onClick={() => navigate('/login')}>Login</Button>
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
