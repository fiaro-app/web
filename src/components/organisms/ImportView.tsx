'use client';

import { useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { IMPORTS_TEXT } from '@/content/imports';
import { useImport, type ImportItem } from '@/features/imports/use-import';
import { templateCsv } from '@/features/imports/parse-sheet';

/** Las filas con errores o fallidas, con lo que pasa en cada una. */
function Problems({ items }: Readonly<{ items: readonly ImportItem[] }>) {
  const text = IMPORTS_TEXT.problems;
  const bad = items.filter((item) => item.status === 'INVALID' || item.status === 'FAILED');
  if (bad.length === 0) return null;
  return (
    <section aria-labelledby="import-problems-title" className="flex flex-col gap-3">
      <Text as="h2" variant="h3" id="import-problems-title">
        {text.title}
      </Text>
      <div className="max-h-96 overflow-auto rounded-md bg-surface">
        <table className="w-full text-left text-body">
          <thead>
            <tr className="text-foreground/70">
              <th scope="col" className="px-4 py-3 font-medium">
                {text.columns.row}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {text.columns.problem}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/8">
            {bad.map((item) => (
              <tr key={item.sheetRow}>
                <td className="px-4 py-3 align-top">{item.sheetRow}</td>
                <td className="px-4 py-3">{item.problems.join(' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Descarga la plantilla `.csv` generada en el navegador. */
function downloadTemplate() {
  const url = URL.createObjectURL(new Blob([templateCsv()], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = IMPORTS_TEXT.intro.templateFile;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * «Importar desde Excel»: elegir el archivo, ver qué se importaría y confirmar. La lógica vive en
 * `useImport`; aquí solo se pinta el estado en que va.
 */
export function ImportView() {
  const { state, choose, confirm, reset } = useImport();
  const input = useRef<HTMLInputElement>(null);
  const text = IMPORTS_TEXT;

  if (state.phase === 'working') {
    return <Alert>{text.working[state.step]}</Alert>;
  }
  if (state.phase === 'done') {
    const imported = state.items.filter((item) => item.status === 'IMPORTED').length;
    const failed = state.items.filter((item) => item.status === 'FAILED' || item.status === 'INVALID').length;
    return (
      <div className="flex flex-col gap-4">
        <Alert tone={failed > 0 ? 'warning' : 'success'}>
          <strong>{text.done.title}.</strong> {text.done.summary(imported, failed)}
        </Alert>
        <Problems items={state.items} />
        <div className="flex gap-3">
          <ButtonLink href="/clientes">{text.done.goToClients}</ButtonLink>
          <Button variant="outline" onClick={reset}>
            {text.done.again}
          </Button>
        </div>
      </div>
    );
  }
  if (state.phase === 'review') {
    const ready = state.items.filter((item) => item.status === 'READY').length;
    const invalid = state.items.length - ready;
    return (
      <div className="flex flex-col gap-4">
        <Text as="h2" variant="h3">
          {text.review.title}
        </Text>
        <Alert tone={ready > 0 ? 'info' : 'warning'}>
          {ready > 0 ? text.review.ready(ready) : text.review.nothing}
          {invalid > 0 && ` · ${text.review.invalid(invalid)}`}
        </Alert>
        <Problems items={state.items} />
        <div className="flex gap-3">
          <Button disabled={ready === 0} onClick={() => void confirm()}>
            {text.review.confirm(ready)}
          </Button>
          <Button variant="outline" onClick={reset}>
            {text.review.cancel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <Text>{text.intro.description}</Text>
      <ol className="list-decimal pl-6 text-body">
        {text.intro.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={downloadTemplate}>
          {text.intro.template}
        </Button>
        <Button onClick={() => input.current?.click()}>{text.intro.pick}</Button>
        <input
          ref={input}
          type="file"
          accept=".xlsx,.csv"
          aria-label={text.intro.pickLabel}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) void choose(file);
          }}
        />
      </div>
    </div>
  );
}
