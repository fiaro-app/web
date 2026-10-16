import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LEGAL_DOCUMENTS } from '@/content/legal';
import { LegalDocumentView } from './LegalDocumentView';

describe('LegalDocumentView', () => {
  it.each(LEGAL_DOCUMENTS)('shows $title with one h1 and every section as an h2', (document) => {
    render(<LegalDocumentView document={document} />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(document.title);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(document.sections.length);
  });
});
