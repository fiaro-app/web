/**
 * Genera un UUID versión 7 (ordenable por tiempo): 48 bits de milisegundos y el resto aleatorio.
 * La API pide un UUID generado por el cliente como llave de idempotencia de cada visita de cobro
 * (reenviar la misma visita nunca duplica el pago).
 */
export function uuidv7(now: number = Date.now(), random: (length: number) => Uint8Array = randomBytes): string {
  const bytes = random(16);
  for (let index = 0; index < 6; index += 1) {
    bytes[index] = Math.floor(now / 2 ** (8 * (5 - index))) % 256;
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // versión 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante RFC 4122
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}
