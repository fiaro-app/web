import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DetailSkeleton } from './DetailSkeleton';

describe('DetailSkeleton', () => {
  it('announces that the screen is loading', () => {
    render(<DetailSkeleton />);

    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
    expect(screen.getByText('Cargando…')).toBeInTheDocument();
  });
});
