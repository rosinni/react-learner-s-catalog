// Indicador de carga reutilizable.
export function Loader({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-muted-foreground">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
