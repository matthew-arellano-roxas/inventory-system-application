import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DebouncedSearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  label?: string;
  delay?: number;
  className?: string;
}

export function DebouncedSearch({
  onSearch,
  placeholder = "Search...",
  label = "Search",
  delay = 500, // 500ms default debounce
  className,
}: DebouncedSearchProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(displayValue);
    }, delay);

    // Cleanup: clear timeout if user types again before delay finishes
    return () => clearTimeout(handler);
  }, [displayValue, delay, onSearch]);

  const handleClear = () => {
    setDisplayValue("");
    onSearch("");
  };

  return (
    <div>
      <Label className="text-xs font-semibold ml-1 uppercase text-muted-foreground mb-2">
        {label}
      </Label>

      <div className={`relative w-full ${className}`}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-9 h-10 shadow-sm"
        />
        {displayValue && (
          <Button
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
}
