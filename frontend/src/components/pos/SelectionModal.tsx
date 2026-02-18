import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  title: string;
  items: string[]; // Simple array of strings
  defaultValue?: string;
}

export function SelectionModal({
  isOpen,
  onClose,
  onSelect,
  title,
  items,
  defaultValue = "",
}: SelectionModalProps) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <BaseModal
      key={isOpen ? "open" : "closed"} // Reset state when modal opens/closes
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex w-full gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => onSelect(selected)}
            disabled={!selected}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => setSelected(item)}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-md text-sm transition-all border",
              selected === item
                ? "border-primary bg-primary/5 font-medium text-primary"
                : "border-transparent hover:bg-muted text-muted-foreground",
            )}
          >
            {item}
            {selected === item && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </BaseModal>
  );
}
