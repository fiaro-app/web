import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResponsiveTable } from './ResponsiveTable';

describe('ResponsiveTable', () => {
  it('shows the headers plus a hidden actions column and the given rows', () => {
    render(
      <ResponsiveTable caption="Clientes" headers={['Nombre', 'Cédula']} minWidthClass="md:min-w-150">
        <tr>
          <th scope="row">Ana</th>
          <td>123</td>
          <td />
        </tr>
      </ResponsiveTable>,
    );

    expect(screen.getByRole('table', { name: 'Clientes' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['Nombre', 'Cédula', 'Acciones']);
    expect(screen.getByRole('rowheader', { name: 'Ana' })).toBeInTheDocument();
  });
});
