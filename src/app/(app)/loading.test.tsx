import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AppLoading from './loading';

describe('AppLoading', () => {
  it('shows the list skeleton while a panel screen loads', () => {
    render(<AppLoading />);

    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
  });
});
