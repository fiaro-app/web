import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AmountInput } from './AmountInput';

function Controlled({ initial = null }: Readonly<{ initial?: number | null }>) {
  const [value, setValue] = useState<number | null>(initial);
  return <AmountInput aria-label="Monto" value={value} onValueChange={setValue} />;
}

describe('AmountInput', () => {
  it('shows the amount with thousands separators', () => {
    render(<AmountInput aria-label="Monto" value={1250000} onValueChange={() => {}} />);

    expect(screen.getByLabelText('Monto')).toHaveValue('1.250.000');
  });

  it('shows the "0" placeholder when empty', () => {
    render(<AmountInput aria-label="Monto" value={null} onValueChange={() => {}} />);

    expect(screen.getByLabelText('Monto')).toHaveAttribute('placeholder', '0');
  });

  it('reports typed digits as a number and reformats the text', async () => {
    render(<Controlled />);
    const input = screen.getByLabelText('Monto');

    await userEvent.type(input, '1250000');

    expect(input).toHaveValue('1.250.000');
  });

  it('ignores non-numeric characters', async () => {
    const onValueChange = vi.fn();
    render(<AmountInput aria-label="Monto" value={null} onValueChange={onValueChange} />);

    await userEvent.type(screen.getByLabelText('Monto'), 'a');

    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('reports null when the field is cleared', async () => {
    render(<Controlled initial={500} />);
    const input = screen.getByLabelText('Monto');

    await userEvent.clear(input);

    expect(input).toHaveValue('');
  });

  it('marks itself invalid and supports disabled', () => {
    const { rerender } = render(
      <AmountInput aria-label="Monto" value={null} onValueChange={() => {}} invalid />,
    );
    expect(screen.getByLabelText('Monto')).toHaveAttribute('aria-invalid', 'true');

    rerender(<AmountInput aria-label="Monto" value={null} onValueChange={() => {}} disabled />);
    expect(screen.getByLabelText('Monto')).toBeDisabled();
  });
});

describe('AmountInput sizes', () => {
  it('is the big centered figure by default', () => {
    const { container } = render(<AmountInput aria-label="Monto" value={null} onValueChange={() => {}} />);
    expect(container.querySelector('label')).toHaveClass('h-16', 'justify-center');
    expect(screen.getByLabelText('Monto')).toHaveClass('font-mono');
  });

  it('is a regular 44px form field with size="field"', () => {
    const { container } = render(<AmountInput aria-label="Monto" size="field" value={1000} onValueChange={() => {}} />);
    expect(container.querySelector('label')).toHaveClass('h-11', 'justify-start');
    expect(container.querySelector('label')).not.toHaveClass('h-16');
    expect(screen.getByLabelText('Monto')).toHaveClass('font-sans');
    expect(screen.getByLabelText('Monto')).toHaveValue('1.000');
  });
});
