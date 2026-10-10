import 'server-only';
import { getShellContext } from '@/features/app-shell/get-shell-context.server';
import { requireUser } from '@/features/auth/session.server';

/** Lo que la persona de la sesión puede hacer en el negocio, para mostrar u ocultar acciones. La API sigue siendo quien autoriza. */
export interface Access {
  /** Administra el negocio (Owner o Lender). */
  readonly canManage: boolean;
  /** Puede cobrar en campo (rol Collector). */
  readonly canCollect: boolean;
  /** Su membresía, si se pudo saber. */
  readonly membershipId: string | null;
}

/** Permisos de la persona de la sesión (memoizado por petición con `getShellContext`). */
export async function getAccess(): Promise<Access> {
  const user = await requireUser();
  const { canManage, canCollect, membershipId } = await getShellContext(user);
  return { canManage, canCollect, membershipId };
}
