'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { describePortfolioDeleteError, describeSettingsError } from '@/features/lender/error-messages';
import { deletePortfolio, renamePortfolio } from '@/features/lender/lender-api';
import { PortfolioFormSchema } from '@/features/lender/settings-schemas';

/**
 * Lógica de renombrar o borrar una cartera existente, sin diseño. Renombrar se hace en la misma
 * fila (`isEditing`); borrar pide confirmar (`isConfirmingDelete`). Si sale bien refresca la página.
 */
export function usePortfolioActions(portfolio: { readonly id: string; readonly name: string }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [name, setName] = useState(portfolio.name);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setName(portfolio.name);
    setFieldError(undefined);
    setError(null);
    setIsEditing(true);
  };
  const cancelEditing = () => setIsEditing(false);
  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setFieldError(undefined);
  };

  const submitRename = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;
    const parsed = PortfolioFormSchema.safeParse({ name });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    if (parsed.data.name === portfolio.name) {
      setIsEditing(false);
      return;
    }
    setIsBusy(true);
    setError(null);
    try {
      await renamePortfolio(portfolio.id, parsed.data.name);
    } catch (failure) {
      setError(describeSettingsError(failure).message);
      setIsBusy(false);
      return;
    }
    setIsBusy(false);
    setIsEditing(false);
    router.refresh();
  };

  const askDelete = () => {
    setError(null);
    setIsConfirmingDelete(true);
  };
  const cancelDelete = () => setIsConfirmingDelete(false);
  const confirmDelete = async () => {
    if (isBusy) return;
    setIsBusy(true);
    setError(null);
    try {
      await deletePortfolio(portfolio.id);
    } catch (failure) {
      setError(describePortfolioDeleteError(failure).message);
      setIsBusy(false);
      setIsConfirmingDelete(false);
      return;
    }
    setIsBusy(false);
    setIsConfirmingDelete(false);
    router.refresh();
  };

  return {
    isEditing,
    isConfirmingDelete,
    name,
    fieldError,
    isBusy,
    error,
    startEditing,
    cancelEditing,
    changeName,
    submitRename,
    askDelete,
    cancelDelete,
    confirmDelete,
  };
}
