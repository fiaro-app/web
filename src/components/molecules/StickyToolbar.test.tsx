import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StickyToolbar } from './StickyToolbar';

describe('StickyToolbar', () => {
  it('sticks to the top and marks the page as a list', () => {
    render(<StickyToolbar>Buscar</StickyToolbar>);

    expect(screen.getByText('Buscar')).toHaveClass('sticky', 'top-0');
    expect(screen.getByText('Buscar')).toHaveAttribute('data-list-toolbar');
  });
});
