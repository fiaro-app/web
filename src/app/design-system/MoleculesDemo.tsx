'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { ClientRow } from '@/components/molecules/ClientRow';
import { Toast } from '@/components/molecules/Toast';
import { FilterBar } from '@/components/molecules/FilterBar';

const PILLS = [
  { value: '', label: 'Todos' },
  { value: 'current', label: 'Al día' },
  { value: 'late', label: 'Atraso' },
  { value: 'delinquent', label: 'Mora' },
];

const COLLECTORS = [
  { value: 'luis', label: 'Luis Albares' },
  { value: 'paola', label: 'Paola Tabares' },
];

/** Moléculas con estado propio del catálogo (filtros y modal), que necesitan componente de cliente. */
export function MoleculesDemo() {
  const [search, setSearch] = useState('');
  const [pill, setPill] = useState('');
  const [collector, setCollector] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full max-w-md">
        <FilterBar
          search={{ value: search, onChange: setSearch, placeholder: 'Buscar cliente...' }}
          pills={{ options: PILLS, value: pill, onChange: setPill }}
          selects={[
            { label: 'Cobrador', value: collector, onChange: setCollector, options: COLLECTORS },
          ]}
        />
      </div>
      <Toast
        className="w-full max-w-md"
        message="Guardado, pendiente de sync"
        actionLabel="Reintentar"
        onAction={() => {}}
      />
      <div className="w-full max-w-md overflow-hidden rounded-md border border-skeleton">
        <ClientRow name="Juan Pérez (clic)" balance={80000} status="current" onClick={() => {}} />
      </div>
      <div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Abrir ConfirmDialog
        </Button>
        <ConfirmDialog
          open={open}
          title="¿Confirmar pago?"
          description="Vas a registrar $35.000 como pago completo de Marta Gómez. Esta acción no se puede deshacer."
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    </>
  );
}
