import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectorCreateScreen } from './CollectorCreateScreen';

const { useCollectorForm } = vi.hoisted(() => ({ useCollectorForm: vi.fn() }));
vi.mock('@/features/collectors/use-collector-form', () => ({ useCollectorForm }));

const base = {
  values: { fullName: '', nationalId: '', phone: '', contactEmail: '', portfolioId: '' },
  fieldErrors: {},
  formError: null,
  isSubmitting: false,
  setField: () => vi.fn(),
  submit: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe('CollectorCreateScreen', () => {
  it('shows the form until the collector is registered', () => {
    useCollectorForm.mockReturnValue({ ...base, invited: null });
    render(<CollectorCreateScreen portfolios={[]} />);
    expect(screen.getByRole('form', { name: 'Registrar cobrador' })).toBeInTheDocument();
  });

  it('switches to the confirmation once the API answers', () => {
    useCollectorForm.mockReturnValue({ ...base, invited: { fullName: 'Luis', tempPassword: 'pw-1' } });
    render(<CollectorCreateScreen portfolios={[]} />);
    expect(screen.getByText('pw-1')).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});
