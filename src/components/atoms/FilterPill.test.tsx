import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterPill } from './FilterPill';

describe('FilterPill', () => {
  it('announces whether it is selected', () => {
    const { rerender } = render(<FilterPill>Mora</FilterPill>);
    expect(screen.getByRole('button', { name: 'Mora' })).toHaveAttribute('aria-pressed', 'false');

    rerender(<FilterPill selected>Mora</FilterPill>);
    expect(screen.getByRole('button', { name: 'Mora' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('responds to a click unless disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<FilterPill onClick={onClick}>Mora</FilterPill>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <FilterPill disabled onClick={onClick}>
        Mora
      </FilterPill>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
