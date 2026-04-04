import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Package, Pencil, Trash2 } from "lucide-react";

export interface ProductSnippet {
  id: number;
  name: string;
}

const CARD_ACCENTS = [
  {
    shell:
      "border-orange-200/70 bg-gradient-to-br from-orange-50 via-background to-amber-100/70 hover:border-orange-300/80 dark:border-orange-500/20 dark:from-orange-950/45 dark:via-card dark:to-amber-950/30 dark:hover:border-orange-400/40",
    orb: "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 dark:shadow-orange-950/40",
    glow: "bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.20),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.14),_transparent_55%)]",
  },
  {
    shell:
      "border-sky-200/70 bg-gradient-to-br from-sky-50 via-background to-cyan-100/70 hover:border-sky-300/80 dark:border-sky-500/20 dark:from-sky-950/45 dark:via-card dark:to-cyan-950/30 dark:hover:border-sky-400/40",
    orb: "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/20 dark:shadow-sky-950/40",
    glow: "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_55%)]",
  },
  {
    shell:
      "border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-background to-lime-100/70 hover:border-emerald-300/80 dark:border-emerald-500/20 dark:from-emerald-950/45 dark:via-card dark:to-lime-950/30 dark:hover:border-emerald-400/40",
    orb: "bg-gradient-to-br from-emerald-500 to-lime-500 text-white shadow-md shadow-emerald-500/20 dark:shadow-emerald-950/40",
    glow: "bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.20),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_55%)]",
  },
  {
    shell:
      "border-rose-200/70 bg-gradient-to-br from-rose-50 via-background to-fuchsia-100/70 hover:border-rose-300/80 dark:border-rose-500/20 dark:from-rose-950/45 dark:via-card dark:to-fuchsia-950/30 dark:hover:border-rose-400/40",
    orb: "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20 dark:shadow-rose-950/40",
    glow: "bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.20),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.14),_transparent_55%)]",
  },
];

function getCardAccent(id: number) {
  return CARD_ACCENTS[id % CARD_ACCENTS.length];
}

function getProductInitial(name: string) {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed[0]?.toUpperCase() : "P";
}

interface ProductSnippetCardProps {
  product: ProductSnippet;
  onUpdate: (product: ProductSnippet) => void;
  onDelete: (product: ProductSnippet) => void;
  onCardClick: (product: ProductSnippet) => void;
}

export function ProductSnippetCard({
  product,
  onUpdate,
  onDelete,
  onCardClick,
}: ProductSnippetCardProps) {
  const accent = getCardAccent(product.id);
  const initial = getProductInitial(product.name);

  return (
    <Card
      onClick={() => onCardClick(product)}
      className={`group relative min-h-[108px] cursor-pointer overflow-hidden p-0 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-card/90 ${accent.shell}`}
    >
      <div className={`pointer-events-none absolute inset-0 opacity-100 ${accent.glow}`} />

      <div className="absolute right-2 top-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-white/70 backdrop-blur hover:bg-white dark:bg-background/70 dark:hover:bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-32"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(product);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative flex h-full flex-col p-3">
        <div className="flex items-start gap-3 pr-10">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-md ${accent.orb}`}>
            <span className="text-sm font-black tracking-tight">{initial}</span>
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="break-words text-sm font-black leading-tight tracking-tight text-foreground">
              {product.name}
            </h3>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground/80">
              #{product.id}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/80 text-foreground shadow-sm dark:bg-background/80 dark:text-foreground">
            <Package className="h-4 w-4" />
          </div>
          <span>Tap to order</span>
        </div>
      </div>
    </Card>
  );
}
