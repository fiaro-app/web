/**
 * ¿El plan trae las estadísticas avanzadas? (PDF, comparativo y reportes de riesgo, mora y desempeño;
 * D-151 de la API.) Solo Individual no las trae. Sin plan conocido (no se pudo leer) se asume que sí:
 * es la API quien las niega, y esta pantalla no debe quitarle a nadie lo que sí tiene.
 *
 * shortcut: se repite aquí lo que la API ya sabe (`FEATURES_BY_PLAN`); cuando `@fiaro-app/contracts`
 * publique `features` de `GET /subscription`, se lee de ahí.
 *
 * @param planCode - El plan del negocio, o `null` si no se conoce.
 */
export function hasAdvancedStats(planCode: string | null): boolean {
  return planCode !== 'INDIVIDUAL';
}

/**
 * ¿El plan trae la importación desde Excel? (`EXCEL_IMPORT`, D-152 de la API.) Mismo criterio y mismo
 * atajo que {@link hasAdvancedStats}: solo Individual no la trae, y sin plan conocido se asume que sí.
 *
 * @param planCode - El plan del negocio, o `null` si no se conoce.
 */
export function hasExcelImport(planCode: string | null): boolean {
  return planCode !== 'INDIVIDUAL';
}
