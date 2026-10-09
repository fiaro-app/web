import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TextButton } from './TextButton';

describe('TextButton', () => {
  it('responds to a click and defaults to type="button"', async () => {
    const onClick = vi.fn();
    render(<TextButton onClick={onClick}>Cancelar</TextButton>);

    const button = screen.getByRole('button', { name: 'Cancelar' });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('does not respond when disabled', async () => {
    const onClick = vi.fn();
    render(
      <TextButton disabled onClick={onClick}>
        Cancelar
      </TextButton>,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});
