import { Button } from "@/components/ui/button";
import { CheckSquare, X, ShoppingCart } from "lucide-react";
interface SelectionToolbarProps {
  isSelectionMode: boolean;
  selectedCount: number;
  onEnterMode: () => void;
  onCancel: () => void;
  onBulkAction: () => void;
}

export function SelectionToolbar({
  isSelectionMode,
  selectedCount,
  onEnterMode,
  onCancel,
  onBulkAction
}: SelectionToolbarProps) {
  return (
    <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4 mb-4">
      <div className="flex items-center justify-between gap-2 py-2">
        {/* Left Side: Mode Toggle */}
        <div className="flex items-center gap-2 min-w-0">
          {isSelectionMode ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="h-8 px-2 lg:px-3"
            >
              <X className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Cancel</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEnterMode}
              className="h-8"
            >
              <CheckSquare className="h-4 w-4 sm:mr-2" />
              <span className="text-xs sm:text-sm">Select Multiple</span>
            </Button>
          )}
          
          {isSelectionMode && (
            <div className="flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">
                {selectedCount} Selected
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Actions (Hidden if nothing selected to save space) */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-1.5">
             <Button 
              size="sm" 
              onClick={onBulkAction} 
              className="h-8 px-3 shadow-lg animate-in fade-in zoom-in duration-200"
            >
              <ShoppingCart className="h-4 w-4 sm:mr-2" />
              <span className="text-xs sm:text-sm">Bulk Add</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}