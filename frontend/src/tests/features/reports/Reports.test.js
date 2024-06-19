import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import axiosInstance from 'api/axiosInstance';
import Reports from 'features/reports/Reports';

jest.mock('api/axiosInstance');

const renderWithProviders = (ui, { ...options } = {}) => {
  return render(
    <SnackbarProvider maxSnack={3}>
      {ui}
    </SnackbarProvider>,
    options
  );
};

test('renders Reports component', () => {
  renderWithProviders(<Reports />);

  expect(screen.getByLabelText(/client name/i)).toBeInTheDocument();
  expect(screen.getByText(/download report/i)).toBeInTheDocument();
});

test('shows error message when client name is not provided', () => {
  renderWithProviders(<Reports />);

  fireEvent.click(screen.getByText(/download report/i));

  expect(screen.getByText(/please provide the client name/i)).toBeInTheDocument();
});

test('downloads report when client name is provided', async () => {
  const blob = new Blob(['test data'], { type: 'text/csv' });
  axiosInstance.get.mockResolvedValueOnce({ data: blob });

  renderWithProviders(<Reports />);

  fireEvent.change(screen.getByLabelText(/client name/i), { target: { value: 'John Doe' } });
  fireEvent.click(screen.getByText(/download report/i));

  await waitFor(() => {
    expect(screen.getByText(/report downloaded successfully/i)).toBeInTheDocument();
  });
});

test('shows error message when client name is not found', async () => {
  axiosInstance.get.mockRejectedValueOnce({ response: { status: 404 } });

  renderWithProviders(<Reports />);

  fireEvent.change(screen.getByLabelText(/client name/i), { target: { value: 'Unknown Client' } });
  fireEvent.click(screen.getByText(/download report/i));

  await waitFor(() => {
    expect(screen.getByText(/cannot find client name, report cannot be downloaded/i)).toBeInTheDocument();
  });
});
