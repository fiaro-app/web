import { ListSkeleton } from '@/components/organisms/ListSkeleton';

/** Mientras carga cualquier pantalla del panel que no tenga su propio `loading` (el resumen sí). */
export default function AppLoading() {
  return <ListSkeleton />;
}
