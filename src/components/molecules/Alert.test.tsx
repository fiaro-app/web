import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('announces errors immediately', () => {
    render(<Alert tone="error">No se pudo guardar.</Alert>);

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar.');
  });

  it.each([
    ['success', 'text-success'],
    ['warning', 'text-warning'],
    ['info', 'text-primary'],
  ] as const)('announces %s politely, in its own color', (tone, colorClass) => {
    render(<Alert tone={tone}>Mensaje</Alert>);

    expect(screen.getByRole('status')).toHaveClass(colorClass);
  });

  it('defaults to info', () => {
    render(<Alert>Mensaje</Alert>);

    expect(screen.getByRole('status')).toHaveClass('text-primary');
  });
});
