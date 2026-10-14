import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signOut } from '@/features/auth/auth-api';
import { SignOutButton } from './SignOutButton';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh: vi.fn() }) }));
vi.mock('@/features/auth/auth-api', () => ({ signOut: vi.fn().mockResolvedValue(undefined) }));

beforeEach(() => vi.clearAllMocks());

describe('SignOutButton', () => {
  it('signs out and goes to login when pressed, then stays disabled', async () => {
    render(<SignOutButton />);

    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(vi.mocked(signOut)).not.toHaveBeenCalled();
    await userEvent.click(screen.getAllByRole('button', { name: 'Cerrar sesión' }).at(-1)!);

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(vi.mocked(signOut)).toHaveBeenCalledOnce();
    expect(screen.getAllByRole('button', { name: 'Cerrar sesión' })[0]).toBeDisabled();
  });
});
