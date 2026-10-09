import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { assignCollector } from './loans-api';
import { useAssignCollector } from './use-assign-collector';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./loans-api', () => ({ assignCollector: vi.fn() }));
const assignMock = vi.mocked(assignCollector);

const picked = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLSelectElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

beforeEach(() => {
  vi.clearAllMocks();
  assignMock.mockResolvedValue({} as never);
});

const setup = () => renderHook(() => useAssignCollector('l1')).result;

describe('useAssignCollector', () => {
  it('asks for a collector before calling the API', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.error).toBe('Elige el cobrador.');
    expect(assignMock).not.toHaveBeenCalled();
  });

  it('assigns the chosen collector, clears the choice and refreshes', async () => {
    const result = setup();
    act(() => result.current.changeCollector(picked('m1')));
    await act(() => result.current.submit(submitEvent()));
    expect(assignMock).toHaveBeenCalledWith('l1', 'm1');
    expect(result.current.notice).toBe('Cobrador asignado.');
    expect(result.current.collectorId).toBe('');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('explains a refusal and keeps the choice', async () => {
    assignMock.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    const result = setup();
    act(() => result.current.changeCollector(picked('m1')));
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.error).toMatch(/No tienes permiso/);
    expect(result.current.collectorId).toBe('m1');
    expect(refresh).not.toHaveBeenCalled();
  });

  it('clears the message when the choice changes', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));
    act(() => result.current.changeCollector(picked('m2')));
    expect(result.current.error).toBeNull();
  });
});
