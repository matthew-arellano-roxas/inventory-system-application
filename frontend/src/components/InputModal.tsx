import { useState } from "react";
import { BaseModal } from "@/components/BaseModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  defaultValue?: string;
  label: string;
  placeholder?: string;
}

export function InputModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  defaultValue = "",
  label,
  placeholder,
}: InputModalProps) {
  // We initialize state directly.
  // Because we use a 'key' on the BaseModal below,
  // this state resets every time the modal opens.
  const [value, setValue] = useState(defaultValue);

  return (
    <BaseModal
      key={isOpen ? "open" : "closed"} // This forces a reset when isOpen changes
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit(value);
              setValue("");
            }}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="modal-input">{label}</Label>
        <Input
          id="modal-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus
        />
      </div>
    </BaseModal>
  );
}
