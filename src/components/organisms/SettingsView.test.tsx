import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SettingsView as SettingsData } from '@/features/lender/get-settings.server';
import { SettingsView } from './SettingsView';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/features/lender/use-logo-form', () => ({
  useLogoForm: () => ({ isBusy: false, error: null, notice: null, chooseFile: vi.fn(), removeLogo: vi.fn() }),
}));
vi.mock('@/features/lender/use-settings-forms', () => ({
  useBusinessForm: () => ({ name: 'Buen Vecino', fieldError: undefined, isSubmitting: false, error: null, notice: null, changeName: vi.fn(), submit: vi.fn() }),
  useCollectionDaysForm: () => ({ weekdays: [], skipHolidays: false, isSubmitting: false, error: null, notice: null, toggleDay: () => vi.fn(), toggleHolidays: vi.fn(), submit: vi.fn() }),
  useBrandColorForm: () => ({ color: '#3B3382', fieldError: undefined, isSubmitting: false, error: null, notice: null, isCustom: false, changeColor: vi.fn(), submit: vi.fn(), reset: vi.fn() }),
  usePortfolioForm: () => ({ name: '', fieldError: undefined, isSubmitting: false, error: null, notice: null, changeName: vi.fn(), submit: vi.fn() }),
}));

const SETTINGS: SettingsData = {
  name: 'Buen Vecino',
  logoUrl: null,
  brandColor: null,
  subscription: null,
  nonWorkingWeekdays: [],
  skipNationalHolidays: false,
  portfolios: [{ id: 'p1', name: 'General', isDefault: true }],
  canEdit: true,
  logoUploadAvailable: false,
};

describe('SettingsView', () => {
  it('shows the sections under the page title', () => {
    render(<SettingsView settings={SETTINGS} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Configuración' })).toBeInTheDocument();
    for (const title of ['Datos del negocio', 'Logo del negocio', 'Color de marca', 'Días sin cobro', 'Carteras']) {
      expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    }
  });

  it('explains that only administrators can edit when the person cannot', () => {
    const { rerender } = render(<SettingsView settings={SETTINGS} />);
    expect(screen.queryByText(/Solo quien administra/)).not.toBeInTheDocument();
    rerender(<SettingsView settings={{ ...SETTINGS, canEdit: false }} />);
    expect(screen.getByText(/Solo quien administra/)).toBeInTheDocument();
  });

  it('shows the plan block only when the subscription could be loaded', () => {
    const subscription = {
      planName: 'Prueba gratis',
      statusLabel: 'Activo',
      endsOn: '08/11/2026',
      daysRemaining: '30',
      collectors: '1 de 5',
      collectorsPercent: 20,
      notice: null,
    };
    const { rerender } = render(<SettingsView settings={SETTINGS} />);
    expect(screen.queryByRole('heading', { level: 2, name: 'Tu plan' })).not.toBeInTheDocument();

    rerender(<SettingsView settings={{ ...SETTINGS, subscription }} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Tu plan' })).toBeInTheDocument();
  });
});
