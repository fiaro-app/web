import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('is named by its label, not by the icon', () => {
    render(<IconButton label="Siguiente" icon="→" />);

    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
  });

  it('responds to a click and defaults to type="button"', async () => {
    const onClick = vi.fn();
    render(<IconButton label="Siguiente" icon="→" onClick={onClick} />);

    const button = screen.getByRole('button', { name: 'Siguiente' });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('does not respond when disabled', async () => {
    const onClick = vi.fn();
    render(<IconButton label="Siguiente" icon="→" disabled onClick={onClick} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});
