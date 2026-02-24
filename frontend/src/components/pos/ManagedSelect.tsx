import * as React from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "../ui/label";

interface ManagedSelectProps<T extends { id: number | string; name: string }> {
  options: T[];
  value?: string | number;
  placeholder?: string;
  onSelect: (id: string | number) => void;
  onUpdate?: (option: T) => void;
  onDelete?: (option: T) => void;
  className?: string;
  triggerClassName?: string;
  label?: string;
}

export function ManagedSelect<T extends { id: number | string; name: string }>({
  options,
  value,
  placeholder = "Select option...",
  onSelect,
  onUpdate,
  onDelete,
  className,
  triggerClassName,
  label,
}: ManagedSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <Label className="text-xs font-semibold ml-1 uppercase text-muted-foreground mb-2">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between px-3", triggerClassName)}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)]"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    onSelect={() => {
                      // If the clicked ID is already the value, send an empty string to unselect
                      const newValue = value === option.id ? "" : option.id;
                      onSelect(newValue);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between group px-2 py-1.5"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          value === option.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span className="truncate text-sm font-medium">
                        {option.name}
                      </span>
                    </div>

                    <div
                      className="flex shrink-0 ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-8 w-8 transition-opacity",
                              /* Always visible on touch, hover-only on desktop */
                              "opacity-100 @media(hover:hover){opacity-0 group-hover:opacity-100}",
                            )}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[140px]">
                          {onUpdate && (
                            <DropdownMenuItem onClick={() => onUpdate(option)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(option)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
