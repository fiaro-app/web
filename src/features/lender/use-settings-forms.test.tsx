import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { createPortfolio, updateBrandColor, updateBusinessName, updateCollectionDays } from './lender-api';
import { DEFAULT_BRAND_COLOR, useBrandColorForm, useBusinessForm, useCollectionDaysForm, usePortfolioForm } from './use-settings-forms';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./lender-api', () => ({ updateBusinessName: vi.fn(), updateCollectionDays: vi.fn(), createPortfolio: vi.fn(), updateBrandColor: vi.fn() }));
const updateName = vi.mocked(updateBusinessName);
const updateDays = vi.mocked(updateCollectionDays);
const create = vi.mocked(createPortfolio);
const updateColor = vi.mocked(updateBrandColor);

const typed = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const checked = (value: boolean) => ({ target: { checked: value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

beforeEach(() => {
  vi.clearAllMocks();
  updateName.mockResolvedValue({} as never);
  updateDays.mockResolvedValue({} as never);
  create.mockResolvedValue({} as never);
  updateColor.mockResolvedValue({} as never);
});

describe('useBusinessForm', () => {
  const setup = () => renderHook(() => useBusinessForm({ name: 'Buen Vecino' })).result;

  it('validates the name before calling the API', async () => {
    const result = setup();
    act(() => result.current.changeName(typed('')));
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.fieldError).toBe('Escribe el nombre de tu financiera.');
    expect(updateName).not.toHaveBeenCalled();
  });

  it('does not call the API when nothing changed', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));
    expect(updateName).not.toHaveBeenCalled();
    expect(result.current.notice).toBe('No hay cambios para guardar.');
  });

  it('saves a new name and refreshes', async () => {
    const result = setup();
    act(() => result.current.changeName(typed('Nuevo Nombre')));
    await act(() => result.current.submit(submitEvent()));
    expect(updateName).toHaveBeenCalledWith('Nuevo Nombre');
    expect(result.current.notice).toBe('Nombre actualizado.');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('shows why the API refused', async () => {
    updateName.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    const result = setup();
    act(() => result.current.changeName(typed('Otro')));
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.error).toMatch(/No tienes permiso/);
    expect(result.current.notice).toBeNull();
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe('useCollectionDaysForm', () => {
  const setup = () => renderHook(() => useCollectionDaysForm({ nonWorkingWeekdays: ['SUNDAY'], skipNationalHolidays: false })).result;

  it('starts from the saved configuration', () => {
    const result = setup();
    expect(result.current.weekdays).toEqual(['SUNDAY']);
    expect(result.current.skipHolidays).toBe(false);
  });

  it('toggles days in Monday-first order and the holidays flag', () => {
    const result = setup();
    act(() => result.current.toggleDay('MONDAY')(checked(true)));
    expect(result.current.weekdays).toEqual(['MONDAY', 'SUNDAY']);
    act(() => result.current.toggleHolidays(checked(true)));
    expect(result.current.skipHolidays).toBe(true);
  });

  it('skips the API call when nothing changed', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));
    expect(updateDays).not.toHaveBeenCalled();
    expect(result.current.notice).toBe('No hay cambios para guardar.');
  });

  it('saves the changes and refreshes', async () => {
    const result = setup();
    act(() => result.current.toggleDay('SATURDAY')(checked(true)));
    await act(() => result.current.submit(submitEvent()));
    expect(updateDays).toHaveBeenCalledWith(['SATURDAY', 'SUNDAY'], false);
    expect(result.current.notice).toBe('Días sin cobro actualizados.');
    expect(refresh).toHaveBeenCalled();
  });

  it('can clear every non-working day', async () => {
    const result = setup();
    act(() => result.current.toggleDay('SUNDAY')(checked(false)));
    await act(() => result.current.submit(submitEvent()));
    expect(updateDays).toHaveBeenCalledWith([], false);
  });
});

describe('usePortfolioForm', () => {
  const setup = () => renderHook(() => usePortfolioForm()).result;

  it('requires a name', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.fieldError).toBe('Escribe el nombre de la cartera.');
    expect(create).not.toHaveBeenCalled();
  });

  it('creates the portfolio, clears the field and refreshes', async () => {
    const result = setup();
    act(() => result.current.changeName(typed(' Zona Norte ')));
    await act(() => result.current.submit(submitEvent()));
    expect(create).toHaveBeenCalledWith('Zona Norte');
    expect(result.current.name).toBe('');
    expect(result.current.notice).toBe('Cartera creada.');
    expect(refresh).toHaveBeenCalled();
  });

  it('explains a repeated name and keeps what was typed', async () => {
    create.mockRejectedValue(new ApiRequestError({ statusCode: 409, code: 'CONFLICT', message: 'x' }));
    const result = setup();
    act(() => result.current.changeName(typed('General')));
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.error).toBe('Ya tienes una cartera con ese nombre.');
    expect(result.current.name).toBe('General');
  });
});

describe('useBrandColorForm', () => {
  const setup = (brandColor: string | null = null) => renderHook(() => useBrandColorForm({ brandColor })).result;

  it('starts with the saved color, or the Fiaro one when there is none', () => {
    expect(setup('#0F766E').current).toMatchObject({ color: '#0F766E', isCustom: true });
    expect(setup().current).toMatchObject({ color: DEFAULT_BRAND_COLOR, isCustom: false });
  });

  it('saves the new color in uppercase and refreshes', async () => {
    const result = setup();
    act(() => result.current.changeColor(typed('#0f766e')));
    await act(() => result.current.submit(submitEvent()));

    expect(updateColor).toHaveBeenCalledWith('#0F766E');
    expect(result.current.notice).toBe('Color actualizado.');
    expect(refresh).toHaveBeenCalled();
  });

  it('does not call the API when the color did not change', async () => {
    const result = setup('#0F766E');
    await act(() => result.current.submit(submitEvent()));

    expect(updateColor).not.toHaveBeenCalled();
    expect(result.current.notice).toBe('No hay cambios para guardar.');
  });

  it('refuses a color too light for the buttons', async () => {
    const result = setup();
    act(() => result.current.changeColor(typed('#ffe08a')));
    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldError).toMatch(/más oscuro/);
    expect(updateColor).not.toHaveBeenCalled();
  });

  it('goes back to the Fiaro color by saving null', async () => {
    const result = setup('#0F766E');
    await act(() => result.current.reset());

    expect(updateColor).toHaveBeenCalledWith(null);
    expect(result.current.color).toBe(DEFAULT_BRAND_COLOR);
  });
});
