/**
 * Hace que el navegador descargue un archivo que ya está en memoria. Crea un enlace temporal a la
 * URL del `Blob`, lo pulsa y libera la URL, sin dejar nada en la página.
 */
export function saveFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
