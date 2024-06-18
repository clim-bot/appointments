import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import usStates from '../../data/usStates.json';
import {
  Container, Typography, Box, CircularProgress, Button, Table, TableBody, TableCell, TableHead, TableRow,
  TableContainer, TableSortLabel, TablePagination, TextField, Paper, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState({ id: '', name: '', address: '', state: '', zip_code: '', phone_number: '' });
  const [dialogType, setDialogType] = useState('add'); // 'add' or 'edit'
  const [clientToDelete, setClientToDelete] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/clients');
        setClients(response.data.clients);
        setLoading(false);
      } catch (error) {
        console.error('Fetch clients error', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (client = { id: '', name: '', address: '', state: '', zip_code: '', phone_number: '' }, type = 'add') => {
    setCurrentClient(client);
    setDialogType(type);
    setValidationErrors({});
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentClient({ id: '', name: '', address: '', state: '', zip_code: '', phone_number: '' });
    setValidationErrors({});
  };

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
      if (dialogType === 'add') {
        await axiosInstance.post('/clients', currentClient);
        setSnackbarMessage('Client added successfully');
      } else {
        await axiosInstance.put(`/clients/${currentClient.id}`, currentClient);
        setSnackbarMessage('Client updated successfully');
      }
      setSnackbarSeverity('success');
      const response = await axiosInstance.get('/clients');
      setClients(response.data.clients);
      handleCloseDialog();
    } catch (error) {
      console.error('Save client error', error);
      setSnackbarMessage('Error saving client');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleOpenDeleteDialog = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/clients/${clientToDelete.id}`);
      const response = await axiosInstance.get('/clients');
      setClients(response.data.clients);
      setSnackbarMessage('Client deleted successfully');
      setSnackbarSeverity('success');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Delete client error', error);
      setSnackbarMessage('Error deleting client');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.state.toLowerCase().includes(search.toLowerCase()) ||
    client.zip_code.includes(search)
  );

  const sortedClients = filteredClients.sort((a, b) => {
    if (orderBy === 'name' || orderBy === 'state') {
      if (order === 'asc') {
        return a[orderBy].localeCompare(b[orderBy]);
      } else {
        return b[orderBy].localeCompare(a[orderBy]);
      }
    } else {
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    }
  });

  const paginatedClients = sortedClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Client List</Typography>
        <TextField
          label="Search"
          value={search}
          onChange={handleSearch}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add Client
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'state'}
                      direction={orderBy === 'state' ? order : 'asc'}
                      onClick={() => handleRequestSort('state')}
                    >
                      State
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'zip_code'}
                      direction={orderBy === 'zip_code' ? order : 'asc'}
                      onClick={() => handleRequestSort('zip_code')}
                    >
                      Zip Code
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedClients.length > 0 ? (
                  paginatedClients.map((client) => (
                    <TableRow key={client.id} hover role="checkbox" tabIndex={-1}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.address}</TableCell>
                      <TableCell>{client.state}</TableCell>
                      <TableCell>{client.zip_code}</TableCell>
                      <TableCell>{client.phone_number}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="primary" onClick={() => handleOpenDialog(client, 'edit')}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleOpenDeleteDialog(client)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={sortedClients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{dialogType === 'add' ? 'Add Client' : 'Edit Client'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={currentClient.name}
            onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
            fullWidth
            margin="normal"
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />
          <TextField
            label="Address"
            name="address"
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
            name="state"
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
            name="zip_code"
            value={currentClient.zip_code}
            onChange={(e) => setCurrentClient({ ...currentClient, zip_code: e.target.value })}
            fullWidth
            margin="normal"
            error={!!validationErrors.zip_code}
            helperText={validationErrors.zip_code}
          />
          <TextField
            label="Phone"
            name="phone_number"
            value={currentClient.phone_number}
            onChange={(e) => setCurrentClient({ ...currentClient, phone_number: e.target.value })}
            fullWidth
            margin="normal"
            error={!!validationErrors.phone_number}
            helperText={validationErrors.phone_number}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveClient} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this client?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientList;
