import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingTemplate } from './LandingTemplate';

describe('LandingTemplate', () => {
  it('places the nav before the main content and the footer after it', () => {
    render(
      <LandingTemplate nav={<header>nav</header>} footer={<footer>pie</footer>}>
        <section>contenido</section>
      </LandingTemplate>,
    );

    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('contenido');
    expect(screen.getByRole('banner').compareDocumentPosition(main)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(main.compareDocumentPosition(screen.getByRole('contentinfo'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
