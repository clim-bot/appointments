import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, Typography
} from '@mui/material';
import axiosInstance from '../../api/axiosInstance';

const DeleteClientDialog = ({ open, handleClose, fetchClients, setSnackbar, client }) => {
  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/clients/${client.id}`);
      setSnackbar({ message: 'Client deleted successfully', severity: 'success' });
      fetchClients();
      handleClose();
    } catch (error) {
      console.error('Delete client error', error);
      setSnackbar({ message: 'Error deleting client', severity: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this client?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleConfirmDelete} color="secondary">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteClientDialog;
