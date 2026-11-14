'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Select } from '@/components/atoms/Select';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { FormField } from '@/components/molecules/FormField';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { ADMINS_TEXT } from '@/content/admins';
import type { AdminRow, AdminsViewModel } from '@/features/admins/admins-view-model';
import { useAdminActions } from '@/features/admins/use-admin-actions';

type Confirming = { readonly kind: 'demote' | 'remove'; readonly row: AdminRow } | null;

/** Administradores: quiénes son, subir de rango a un colaborador, quitar el rol o el acceso, e invitar a uno nuevo. */
export function AdminsView({ admins }: Readonly<{ admins: AdminsViewModel }>) {
  const { selected, select, pending, error, notice, promote, demote, remove } = useAdminActions(admins.promotable);
  const [confirming, setConfirming] = useState<Confirming>(null);
  const text = ADMINS_TEXT;
  const dialog = confirming ? text.row.confirm[confirming.kind] : null;
  const confirm = () => {
    const current = confirming;
    setConfirming(null);
    if (current) void (current.kind === 'demote' ? demote(current.row) : remove(current.row));
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.subtitle}
        </Text>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      <ResponsiveTable caption={text.tableCaption} headers={text.headers} minWidthClass="md:min-w-175">
        {admins.admins.map((row) => (
          <tr key={row.id} className={RESPONSIVE_TABLE.row}>
            <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
              {row.fullName}
              {row.isSelf && <span className="ml-2 text-caption font-normal text-foreground/70">({text.you})</span>}
            </th>
            <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[1]}>
              {row.phone}
            </td>
            <td className={RESPONSIVE_TABLE.cell} data-label={text.headers[2]}>
              {row.roleLabel}
            </td>
            <td className={RESPONSIVE_TABLE.action}>
              {row.canDemote && (
                <Button variant="outline" disabled={pending} onClick={() => setConfirming({ kind: 'demote', row })} aria-label={`${text.row.demote}: ${row.fullName}`}>
                  {text.row.demote}
                </Button>
              )}
              {row.canRemove && (
                <Button variant="outline" disabled={pending} onClick={() => setConfirming({ kind: 'remove', row })} aria-label={`${text.row.remove}: ${row.fullName}`}>
                  {text.row.remove}
                </Button>
              )}
            </td>
          </tr>
        ))}
      </ResponsiveTable>

      <section aria-labelledby="promote-title" className="flex max-w-lg flex-col gap-3 rounded-md bg-surface p-5">
        <Text variant="label" as="h2" weight="bold" id="promote-title">
          {text.promote.title}
        </Text>
        <Text variant="caption" className="text-foreground/70">
          {text.promote.description}
        </Text>
        {admins.promotable.length === 0 ? (
          <Text variant="label">{text.promote.none}</Text>
        ) : (
          <>
            <FormField label={text.promote.label}>
              <Select name="collaborator" value={selected} onChange={select} disabled={pending}>
                <option value="">{text.promote.placeholder}</option>
                {admins.promotable.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <Button loading={pending} onClick={() => void promote()} className="self-start">
              {text.promote.action}
            </Button>
          </>
        )}
      </section>

      <ButtonLink href="/administradores/nuevo" variant="outline" className="self-start">
        {text.invite.action}
      </ButtonLink>

      <ConfirmDialog
        open={dialog !== null}
        title={dialog?.confirmTitle ?? ''}
        description={dialog?.confirmDescription ?? ''}
        confirmLabel={dialog?.confirmLabel}
        onCancel={() => setConfirming(null)}
        onConfirm={confirm}
      />
    </>
  );
}
