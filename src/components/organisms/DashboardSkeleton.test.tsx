import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DashboardSkeleton } from './DashboardSkeleton';

describe('DashboardSkeleton', () => {
  it('announces that the summary is loading', () => {
    render(<DashboardSkeleton />);

    expect(screen.getByRole('status', { name: 'Cargando el resumen' })).toBeInTheDocument();
  });
});
