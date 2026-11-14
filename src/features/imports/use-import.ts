'use client';

import { useCallback, useState } from 'react';
import { IMPORT_CHUNK_SIZE, type ImportResponse, type ImportRow, type ImportRowStatus } from '@/features/imports/import-endpoints';
import { runImport } from '@/features/imports/import-api';
import { parseCsv, parseSheet, type Cell, type ParsedRow } from '@/features/imports/parse-sheet';
import { IMPORTS_TEXT } from '@/content/imports';
import { isApiRequestError } from '@/lib/api';

/** Lo que pasó con una fila de la hoja. */
export interface ImportItem {
  readonly sheetRow: number;
  readonly status: ImportRowStatus;
  readonly problems: readonly string[];
}

export type ImportState =
  | { readonly phase: 'idle'; readonly error: string | null }
  | { readonly phase: 'working'; readonly step: 'reading' | 'reviewing' | 'importing' }
  | { readonly phase: 'review'; readonly parsed: readonly ParsedRow[]; readonly items: readonly ImportItem[] }
  | { readonly phase: 'done'; readonly items: readonly ImportItem[] };

const IDLE: ImportState = { phase: 'idle', error: null };

/** El mensaje de un fallo de red o de la API al mandar filas. */
function describeFailure(failure: unknown): string {
  if (isApiRequestError(failure) && (failure.hasCode('FORBIDDEN') || failure.hasCode('PLAN_FEATURE_UNAVAILABLE') || failure.hasCode('SUBSCRIPTION_READ_ONLY'))) {
    return failure.message;
  }
  return IMPORTS_TEXT.sheetErrors.network;
}

/** Las celdas del archivo: `.csv` como texto y `.xlsx` con la librería (se carga solo cuando se necesita). */
async function readCells(file: File): Promise<Cell[][] | 'format'> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv')) return parseCsv(await file.text());
  if (!name.endsWith('.xlsx')) return 'format';
  const { readSheet } = await import('read-excel-file/browser');
  return (await readSheet(file)) as Cell[][];
}

/** Las filas que la API no ve: las que ya traen problemas de la hoja. */
function localInvalid(parsed: readonly ParsedRow[]): ImportItem[] {
  return parsed
    .filter((entry) => entry.row === null)
    .map((entry) => ({ sheetRow: entry.sheetRow, status: 'INVALID', problems: entry.problems }));
}

/** Lo que la API contestó de una tanda, con el número de fila de la hoja de cada resultado. */
function itemsOf(chunk: readonly ParsedRow[], response: ImportResponse): ImportItem[] {
  return response.rows.flatMap((result) => {
    const sheetRow = chunk[result.row - 1]?.sheetRow;
    return sheetRow === undefined ? [] : [{ sheetRow, status: result.status, problems: result.issues.map((issue) => issue.message) }];
  });
}

/**
 * Manda las filas que se pueden mandar, en tandas, y las junta con las que ya venían con problemas.
 * Si una tanda falla después de que otras ya se crearon, las que faltan quedan como fallidas en vez de
 * perder lo hecho (volver a confirmar duplicaría los préstamos ya creados).
 */
async function send(parsed: readonly ParsedRow[], dryRun: boolean): Promise<readonly ImportItem[]> {
  const sendable = parsed.filter((entry): entry is ParsedRow & { row: ImportRow } => entry.row !== null);
  const items = localInvalid(parsed);
  for (let offset = 0; offset < sendable.length; offset += IMPORT_CHUNK_SIZE) {
    const chunk = sendable.slice(offset, offset + IMPORT_CHUNK_SIZE);
    try {
      items.push(...itemsOf(chunk, await runImport(chunk.map((entry) => entry.row), dryRun)));
    } catch (error_) {
      if (dryRun || offset === 0) throw error_;
      const problems = [describeFailure(error_)];
      items.push(...sendable.slice(offset).map((entry): ImportItem => ({ sheetRow: entry.sheetRow, status: 'FAILED', problems })));
      break;
    }
  }
  return items.sort((a, b) => a.sheetRow - b.sheetRow);
}

/**
 * Lógica de «Importar», sin diseño: lee el archivo, lo revisa con la API (`dryRun`) y, solo cuando la
 * persona confirma, lo crea. Cada paso deja el estado listo para pintar; un error vuelve al inicio con su mensaje.
 */
export function useImport() {
  const [state, setState] = useState<ImportState>(IDLE);

  const choose = useCallback(async (file: File) => {
    setState({ phase: 'working', step: 'reading' });
    let parsedSheet;
    try {
      const cells = await readCells(file);
      if (cells === 'format') return setState({ phase: 'idle', error: IMPORTS_TEXT.sheetErrors.format });
      parsedSheet = parseSheet(cells);
    } catch {
      return setState({ phase: 'idle', error: IMPORTS_TEXT.sheetErrors.unreadable });
    }
    const errors = IMPORTS_TEXT.sheetErrors;
    if (parsedSheet.kind === 'empty') return setState({ phase: 'idle', error: errors.empty });
    if (parsedSheet.kind === 'too-many') return setState({ phase: 'idle', error: errors.tooMany });
    if (parsedSheet.kind === 'missing-columns') return setState({ phase: 'idle', error: errors.missing(parsedSheet.missing) });
    setState({ phase: 'working', step: 'reviewing' });
    try {
      setState({ phase: 'review', parsed: parsedSheet.rows, items: await send(parsedSheet.rows, true) });
    } catch (error_) {
      setState({ phase: 'idle', error: describeFailure(error_) });
    }
  }, []);

  const confirm = useCallback(async () => {
    if (state.phase !== 'review') return;
    setState({ phase: 'working', step: 'importing' });
    try {
      setState({ phase: 'done', items: await send(state.parsed, false) });
    } catch (error_) {
      setState({ phase: 'idle', error: describeFailure(error_) });
    }
  }, [state]);

  const reset = useCallback(() => setState(IDLE), []);

  return { state, choose, confirm, reset };
}
