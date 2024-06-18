import React from 'react';
import {
  Box, Typography, IconButton, Link, Divider, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AppointmentDetailsPanel = ({ appointment, onClose, onOpenDeleteDialog }) => {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes} ${period}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Appointment Details</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box mt={2}>
        <Typography variant="body1"><strong>Schedule Name:</strong> {appointment.schedule_name}</Typography>
        <Typography variant="body1"><strong>Description:</strong> {appointment.description}</Typography>
        <Typography variant="body1"><strong>Client's Name:</strong> {appointment.client.name}</Typography>
        <Typography variant="body1"><strong>Service Name:</strong> {appointment.service.name}</Typography>
        <Typography variant="body1"><strong>Schedule Date:</strong> {appointment.schedule_date.split('T')[0]}</Typography>
        <Typography variant="body1"><strong>Schedule Time:</strong> {formatTime(appointment.schedule_time)}</Typography>
      </Box>
      <Box mt={2}>
        <Link component="button" variant="body2" onClick={onOpenDeleteDialog} color="error">
          Delete Appointment
        </Link>
      </Box>
    </Paper>
  );
};

export default AppointmentDetailsPanel;
