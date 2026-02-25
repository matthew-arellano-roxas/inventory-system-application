import type { ProductReportResponse } from "@/types/api/response";

export type InventoryProduct = {
  id: number | null;
  branchId: number | null;
  categoryId: number | null;
  name: string;
  costPerUnit: number | null;
  sellingPrice: number | null;
  soldBy: string | null;
  createdAt: string | null;
};

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeProduct(raw: unknown): InventoryProduct | null {
  if (!isRecord(raw)) return null;

  const source = isRecord(raw.product) ? raw.product : raw;
  const id = asNumber(source.id);

  return {
    id,
    branchId: asNumber(source.branchId),
    categoryId: asNumber(source.categoryId),
    name:
      asString(source.name) ??
      asString(source.productName) ??
      (id != null ? `Product #${id}` : "Unnamed Product"),
    costPerUnit: asNumber(source.costPerUnit),
    sellingPrice: asNumber(source.sellingPrice),
    soldBy: asString(source.soldBy),
    createdAt: asString(source.createdAt),
  };
}

export function containsSearch(
  search: string,
  ...parts: Array<string | number | null | undefined>
) {
  if (!search.trim()) return true;
  const needle = search.toLowerCase();
  return parts.some((part) => String(part ?? "").toLowerCase().includes(needle));
}

export function getReportProductName(
  report: ProductReportResponse,
  productMap: Map<number, InventoryProduct>,
) {
  return (
    report.productName ??
    report.product?.name ??
    productMap.get(report.productId)?.name ??
    `Product #${report.productId}`
  );
}

export function SummaryPill({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "bad" | "warn";
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : tone === "bad"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : tone === "warn"
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : "border-slate-200 bg-white text-slate-900";

  return (
    <div className={`rounded-xl border p-3 shadow-sm ${toneClass}`}>
      <p className="text-[10px] uppercase tracking-widest opacity-70">{label}</p>
      <p className="mt-1 truncate text-sm font-bold leading-none">{value}</p>
    </div>
  );
}

export function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-semibold">{value}</p>
    </div>
  );
}

export function EmptyMini({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 p-4 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
