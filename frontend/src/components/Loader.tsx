export function Loader({ className }: { className?: string }) {
  return (
    <div className={className ?? "flex items-center justify-center h-40"}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
