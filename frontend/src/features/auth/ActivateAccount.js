import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Container, Typography, Box, CircularProgress, Button } from '@mui/material';
import { useSnackbar } from 'notistack';

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid activation link');
      setLoading(false);
      return;
    }

    const activateAccount = async () => {
      try {
        await axiosInstance.post('/auth/activate-account', { token });
        enqueueSnackbar('Account activated successfully! You can now log in.', { variant: 'success' });
        navigate('/login');
      } catch (error) {
        setError('Invalid or expired activation link');
        enqueueSnackbar('Activation failed. Please try again.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [enqueueSnackbar, navigate, searchParams]);

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" align="center">{error}</Typography>
        ) : (
          <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ActivateAccount;
