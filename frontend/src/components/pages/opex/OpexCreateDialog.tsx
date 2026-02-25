import { ReusableSelect } from "@/components/ReusableSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { BranchResponse } from "@/types/api/response";

export type OpexFormState = {
  name: string;
  branchId: string;
  amount: string;
};

type OpexCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: OpexFormState;
  onFormChange: (next: OpexFormState) => void;
  branches: BranchResponse[];
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function OpexCreateDialog({
  open,
  onOpenChange,
  form,
  onFormChange,
  branches,
  onSubmit,
  isSubmitting,
}: OpexCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create Expense</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <p className="mb-2 text-sm font-medium">Expense Name</p>
            <Input
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              placeholder="e.g. Electricity bill"
            />
          </div>

          <ReusableSelect<BranchResponse>
            label="Branch"
            items={branches}
            value={form.branchId}
            onValueChange={(value) => onFormChange({ ...form, branchId: value })}
            itemKey="id"
            itemLabel="name"
            placeholder="Select Branch"
            showAllOption={false}
          />

          <div>
            <p className="mb-2 text-sm font-medium">Amount</p>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => onFormChange({ ...form, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
