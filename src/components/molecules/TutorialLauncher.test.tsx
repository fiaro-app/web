import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { START_TUTORIAL_EVENT } from '@/features/tutorial/tutorial-storage';
import { TutorialLauncher } from './TutorialLauncher';

describe('TutorialLauncher', () => {
  it('asks the app to start the tutorial again', async () => {
    const listener = vi.fn();
    window.addEventListener(START_TUTORIAL_EVENT, listener);
    render(<TutorialLauncher />);

    await userEvent.click(screen.getByRole('button', { name: 'Ver el tutorial' }));

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(START_TUTORIAL_EVENT, listener);
  });
});
