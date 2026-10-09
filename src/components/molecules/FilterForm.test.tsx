import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FilterForm } from './FilterForm';
import { FilterSubmitButton } from './FilterSubmitButton';

function setup() {
  render(
    <FilterForm action="/cobros" aria-label="Filtros">
      <input aria-label="Texto" name="q" defaultValue="" />
      <FilterSubmitButton>Aplicar</FilterSubmitButton>
    </FilterForm>,
  );
  return screen.getByRole('button', { name: 'Aplicar' });
}

describe('FilterForm', () => {
  it('turns the apply button off while there is nothing new to apply', () => {
    expect(setup()).toBeDisabled();
  });

  it('turns it on when something changes and off again when the change is undone', async () => {
    const apply = setup();
    await userEvent.type(screen.getByLabelText('Texto'), 'ana');
    expect(apply).toBeEnabled();

    await userEvent.clear(screen.getByLabelText('Texto'));
    expect(apply).toBeDisabled();
  });
});
