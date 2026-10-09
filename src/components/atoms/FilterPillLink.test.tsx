import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FilterPillLink } from './FilterPillLink';

describe('FilterPillLink', () => {
  it('renders a link to the filtered url', () => {
    render(<FilterPillLink href="/prestamos?estado=ACTIVE">Activos</FilterPillLink>);
    expect(screen.getByRole('link', { name: 'Activos' })).toHaveAttribute('href', '/prestamos?estado=ACTIVE');
  });

  it('marks the selected filter with aria-current and the brand fill', () => {
    render(<FilterPillLink href="/x" selected>Activos</FilterPillLink>);
    const link = screen.getByRole('link', { name: 'Activos' });
    expect(link).toHaveAttribute('aria-current', 'true');
    expect(link).toHaveClass('bg-primary');
  });

  it('is not marked when unselected', () => {
    render(<FilterPillLink href="/x">Todos</FilterPillLink>);
    expect(screen.getByRole('link', { name: 'Todos' })).not.toHaveAttribute('aria-current');
  });
});
