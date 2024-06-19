import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Login from 'features/auth/Login';

const renderWithProviders = (ui, { ...options } = {}) => {
  return render(
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>{ui}</BrowserRouter>
    </SnackbarProvider>,
    options
  );
};

test('renders Login component', () => {
  renderWithProviders(<Login />);

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

test('shows error messages on invalid form submission', () => {
  renderWithProviders(<Login />);

  fireEvent.click(screen.getByText(/login/i));

  expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
  expect(screen.getByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
});
