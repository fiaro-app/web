import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListSkeleton } from './ListSkeleton';

describe('ListSkeleton', () => {
  it('announces that the list is loading and draws eight placeholder rows', () => {
    render(<ListSkeleton />);

    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
  });
});
