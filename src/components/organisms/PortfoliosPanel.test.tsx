import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PortfoliosPanel } from './PortfoliosPanel';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
const { usePortfolioForm } = vi.hoisted(() => ({ usePortfolioForm: vi.fn() }));
vi.mock('@/features/lender/use-settings-forms', () => ({ usePortfolioForm }));

const PORTFOLIOS = [
  { id: 'p1', name: 'General', isDefault: true },
  { id: 'p2', name: 'Zona Norte', isDefault: false },
];
const state = (overrides = {}) => ({
  name: '',
  fieldError: undefined,
  isSubmitting: false,
  error: null,
  notice: null,
  changeName: vi.fn(),
  submit: vi.fn((event: { preventDefault: () => void }) => event.preventDefault()),
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  usePortfolioForm.mockReturnValue(state());
});

describe('PortfoliosPanel', () => {
  it('lists the portfolios and flags the default one', () => {
    render(<PortfoliosPanel portfolios={PORTFOLIOS} canEdit />);
    const items = within(screen.getByRole('list', { name: 'Carteras del negocio' })).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]!).getByText('Por defecto')).toBeInTheDocument();
    expect(within(items[1]!).queryByText('Por defecto')).not.toBeInTheDocument();
  });

  it('offers the create form to an administrator', () => {
    render(<PortfoliosPanel portfolios={PORTFOLIOS} canEdit />);
    expect(screen.getByLabelText('Nueva cartera')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cartera' })).toBeInTheDocument();
  });

  it('replaces the create form with a note once the business has the maximum of portfolios', () => {
    const four = [...PORTFOLIOS, { id: 'p3', name: 'Sur', isDefault: false }, { id: 'p4', name: 'Centro', isDefault: false }];
    render(<PortfoliosPanel portfolios={four} canEdit />);
    expect(screen.queryByRole('button', { name: 'Crear cartera' })).not.toBeInTheDocument();
    expect(screen.getByText(/máximo de 4 carteras/)).toBeInTheDocument();
  });

  it('only lists them without permission', () => {
    render(<PortfoliosPanel portfolios={PORTFOLIOS} canEdit={false} />);
    expect(screen.queryByRole('button', { name: 'Crear cartera' })).not.toBeInTheDocument();
    expect(screen.getByText('Zona Norte')).toBeInTheDocument();
  });

  it('shows field errors, API errors and notices', () => {
    usePortfolioForm.mockReturnValue(state({ fieldError: 'Escribe el nombre', error: 'Repetida', notice: 'Cartera creada.' }));
    render(<PortfoliosPanel portfolios={PORTFOLIOS} canEdit />);
    expect(screen.getByText('Escribe el nombre')).toBeInTheDocument();
    expect(screen.getByText('Repetida')).toBeInTheDocument();
    expect(screen.getByText('Cartera creada.')).toBeInTheDocument();
  });
});
