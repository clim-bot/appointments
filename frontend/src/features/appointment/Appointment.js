import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Drawer, Snackbar, CircularProgress, Alert
} from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '../../api/axiosInstance';
import AddAppointmentForm from './AddAppointmentForm';
import AppointmentTile from './AppointmentTile';
import AppointmentDetailsPanel from './AppointmentDetailsPanel';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/appointments');
      const formattedAppointments = response.data.appointments.map(appointment => ({
        ...appointment,
        start: new Date(appointment.schedule_date),
        end: new Date(appointment.schedule_date),
        title: `${appointment.service.name}\n${appointment.client.name}\n${appointment.schedule_time}`
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Fetch appointments error', error);
    }
    setLoading(false);
  };

  const handleSelectEvent = (appointment) => {
    if (view === Views.MONTH) {
      setDate(new Date(appointment.start));
      setView(Views.WEEK);
    } else if (view === Views.WEEK || view === Views.DAY) {
      setSelectedAppointment(appointment);
      setDrawerOpen(true);
    }
  };

  const handleNavigate = (newDate, newView) => {
    setDate(newDate);
    setView(newView);
  };

  const handleDeleteAppointment = async () => {
    try {
      await axiosInstance.delete(`/appointments/${selectedAppointment.id}`);
      setSnackbarMessage('Appointment deleted successfully');
      setSnackbarSeverity('success');
      setAppointments(prev => prev.filter(appt => appt.id !== selectedAppointment.id));
      handleCloseDrawer();
    } catch (error) {
      console.error('Delete appointment error', error);
      setSnackbarMessage('Error deleting appointment');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
    setDeleteDialogOpen(false);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedAppointment(null);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const eventStyleGetter = () => {
    const style = {
      backgroundColor: '#3174ad',
      color: 'white',
      borderRadius: '5px',
      border: 'none',
      display: 'block',
      padding: '5px'
    };
    return { style };
  };

  const components = {
    event: AppointmentTile
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Appointments</Typography>
        <Button variant="contained" color="primary" onClick={() => setDrawerOpen(true)}>
          Add Appointment
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Calendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'auto', minHeight: 500 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            components={components}
            view={view}
            onNavigate={handleNavigate}
            date={date}
            onView={setView}
          />
        </Paper>
      )}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: 400, top: 64 } }} // Adjusted the top position to avoid the header bar
      >
        {selectedAppointment ? (
          <AppointmentDetailsPanel
            appointment={selectedAppointment}
            onClose={handleCloseDrawer}
            onOpenDeleteDialog={handleOpenDeleteDialog}
          />
        ) : (
          <AddAppointmentForm handleClose={handleCloseDrawer} fetchAppointments={fetchAppointments} />
        )}
      </Drawer>
      <DeleteAppointmentDialog
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleConfirmDelete={handleDeleteAppointment}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Schedule;
