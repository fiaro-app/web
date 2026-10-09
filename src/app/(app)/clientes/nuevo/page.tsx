import type { Metadata } from 'next';
import { ClientForm } from '@/components/organisms/ClientForm';

export const metadata: Metadata = { title: 'Registrar cliente' };

/** Registrar cliente. */
export default function NewClientPage() {
  return <ClientForm />;
}
