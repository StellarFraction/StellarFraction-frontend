import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the investor dashboard', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /tokenized yield-bearing real estate/i }),
    ).toBeInTheDocument();
  });
});
