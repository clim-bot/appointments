import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { TextField, Button, Container, Typography, Box, FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setError('');

    let isValid = true;
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
      const response = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.error === "Account is not activated") {
        setError('Account is not activated. Please check your email.');
        enqueueSnackbar('Account is not activated. Please check your email.', { variant: 'error' });
      } else {
        setError('Invalid email or password');
        enqueueSnackbar('Login failed. Please check your credentials.', { variant: 'error' });
      }
    }
  };

  const handleForgotPasswordSubmit = async () => {
    if (!validateEmail(forgotPasswordEmail)) {
      enqueueSnackbar('Invalid email address', { variant: 'error' });
      return;
    }

    try {
      await axiosInstance.post('/auth/forgot-password', { email: forgotPasswordEmail });
      enqueueSnackbar('If the email exists, a reset password link has been sent.', { variant: 'info' });
      setForgotPasswordDialogOpen(false);
    } catch (error) {
      enqueueSnackbar('Error sending reset password email. Please try again later.', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center">Login</Typography>
        <form onSubmit={handleSubmit}>
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
              Login
            </Button>
          </Box>
          <Box mt={2}>
            <Typography align="center">
              Don't have an account? <Button onClick={() => navigate('/register')}>Register</Button>
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography align="center">
              <Button onClick={() => setForgotPasswordDialogOpen(true)}>Forgot Password?</Button>
            </Typography>
          </Box>
        </form>
      </Box>
      <Dialog open={forgotPasswordDialogOpen} onClose={() => setForgotPasswordDialogOpen(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email address. If the email exists, a reset password link will be sent.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotPasswordDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleForgotPasswordSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
