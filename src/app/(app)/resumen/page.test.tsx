import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SummaryPage from './page';

describe('Summary page', () => {
  it('shows the placeholder until the dashboard is built', () => {
    render(<SummaryPage />);

    expect(screen.getByRole('heading', { name: 'Estamos preparando tu resumen' })).toBeInTheDocument();
  });
});
