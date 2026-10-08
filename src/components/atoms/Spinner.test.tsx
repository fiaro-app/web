import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('announces itself as a status by default', () => {
    render(<Spinner />);

    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
  });

  it('stays out of the accessibility tree when decorative', () => {
    render(<Spinner decorative />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
