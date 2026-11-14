import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImportView } from './ImportView';

const { runImport } = vi.hoisted(() => ({ runImport: vi.fn() }));
vi.mock('@/features/imports/import-api', () => ({ runImport }));

const result = (row: number, status: string, message?: string) => ({ row, status, client: 'NEW', loan: false, issues: message ? [{ field: 'phone', message }] : [] });
const file = (...lines: string[]) => new File([`Cédula,Nombre,Ocupación,Celular,Dirección\n${lines.join('\n')}`], 'hoja.csv', { type: 'text/csv' });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ImportView', () => {
  it('walks from picking a file, to the review with its problems, to the final result', async () => {
    runImport
      .mockResolvedValueOnce({ rows: [result(1, 'READY'), result(2, 'INVALID', 'Celular inválido')] })
      .mockResolvedValueOnce({ rows: [result(1, 'IMPORTED'), result(2, 'INVALID', 'Celular inválido')] });
    const user = userEvent.setup();
    render(<ImportView />);

    await user.upload(screen.getByLabelText('Archivo de Excel o CSV'), file('1,Ana,,3001112222,', '2,Luis,,123,'));

    expect(await screen.findByText(/1 filas listas/)).toBeInTheDocument();
    expect(screen.getByText('Celular inválido')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Importar 1 filas' }));

    expect(await screen.findByText(/Se importaron 1 filas y 1 fallaron/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver clientes' })).toHaveAttribute('href', '/clientes');
    await user.click(screen.getByRole('button', { name: 'Importar otra hoja' }));
    expect(screen.getByRole('button', { name: 'Elegir archivo' })).toBeInTheDocument();
  });

  it('cannot confirm when no row is ready, and can pick another file', async () => {
    runImport.mockResolvedValue({ rows: [result(1, 'INVALID', 'Celular inválido')] });
    const user = userEvent.setup();
    render(<ImportView />);

    await user.upload(screen.getByLabelText('Archivo de Excel o CSV'), file('1,Ana,,123,'));

    expect(await screen.findByText(/Ninguna fila está lista/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Importar 0 filas' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Elegir otro archivo' }));
    expect(screen.getByRole('button', { name: 'Descargar plantilla' })).toBeInTheDocument();
  });

  it('shows why a file was rejected', async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<ImportView />);

    await user.upload(screen.getByLabelText('Archivo de Excel o CSV'), new File(['x'], 'hoja.pdf'));

    expect(await screen.findByRole('alert')).toHaveTextContent('no es un .xlsx');
  });

  it('downloads the template as a csv', async () => {
    const createObjectURL = vi.fn(() => 'blob:x');
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<ImportView />);

    await user.click(screen.getByRole('button', { name: 'Descargar plantilla' }));

    await waitFor(() => expect(click).toHaveBeenCalledOnce());
    expect(createObjectURL).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
    click.mockRestore();
  });

  it('opens the file picker from the visible button', async () => {
    const user = userEvent.setup();
    render(<ImportView />);
    const input = screen.getByLabelText('Archivo de Excel o CSV');
    const click = vi.spyOn(input, 'click');

    await user.click(screen.getByRole('button', { name: 'Elegir archivo' }));

    expect(click).toHaveBeenCalledOnce();
  });
});
