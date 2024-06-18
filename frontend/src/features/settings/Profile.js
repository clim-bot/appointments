import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, CardHeader, Avatar, Typography, CircularProgress, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Fetch user error', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : user ? (
        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
          <CardHeader
            avatar={
              <Avatar aria-label="user">
                {user.name.charAt(0)}
              </Avatar>
            }
            title={user.name}
            subheader={user.email}
          />
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              This is the profile page of {user.name}.
            </Typography>
            <Button component={Link} to="/settings/change-password" variant="contained" color="primary" sx={{ mt: 2 }}>
              Change Password
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" align="center">
          Error loading user data.
        </Typography>
      )}
    </Container>
  );
}

export default Profile;
