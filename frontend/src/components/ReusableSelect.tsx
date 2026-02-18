  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Label } from "@/components/ui/label";
  import { cn } from "@/lib/utils";

  // Generic T extends record so we can pass any object type (like CategoryResponse)
  interface ReusableSelectProps<T> {
    items: T[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    itemKey: keyof T; // What unique ID to use (e.g., 'id')
    itemLabel: keyof T; // What to display (e.g., 'name')
    showAllOption?: boolean;
    className?: string;
  }

  export function ReusableSelect<T extends { [key: string]: unknown }>({
    items,
    value,
    onValueChange,
    placeholder = "Select an option",
    label,
    itemKey,
    itemLabel,
    showAllOption = true,
    className,
  }: ReusableSelectProps<T>) {
    return (
      <div className={cn("grid w-full gap-1.5", className)}>
        {label && (
          <Label className="text-xs font-semibold ml-1 uppercase text-muted-foreground">
            {label}
          </Label>
        )}
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full h-9 bg-background shadow-sm">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {showAllOption && <SelectItem value="all">All Items</SelectItem>}
            {items.map((item) => (
              <SelectItem
                key={String(item[itemKey])}
                value={String(item[itemKey])}
              >
                {String(item[itemLabel])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
