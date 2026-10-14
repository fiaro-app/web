import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('accepts multi-line text', async () => {
    render(<Textarea aria-label="Comentario" />);
    await userEvent.type(screen.getByLabelText('Comentario'), 'Línea 1{enter}Línea 2');
    expect(screen.getByLabelText('Comentario')).toHaveValue('Línea 1\nLínea 2');
  });

  it('marks itself invalid for assistive tech', () => {
    render(<Textarea aria-label="Comentario" invalid />);
    expect(screen.getByLabelText('Comentario')).toHaveAttribute('aria-invalid', 'true');
  });

  it('is disabled when asked and uses a minimum height instead of the fixed single-line one', () => {
    render(<Textarea aria-label="Comentario" disabled />);
    const field = screen.getByLabelText('Comentario');
    expect(field).toBeDisabled();
    expect(field).toHaveClass('min-h-24');
    expect(field).not.toHaveClass('h-11');
  });
});
