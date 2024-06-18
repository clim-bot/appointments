import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
  Container, Typography, Box, CircularProgress, Button, Table, TableBody, TableCell, TableHead, TableRow,
  TableContainer, TableSortLabel, TablePagination, TextField, Paper, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AddClientDialog from './AddClientDialog';
import EditClientDialog from './EditClientDialog';
import DeleteClientDialog from './DeleteClientDialog';

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
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Fetch clients error', error);
    }
    setLoading(false);
  };

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

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleOpenEditDialog = (client) => {
    setCurrentClient(client);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentClient(null);
  };

  const handleOpenDeleteDialog = (client) => {
    setCurrentClient(client);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCurrentClient(null);
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
        <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
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
                        <Button variant="outlined" color="primary" onClick={() => handleOpenEditDialog(client)}>
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
      <AddClientDialog
        open={addDialogOpen}
        handleClose={handleCloseAddDialog}
        fetchClients={fetchClients}
        setSnackbar={({ message, severity }) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
      />
      <EditClientDialog
        open={editDialogOpen}
        handleClose={handleCloseEditDialog}
        fetchClients={fetchClients}
        setSnackbar={({ message, severity }) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
        client={currentClient}
      />
      <DeleteClientDialog
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        fetchClients={fetchClients}
        setSnackbar={({ message, severity }) => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setSnackbarOpen(true);
        }}
        client={currentClient}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientList;
