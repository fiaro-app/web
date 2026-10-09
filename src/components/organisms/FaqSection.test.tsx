import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FaqSection } from './FaqSection';

const ITEMS = [
  { question: '¿Cuesta algo?', answer: 'Empiezas gratis.' },
  { question: '¿Hay app?', answer: 'Sí, móvil.' },
];

describe('FaqSection', () => {
  it('shows the title and every question', () => {
    render(<FaqSection id="preguntas" eyebrow="Preguntas" title="Dudas comunes" items={ITEMS} />);

    expect(screen.getByRole('heading', { name: 'Dudas comunes' })).toBeInTheDocument();
    expect(screen.getByText('¿Cuesta algo?')).toBeInTheDocument();
    expect(screen.getByText('¿Hay app?')).toBeInTheDocument();
  });

  it('opens an answer when its question is chosen', async () => {
    const { container } = render(<FaqSection id="preguntas" eyebrow="Preguntas" title="Dudas comunes" items={ITEMS} />);
    const [first] = container.querySelectorAll('details');
    expect(first).not.toHaveAttribute('open');

    await userEvent.click(screen.getByText('¿Cuesta algo?'));

    expect(first).toHaveAttribute('open');
  });
});
