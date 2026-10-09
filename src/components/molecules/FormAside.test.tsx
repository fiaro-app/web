import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormAside } from './FormAside';
import { FormWithAside } from './FormWithAside';

const ASIDE = {
  title: '¿Qué pasa después?',
  steps: ['Uno', 'Dos'],
  tip: { title: 'Un consejo', body: 'Cuerpo' },
};

describe('FormAside', () => {
  it('lists the steps in order and the tip, hidden below the lg breakpoint', () => {
    render(<FormAside {...ASIDE} />);

    const aside = screen.getByLabelText('¿Qué pasa después?', {
      selector: 'aside',
    });
    expect(aside).toHaveClass('hidden', 'lg:flex');
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['1Uno', '2Dos']);
    expect(screen.getByText('Cuerpo')).toBeInTheDocument();
  });
});

describe('FormWithAside', () => {
  it('renders the form next to the aside', () => {
    render(
      <FormWithAside aside={ASIDE}>
        <form aria-label="Formulario" />
      </FormWithAside>,
    );
    expect(screen.getByRole('form', { name: 'Formulario' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { hidden: true })).toBeInTheDocument();
  });
});
