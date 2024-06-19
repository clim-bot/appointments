import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useSnackbar } from 'notistack';

const Reports = () => {
  const [client, setClient] = useState('');
  const { enqueueSnackbar } = useSnackbar();

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
        <TextField
          label="Client Name"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          fullWidth
          margin="normal"
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
