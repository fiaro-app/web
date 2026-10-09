import type { Metadata } from 'next';
import { AccountView } from '@/components/organisms/AccountView';
import { getAccountSessions } from '@/features/account/get-sessions.server';
import { requireUser } from '@/features/auth/session.server';

export const metadata: Metadata = { title: 'Mi cuenta' };

/** Mi cuenta: los datos de la persona de la sesión (no del negocio) y su seguridad. */
export default async function AccountPage() {
  const [user, sessions] = await Promise.all([requireUser(), getAccountSessions()]);
  return (
    <AccountView
      fullName={user.name}
      phoneNumber={user.phoneNumber}
      contactEmail={user.contactEmail}
      contactEmailVerified={user.contactEmailVerified === true}
      sessions={sessions}
    />
  );
}
