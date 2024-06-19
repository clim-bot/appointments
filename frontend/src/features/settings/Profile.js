import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Container, Card, CardContent, CardHeader, Avatar, Typography, CircularProgress, Box, Button } from '@mui/material';
import ChangePasswordModal from '../../components/ChangePasswordModal';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/settings'); // Adjust the endpoint if necessary
        setUser(response.data.user);
      } catch (error) {
        console.error('Fetch user error', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleOpenModal}>
              Change Password
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" align="center">
          Error loading user data.
        </Typography>
      )}
      <ChangePasswordModal open={isModalOpen} handleClose={handleCloseModal} />
    </Container>
  );
}

export default Profile;
