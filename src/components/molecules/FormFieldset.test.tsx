import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormFieldset } from './FormFieldset';

describe('FormFieldset', () => {
  it('renders its fields', () => {
    render(
      <FormFieldset>
        <p>campo</p>
      </FormFieldset>,
    );

    expect(screen.getByText('campo')).toBeInTheDocument();
  });
});
