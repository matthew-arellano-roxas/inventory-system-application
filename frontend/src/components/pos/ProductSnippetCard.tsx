import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Package, MoreVertical, Pencil, Trash2 } from "lucide-react";

export interface ProductSnippet {
  id: number;
  name: string;
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
  return (
    <Card
      onClick={() => onCardClick(product)}
      className="group relative flex flex-col items-center justify-center p-4 transition-all cursor-pointer overflow-hidden min-h-[130px] border-muted hover:border-muted-foreground/20 hover:bg-accent/30 bg-background shadow-sm"
    >
      {/* 3-DOT MENU (TOP RIGHT) */}
      <div className="absolute top-1 right-1 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-secondary"
              onClick={(e) => e.stopPropagation()} // Prevents opening card details
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onUpdate(product)}>
              <Pencil className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(product)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* CENTER CONTENT */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Package className="h-5 w-5" />
        </div>

        <div className="px-1 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase">
            #{product.id}
          </p>
          <h3 className="text-xs font-semibold leading-tight line-clamp-2 text-foreground">
            {product.name}
          </h3>
        </div>
      </div>
    </Card>
  );
}
