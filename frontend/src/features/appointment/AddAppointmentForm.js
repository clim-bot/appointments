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
  const [errors, setErrors] = useState({});

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

  const validate = () => {
    const errors = {};
    if (!appointment.schedule_name) errors.schedule_name = 'Schedule name is required';
    if (!appointment.client_id) errors.client_id = 'Client is required';
    if (!appointment.service_id) errors.service_id = 'Service is required';
    if (!appointment.schedule_date) errors.schedule_date = 'Schedule date is required';
    if (!appointment.schedule_time) errors.schedule_time = 'Schedule time is required';

    const scheduleDate = new Date(appointment.schedule_date);
    const scheduleTime = appointment.schedule_time;

    if (scheduleDate.getDay() === 0) {
      errors.schedule_date = 'No work on Sundays';
    }
    if (scheduleDate.getDay() === 6) {
      errors.schedule_date = 'No work on Saturdays';
    }

    const [hours, minutes] = scheduleTime.split(':');
    if (hours < 7 || (hours >= 16 && minutes > 0)) {
      errors.schedule_time = 'Appointment must be within business hours (7 AM - 4 PM)';
    }

    const holidays = [
      '2024-01-01', // New Year's Day
      '2024-12-25', // Christmas
      '2024-11-28', // Thanksgiving
      '2024-09-02', // Labor Day
      '2024-11-11', // Veterans Day
      '2024-07-04', // 4th of July
    ];

    if (holidays.includes(appointment.schedule_date)) {
      errors.schedule_date = 'No work on holidays';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log('Appointment Data:', appointment); // Log the appointment data
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
          error={!!errors.schedule_name}
          helperText={errors.schedule_name}
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
          error={!!errors.client_id}
          helperText={errors.client_id}
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
          error={!!errors.service_id}
          helperText={errors.service_id}
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
          error={!!errors.schedule_date}
          helperText={errors.schedule_date}
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
          error={!!errors.schedule_time}
          helperText={errors.schedule_time}
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
