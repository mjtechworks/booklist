import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import Toast, { ToastProps} from './components/Toast'

const toast = {
  message: "hello",
  type: "success",
  open: true
}

test('renders learn react link', () => {
  render(<Toast {...toast} />);
});
