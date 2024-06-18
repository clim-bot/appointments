import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const DeleteAppointmentDialog = ({ open, handleClose, handleConfirmDelete }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this appointment?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">Cancel</Button>
      <Button onClick={handleConfirmDelete} color="secondary">Confirm</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteAppointmentDialog;
