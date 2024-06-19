import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    try {
      await axiosInstance.post('/auth/reset-password', { token, newPassword, confirmPassword });
      enqueueSnackbar('Password reset successfully', { variant: 'success' });
      navigate('/login');
    } catch (error) {
      enqueueSnackbar('Failed to reset password', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center">Reset Password</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Reset Password
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;
