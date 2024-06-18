import React from 'react';
import { Container } from '@mui/material';
import Layout from '../../components/Layout';
import ClientList from './ClientList';

function Dashboard() {
  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <ClientList />
      </Container>
    </Layout>
  );
}

export default Dashboard;
