import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Radio } from './Radio';

describe('Radio', () => {
  it('selects exactly one option of a group', async () => {
    render(
      <>
        <Radio name="frecuencia" aria-label="Diario" />
        <Radio name="frecuencia" aria-label="Semanal" />
      </>,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Diario' }));
    await userEvent.click(screen.getByRole('radio', { name: 'Semanal' }));

    expect(screen.getByRole('radio', { name: 'Diario' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Semanal' })).toBeChecked();
  });

  it('cannot be selected when disabled', async () => {
    render(<Radio name="frecuencia" aria-label="Diario" disabled />);
    const radio = screen.getByRole('radio');

    await userEvent.click(radio);

    expect(radio).toBeDisabled();
    expect(radio).not.toBeChecked();
  });
});
