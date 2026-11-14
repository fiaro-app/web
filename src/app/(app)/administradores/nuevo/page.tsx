import type { Metadata } from 'next';
import { AdminCreateScreen } from '@/components/organisms/AdminCreateScreen';

export const metadata: Metadata = { title: 'Invitar administrador' };

/** Invitar a un administrador: formulario con su celular y su correo; al terminar muestra la contraseña temporal. */
export default function NewAdminPage() {
  return <AdminCreateScreen />;
}
