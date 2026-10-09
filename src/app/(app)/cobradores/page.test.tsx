import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CollectorsPage from './page';

vi.mock('@/features/collectors/get-collectors.server', () => ({ getCollectors: vi.fn().mockResolvedValue({ status: 'forbidden' }) }));

describe('Collectors page', () => {
  it('explains it with a large empty state when the person cannot see collectors', async () => {
    render(await CollectorsPage({ searchParams: Promise.resolve({}) } as Parameters<typeof CollectorsPage>[0]));

    expect(screen.getByRole('heading', { name: 'No tienes acceso a esta sección' })).toBeInTheDocument();
  });
});
