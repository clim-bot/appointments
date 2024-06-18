import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, MenuItem
} from '@mui/material';
import usStates from '../../data/usStates.json';
import axiosInstance from '../../api/axiosInstance';

const AddClientDialog = ({ open, handleClose, fetchClients, setSnackbar }) => {
  const [client, setClient] = useState({ name: '', address: '', state: '', zip_code: '', phone_number: '' });
  const [validationErrors, setValidationErrors] = useState({});

  const validateClient = () => {
    const errors = {};
    if (!client.name) errors.name = 'Name is required';
    if (!client.address) errors.address = 'Address is required';
    if (!client.state) errors.state = 'State is required';
    if (!client.zip_code) errors.zip_code = 'Zip code is required';
    if (!/^\d{5}(-\d{4})?$/.test(client.zip_code)) errors.zip_code = 'Zip code is invalid';
    if (client.phone_number && !/^\d{3}-\d{3}-\d{4}$/.test(client.phone_number)) {
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
      await axiosInstance.post('/clients', client);
      setSnackbar({ message: 'Client added successfully', severity: 'success' });
      fetchClients();
      handleClose();
    } catch (error) {
      console.error('Save client error', error);
      setSnackbar({ message: 'Error saving client', severity: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Client</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={client.name}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
          fullWidth
          margin="normal"
          error={!!validationErrors.name}
          helperText={validationErrors.name}
        />
        <TextField
          label="Address"
          value={client.address}
          onChange={(e) => setClient({ ...client, address: e.target.value })}
          fullWidth
          margin="normal"
          error={!!validationErrors.address}
          helperText={validationErrors.address}
        />
        <TextField
          select
          label="State"
          value={client.state}
          onChange={(e) => setClient({ ...client, state: e.target.value })}
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
          value={client.zip_code}
          onChange={(e) => setClient({ ...client, zip_code: e.target.value })}
          fullWidth
          margin="normal"
          error={!!validationErrors.zip_code}
          helperText={validationErrors.zip_code}
        />
        <TextField
          label="Phone"
          value={client.phone_number}
          onChange={(e) => setClient({ ...client, phone_number: e.target.value })}
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

export default AddClientDialog;
