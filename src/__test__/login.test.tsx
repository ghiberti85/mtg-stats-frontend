import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../pages/login';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Login Page', () => {
  it('renders the login form', () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });
});
