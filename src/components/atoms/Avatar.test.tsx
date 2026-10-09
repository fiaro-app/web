import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('shows the initials and is named after the person', () => {
    render(<Avatar name="Marta Gómez" />);

    const avatar = screen.getByRole('img', { name: 'Marta Gómez' });
    expect(avatar).toHaveTextContent('MG');
  });

  it('shows a placeholder, with no initials, while loading', () => {
    render(<Avatar name="Marta Gómez" loading />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText('MG')).not.toBeInTheDocument();
  });
});
