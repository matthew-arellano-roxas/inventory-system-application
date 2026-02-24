import { useEffect, useState, forwardRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DebouncedSearchProps {
  onSearch: (value: string) => void;
  defaultValue?: string; // <--- New Prop
  placeholder?: string;
  label?: string;
  delay?: number;
  className?: string;
}

export const DebouncedSearch = forwardRef<
  HTMLInputElement,
  DebouncedSearchProps
>(function DebouncedSearch(
  {
    onSearch,
    defaultValue = "", // Default to empty string
    placeholder = "Search...",
    label = "Search",
    delay = 500,
    className,
  },
  ref,
) {
  // 1. Initialize state with the defaultValue
  const [displayValue, setDisplayValue] = useState(defaultValue);

  // 2. Keep displayValue in sync if defaultValue changes externally
  // (e.g., user hits "back" in browser or clicks a clear filter button elsewhere)
  useEffect(() => {
    setDisplayValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    // Only trigger onSearch if the value is different from the current logic
    const handler = window.setTimeout(() => {
      onSearch(displayValue);
    }, delay);

    return () => window.clearTimeout(handler);
  }, [displayValue, delay, onSearch]);

  const handleClear = () => {
    setDisplayValue("");
    onSearch("");
  };

  return (
    <div className={className}>
      <Label className="text-xs font-semibold ml-1 uppercase text-muted-foreground mb-2">
        {label}
      </Label>

      <div className="relative w-full min-w-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          ref={ref}
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full min-w-0 pl-9 pr-9 shadow-sm truncate placeholder:truncate"
        />

        {displayValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
            onClick={handleClear}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
});
