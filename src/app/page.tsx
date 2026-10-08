import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Fiaro
        </h1>
        <p className="max-w-sm text-muted-foreground">
          Panel de gestión de cartera, cobradores y mora en tiempo real.
        </p>
      </div>
      <Link
        href="/login"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}
