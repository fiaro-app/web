/**
 * Longitud de contraseña que exige la API (`modules/auth/domain/policies/password.policy.ts`).
 * Hoy no viaja en `@fiaro-app/contracts`, así que se replica aquí; debe moverse al contrato para
 * que un cambio en la API no deje a la web validando otra cosa.
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
