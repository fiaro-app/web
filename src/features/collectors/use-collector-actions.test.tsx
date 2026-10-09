import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { changeCollectorPortfolio, deactivateCollector, resetCollectorPassword } from './collectors-api';
import { useCollectorActions } from './use-collector-actions';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./collectors-api', () => ({
  changeCollectorPortfolio: vi.fn(),
  deactivateCollector: vi.fn(),
  resetCollectorPassword: vi.fn(),
}));

const change = vi.mocked(changeCollectorPortfolio);
const deactivate = vi.mocked(deactivateCollector);
const reset = vi.mocked(resetCollectorPassword);

const COLLECTOR = { id: 'm1', roles: ['COLLECTOR'] as const, portfolioId: 'p1' };
const setup = () => renderHook(() => useCollectorActions({ ...COLLECTOR, roles: [...COLLECTOR.roles] })).result;

beforeEach(() => {
  vi.clearAllMocks();
  change.mockResolvedValue({} as never);
  deactivate.mockResolvedValue({} as never);
  reset.mockResolvedValue({ tempPassword: 'nuevo-pw' });
});

describe('useCollectorActions', () => {
  it('starts with the current portfolio selected', () => {
    expect(setup().current.portfolioId).toBe('p1');
  });

  it('saves a new portfolio, keeping the roles, and refreshes', async () => {
    const result = setup();
    act(() => result.current.setPortfolioId('p2'));
    await act(() => result.current.savePortfolio());
    expect(change).toHaveBeenCalledWith('m1', ['COLLECTOR'], 'p2');
    expect(result.current.notice).toBe('Cartera actualizada.');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.pending).toBeNull();
  });

  it('refuses to save without a portfolio', async () => {
    const result = setup();
    act(() => result.current.setPortfolioId(''));
    await act(() => result.current.savePortfolio());
    expect(change).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Elige la cartera del cobrador.');
  });

  it('keeps the temporary password after resetting it', async () => {
    const result = setup();
    await act(() => result.current.resetPassword());
    expect(reset).toHaveBeenCalledWith('m1');
    expect(result.current.tempPassword).toBe('nuevo-pw');
  });

  it('deactivates the collector and refreshes', async () => {
    const result = setup();
    await act(() => result.current.deactivate());
    expect(deactivate).toHaveBeenCalledWith('m1');
    expect(result.current.notice).toBe('Cobrador desactivado.');
    expect(refresh).toHaveBeenCalled();
  });

  it('reports a failure without refreshing', async () => {
    deactivate.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    const result = setup();
    await act(() => result.current.deactivate());
    expect(result.current.error).toBe('No tienes permiso para administrar cobradores.');
    expect(refresh).not.toHaveBeenCalled();
    expect(result.current.pending).toBeNull();
  });
});
