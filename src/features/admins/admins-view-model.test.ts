import { describe, expect, it } from 'vitest';
import { membership } from '@/test/membership-fixture';
import { toAdminsViewModel } from './admins-view-model';

const OWNER = membership({ id: 'owner', roles: ['OWNER', 'LENDER', 'COLLECTOR'], fullName: 'Marta Ríos' });
const ME = membership({ id: 'me', roles: ['LENDER'], fullName: 'Lucía Pardo' });
const BOTH = membership({ id: 'both', roles: ['LENDER', 'COLLECTOR'], fullName: 'Pedro Gil' });
const ONLY = membership({ id: 'only', roles: ['LENDER'], fullName: 'Ana Soto' });
const COLLECTOR = membership({ id: 'col', roles: ['COLLECTOR'], fullName: 'Luis Gómez' });

describe('toAdminsViewModel', () => {
  it('labels the roles and offers no action on the owner or on oneself', () => {
    const { admins } = toAdminsViewModel([OWNER, ME, BOTH, ONLY], [], 'me');

    expect(admins.map((row) => row.roleLabel)).toEqual(['Dueño', 'Administrador', 'Administrador y cobrador', 'Administrador']);
    expect(admins[0]).toMatchObject({ canDemote: false, canRemove: false, isSelf: false });
    expect(admins[1]).toMatchObject({ canDemote: false, canRemove: false, isSelf: true });
  });

  it('lets one remove the admin role from someone who keeps another role, and remove the access of one who only administers', () => {
    const { admins } = toAdminsViewModel([BOTH, ONLY], [], null);

    expect(admins[0]).toMatchObject({ canDemote: true, canRemove: false });
    expect(admins[1]).toMatchObject({ canDemote: false, canRemove: true });
  });

  it('offers to promote only the collaborators that are not administrators yet', () => {
    const { promotable } = toAdminsViewModel([], [COLLECTOR, BOTH, OWNER], null);

    expect(promotable).toEqual([{ id: 'col', label: 'Luis Gómez · +573109998877', roles: ['COLLECTOR'] }]);
  });
});
