import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, MenuItem
} from '@mui/material';
import usStates from '../../data/usStates.json';
import axiosInstance from '../../api/axiosInstance';

const EditClientDialog = ({ open, handleClose, fetchClients, setSnackbar, client }) => {
  const [currentClient, setCurrentClient] = useState(client);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (client) {
      setCurrentClient(client);
    }
  }, [client]);

  const validateClient = () => {
    const errors = {};
    if (!currentClient.name) errors.name = 'Name is required';
    if (!currentClient.address) errors.address = 'Address is required';
    if (!currentClient.state) errors.state = 'State is required';
    if (!currentClient.zip_code) errors.zip_code = 'Zip code is required';
    if (!/^\d{5}(-\d{4})?$/.test(currentClient.zip_code)) errors.zip_code = 'Zip code is invalid';
    if (currentClient.phone_number && !/^\d{3}-\d{3}-\d{4}$/.test(currentClient.phone_number)) {
      errors.phone_number = 'Phone number is invalid';
    }
    return errors;
  };

  const handleSaveClient = async () => {
    const errors = validateClient();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await axiosInstance.put(`/clients/${currentClient.id}`, currentClient);
      setSnackbar({ message: 'Client updated successfully', severity: 'success' });
      fetchClients();
      handleClose();
    } catch (error) {
      console.error('Save client error', error);
      setSnackbar({ message: 'Error saving client', severity: 'error' });
    }
  };

  if (!currentClient) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Client</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={currentClient.name}
          onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
          fullWidth
          margin="normal"
          error={!!validationErrors.name}
          helperText={validationErrors.name}
        />
        <TextField
          label="Address"
          value={currentClient.address}
          onChange={(e) => setCurrentClient({ ...currentClient, address: e.target.value })}
          fullWidth
          margin="normal"
          error={!!validationErrors.address}
          helperText={validationErrors.address}
        />
        <TextField
          select
          label="State"
          value={currentClient.state}
          onChange={(e) => setCurrentClient({ ...currentClient, state: e.target.value })}
          fullWidth
          margin="normal"
          error={!!validationErrors.state}
          helperText={validationErrors.state}
        >
          {usStates.map((state) => (
            <MenuItem key={state.abbreviation} value={state.abbreviation}>
              {state.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Zip Code"
          value={currentClient.zip_code}
          onChange={(e) => setCurrentClient({ ...currentClient, zip_code: e.target.value })}
          fullWidth
          margin="normal"
          error={!!validationErrors.zip_code}
          helperText={validationErrors.zip_code}
        />
        <TextField
          label="Phone"
          value={currentClient.phone_number}
          onChange={(e) => setCurrentClient({ ...currentClient, phone_number: e.target.value })}
          fullWidth
          margin="normal"
          error={!!validationErrors.phone_number}
          helperText={validationErrors.phone_number}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleSaveClient} color="secondary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClientDialog;
