import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, Autocomplete } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useSnackbar } from 'notistack';

const Reports = () => {
  const [client, setClient] = useState('');
  const [clientOptions, setClientOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosInstance.get('/clients');
        setClientOptions(response.data.clients);
      } catch (error) {
        console.error('Error fetching clients', error);
      }
    };

    fetchClients();
  }, []);

  const handleDownloadReport = async () => {
    if (!client) {
      enqueueSnackbar('Please provide the client name.', { variant: 'error' });
      return;
    }

    try {
      const response = await axiosInstance.get('/download-report', {
        params: {
          client,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${client}_appointments.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      enqueueSnackbar('Report downloaded successfully.', { variant: 'success' });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        enqueueSnackbar('Cannot find client name, report cannot be downloaded.', { variant: 'error' });
      } else {
        enqueueSnackbar('Failed to download report.', { variant: 'error' });
      }
    }
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" align="center">Client Appointment Reports</Typography>
        <Autocomplete
          options={clientOptions.map((option) => option.name)}
          onInputChange={(event, newInputValue) => {
            setClient(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Client Name"
              margin="normal"
              fullWidth
            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleDownloadReport}
          sx={{ mt: 2 }}
        >
          Download Report
        </Button>
      </Box>
    </Container>
  );
};

export default Reports;
