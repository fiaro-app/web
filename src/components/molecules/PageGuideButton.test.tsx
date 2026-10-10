import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { START_PAGE_GUIDE_EVENT } from '@/features/tutorial/tutorial-storage';
import { PageGuideButton } from './PageGuideButton';

describe('PageGuideButton', () => {
  it('asks the app to start the guide of the current screen', async () => {
    const listener = vi.fn();
    window.addEventListener(START_PAGE_GUIDE_EVENT, listener);
    render(<PageGuideButton />);

    await userEvent.click(screen.getByRole('button', { name: /Guía de esta pantalla/ }));

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(START_PAGE_GUIDE_EVENT, listener);
  });
});
