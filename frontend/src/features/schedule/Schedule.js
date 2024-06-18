import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Container, Button, Drawer, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import AddAppointmentForm from './AddAppointmentForm';
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/appointments');
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Fetch appointments error', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectEvent = (appointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
  };

  const handleDeleteAppointment = async () => {
    try {
      await axiosInstance.delete(`/appointments/${selectedAppointment.id}`);
      setAppointments(appointments.filter(appointment => appointment.id !== selectedAppointment.id));
      setConfirmDialogOpen(false);
      setDrawerOpen(false);
    } catch (error) {
      console.error('Delete appointment error', error);
    }
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const events = appointments.map(appointment => ({
    ...appointment,
    title: `${appointment.service.name} - ${appointment.client.name}`,
    start: new Date(appointment.schedule_date),
    end: new Date(new Date(appointment.schedule_date).getTime() + 60 * 60 * 1000) // Assuming each appointment is 1 hour
  }));

  return (
    <Container>
      {!drawerOpen && (
        <Button variant="contained" color="primary" onClick={handleAddAppointment} sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}>
          Add Appointment Request
        </Button>
      )}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, margin: '50px 0' }}
        onSelectEvent={handleSelectEvent}
      />
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          '& .MuiDrawer-paper': {
            width: 500,
            boxSizing: 'border-box',
            zIndex: (theme) => theme.zIndex.drawer + 2,
            position: 'absolute',
            top: 0,
            height: '100vh',
          },
        }}
      >
        <Box sx={{ width: 500, padding: 2 }}>
          {selectedAppointment ? (
            <>
              <Typography variant="h6">{selectedAppointment.schedule_name}</Typography>
              <Typography variant="body1">{selectedAppointment.description}</Typography>
              <Button onClick={() => setConfirmDialogOpen(true)} color="secondary">
                Delete Appointment
              </Button>
            </>
          ) : (
            <AddAppointmentForm onClose={handleCloseDrawer} />
          )}
        </Box>
      </Drawer>
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this appointment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAppointment} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Schedule;
