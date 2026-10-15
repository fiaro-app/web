import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BackLink, RememberList } from './BackLink';

afterEach(() => {
  sessionStorage.clear();
  globalThis.history.replaceState(null, '', '/');
});

describe('BackLink', () => {
  it('sin nada recordado, lleva a la lista sin filtros', () => {
    render(<BackLink href="/prestamos">Volver</BackLink>);

    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/prestamos');
  });

  it('regresa a la lista con los filtros y la página que tenía', () => {
    globalThis.history.replaceState(null, '', '/prestamos?estado=mora&pagina=3');
    render(<RememberList path="/prestamos" />);

    render(<BackLink href="/prestamos">Volver</BackLink>);

    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/prestamos?estado=mora&pagina=3');
  });

  it('ignora un valor guardado que no es de esa lista', () => {
    sessionStorage.setItem('fiaro:list:/prestamos', 'https://malo.example/');
    render(<BackLink href="/prestamos">Volver</BackLink>);

    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/prestamos');
  });
});
