import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../api/axiosInstance';

const AddAppointmentForm = ({ handleClose, fetchAppointments }) => {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [appointment, setAppointment] = useState({
    schedule_name: '',
    description: '',
    client_id: '',
    service_id: '',
    schedule_date: '',
    schedule_time: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, servicesResponse] = await Promise.all([
          axiosInstance.get('/clients'),
          axiosInstance.get('/services')
        ]);
        setClients(clientsResponse.data.clients);
        setServices(servicesResponse.data.services);
      } catch (error) {
        console.error('Fetch clients and services error', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/appointments', appointment);
      fetchAppointments();
      handleClose();
    } catch (error) {
      console.error('Add appointment error', error);
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Add Appointment</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Schedule Name"
          name="schedule_name"
          value={appointment.schedule_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={appointment.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Client"
          name="client_id"
          value={appointment.client_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
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
          value={appointment.service_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
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
          type="date"
          value={appointment.schedule_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Schedule Time"
          name="schedule_time"
          type="time"
          value={appointment.schedule_time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddAppointmentForm;
