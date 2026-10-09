import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import NewClientPage from './page';

vi.mock('@/components/organisms/ClientForm', () => ({ ClientForm: () => <form aria-label="Registrar cliente" /> }));

describe('New client page', () => {
  it('shows the form next to the informative aside', () => {
    render(<NewClientPage />);

    expect(screen.getByRole('form', { name: 'Registrar cliente' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { hidden: true })).toBeInTheDocument();
  });
});
