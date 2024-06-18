import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, CardHeader, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/change-password', { password: newPassword }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/settings/profile');
    } catch (error) {
      setError('Error updating password');
      console.error('Error updating password', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <CardHeader title="Change Password" />
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Enter your new password and confirm it to update your password.
          </Typography>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
            <Button onClick={() => navigate('/settings/profile')} variant="outlined" color="secondary">
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChangePassword;
