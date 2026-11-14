import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ClaimsPage, { metadata as claimsMetadata } from '@/app/pqr/page';
import RefundsPage, { metadata as refundsMetadata } from '@/app/devoluciones/page';
import SubscriptionPage, { metadata as subscriptionMetadata } from '@/app/suscripcion/page';
import { CLAIMS_POLICY, REFUND_POLICY, SUBSCRIPTION_TERMS } from '@/content/legal-subscription';

describe.each([
  ['suscripcion', SubscriptionPage, subscriptionMetadata, SUBSCRIPTION_TERMS],
  ['devoluciones', RefundsPage, refundsMetadata, REFUND_POLICY],
  ['pqr', ClaimsPage, claimsMetadata, CLAIMS_POLICY],
] as const)('/%s', (_path, Page, metadata, document) => {
  it('shows its title as the single h1 and sets the page title', () => {
    render(<Page />);

    expect(screen.getByRole('heading', { level: 1, name: document.title })).toBeInTheDocument();
    expect(metadata.title).toContain(document.title);
  });
});
