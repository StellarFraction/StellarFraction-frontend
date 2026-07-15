import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the investor dashboard and navigates to portfolio page', () => {
    render(<App />);

    // Check default page has property catalog heading
    expect(
      screen.getByRole('heading', { name: /property catalog/i }),
    ).toBeInTheDocument();

    // Navigate to portfolio page
    const portfolioTab = screen.getByRole('button', { name: /portfolio/i });
    fireEvent.click(portfolioTab);

    // Check portfolio pulse heading is rendered
    expect(screen.getByRole('heading', { name: /portfolio pulse/i })).toBeInTheDocument();
  });
});
