import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SettingsSection } from './SettingsSection';

describe('SettingsSection', () => {
  it('is a region named by its title, with its description and content', () => {
    render(
      <SettingsSection title="Datos del negocio" description="El nombre de tu financiera.">
        <p>contenido</p>
      </SettingsSection>,
    );
    expect(screen.getByRole('region', { name: 'Datos del negocio' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Datos del negocio' })).toBeInTheDocument();
    expect(screen.getByText('El nombre de tu financiera.')).toBeInTheDocument();
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });
});
