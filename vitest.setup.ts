import '@testing-library/jest-dom/vitest';

// jsdom no implementa `<dialog>` modal: se simula lo justo (abrir y cerrar) para probar los diálogos de confirmación.
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal ??= function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close ??= function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
}
