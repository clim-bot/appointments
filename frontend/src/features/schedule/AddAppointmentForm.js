import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, MenuItem, IconButton } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import CloseIcon from '@mui/icons-material/Close';

const AddAppointmentForm = ({ onClose }) => {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    schedule_name: '',
    description: '',
    client_id: '',
    service_id: '',
    schedule_date: ''
  });

  useEffect(() => {
    const fetchClientsAndServices = async () => {
      try {
        const clientsResponse = await axiosInstance.get('/clients');
        const servicesResponse = await axiosInstance.get('/services');
        setClients(clientsResponse.data.clients);
        setServices(servicesResponse.data.services);
      } catch (error) {
        console.error('Fetch clients and services error', error);
      }
    };

    fetchClientsAndServices();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/appointments', formData);
      onClose();
    } catch (error) {
      console.error('Add appointment error', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Typography variant="h6">Add Appointment Request</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <TextField
        label="Schedule Name"
        name="schedule_name"
        value={formData.schedule_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        sx={{ maxWidth: 400 }}
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        sx={{ maxWidth: 400 }}
      />
      <TextField
        select
        label="Client"
        name="client_id"
        value={formData.client_id}
        onChange={handleChange}
        fullWidth
        margin="normal"
        sx={{ maxWidth: 400 }}
      >
        {clients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Service"
        name="service_id"
        value={formData.service_id}
        onChange={handleChange}
        fullWidth
        margin="normal"
        sx={{ maxWidth: 400 }}
      >
        {services.map((service) => (
          <MenuItem key={service.id} value={service.id}>
            {service.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Schedule Date"
        name="schedule_date"
        type="datetime-local"
        value={formData.schedule_date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ maxWidth: 400 }}
      />
      <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ maxWidth: 400 }}>
          Request
        </Button>
        <Button variant="outlined" color="secondary" fullWidth onClick={onClose} sx={{ mt: 1, maxWidth: 400 }}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddAppointmentForm;
