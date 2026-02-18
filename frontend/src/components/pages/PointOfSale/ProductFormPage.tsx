import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type CreateProductPayload } from "@/types/api/payload";
import { Unit } from "@/types/api/shared";
import { Form } from "react-router";
import { Package } from "lucide-react";

const initialState: CreateProductPayload = {
  name: "",
  costPerUnit: 0,
  soldBy: Unit.KG,
  sellingPrice: 0,
  addedBy: "",
  categoryId: 0,
  branchId: 0,
};

export const ProductFormPage: React.FC = () => {
  const [form, setForm] = useState<CreateProductPayload>(initialState);

  const handleChange =
    (field: keyof CreateProductPayload) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleUnitChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      soldBy: value as Unit,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-2 md:p-4 lg:p-6">
      <div className="grid w-full max-w-6xl lg:grid-cols-2 rounded-2xl border shadow-sm overflow-hidden">
        {/* LEFT SIDE — FORM */}
        <div className="bg-card p-10">
          <Form onSubmit={handleSubmit} className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Create Product
              </h2>
              <p className="text-muted-foreground mt-2">
                Enter product details below.
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={handleChange("name")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPerUnit">Cost Per Unit</Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  step="any"
                  value={form.costPerUnit}
                  onChange={handleChange("costPerUnit")}
                />
              </div>

              <div className="space-y-2">
                <Label>SOLD BY</Label>
                <Select value={form.soldBy} onValueChange={handleUnitChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Unit.KG}>KG</SelectItem>
                    <SelectItem value={Unit.PC}>PC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="any"
                  value={form.sellingPrice}
                  onChange={handleChange("sellingPrice")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addedBy">Added By</Label>
                <Input
                  id="addedBy"
                  value={form.addedBy}
                  onChange={handleChange("addedBy")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category ID</Label>
                <Input
                  id="categoryId"
                  type="number"
                  value={form.categoryId}
                  onChange={handleChange("categoryId")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchId">Branch ID</Label>
                <Input
                  id="branchId"
                  type="number"
                  value={form.branchId}
                  onChange={handleChange("branchId")}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </div>

        {/* RIGHT SIDE — HERO PANEL */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-muted/40 p-12 text-center">
          <Package className="h-40 w-40 text-primary mb-8 drop-shadow-sm" />

          <h3 className="text-3xl font-semibold">Product Setup</h3>

          <p className="text-muted-foreground mt-4 max-w-sm leading-relaxed">
            Configure pricing, unit measurement, category, and branch assignment
            before saving.
          </p>
        </div>
      </div>
    </div>
  );
};
