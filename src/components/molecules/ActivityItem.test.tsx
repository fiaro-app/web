import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivityItem } from './ActivityItem';

describe('ActivityItem', () => {
  it('shows its text', () => {
    render(<ActivityItem text="Alejo Zuleta cerró su ruta" />);

    expect(screen.getByText('Alejo Zuleta cerró su ruta')).toBeInTheDocument();
  });
});
