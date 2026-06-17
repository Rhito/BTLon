import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders correctly with label', () => {
    render(<Input id="test-input" label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input id="test-input" label="Email" error="Invalid email address" />);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('calls onChange handler when typed', () => {
    const handleChange = vi.fn();
    render(<Input id="test-input" label="Name" onChange={handleChange} />);
    
    const inputElement = screen.getByLabelText('Name');
    fireEvent.change(inputElement, { target: { value: 'John' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
