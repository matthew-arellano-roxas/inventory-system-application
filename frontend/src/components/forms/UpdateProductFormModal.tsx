import {
  createProductSchema,
  type CreateProductPayload,
  type UpdateProductPayload,
} from "@/schemas/ProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Loader } from "../Loader";
import { Unit } from "@/types/api/shared";
import { useProductMutation } from "@/hooks/useProductMutation";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type { BranchResponse, CategoryResponse } from "@/types/api/response";

type ProductFormProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  branchList: BranchResponse[];
  categoryList: CategoryResponse[];
};

export function UpdateProductFormModal({
  isOpen,
  setIsOpen,
  categoryList,
  branchList,
}: ProductFormProps) {
  const { update } = useProductMutation();
  const { isLoading: isEmailLoading, user } = useAuth0();

  const form = useForm<UpdateProductPayload>({
    resolver: zodResolver(createProductSchema),
    mode: "onBlur",
    defaultValues: {
      soldBy: Unit.PC, // keeps select controlled and valid
    },
  });

  async function onSubmitFn(data: UpdateProductPayload) {
    await update.mutate(data);
    setIsOpen(false);
    form.reset();
  }

  const { errors } = form.formState;

  if (isEmailLoading) {
    return <Loader />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          <form id="product-form" onSubmit={form.handleSubmit(onSubmitFn)}>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Product Name</FieldLabel>
                <Input
                  id="name"
                  {...form.register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <FieldError errors={[errors.name]} />}
              </Field>

              <Field data-invalid={!!errors.costPerUnit}>
                <FieldLabel htmlFor="costPerUnit">Cost per unit</FieldLabel>
                <Input
                  id="costPerUnit"
                  type="number"
                  step="any"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-invalid={!!errors.costPerUnit}
                  {...form.register("costPerUnit", { valueAsNumber: true })}
                />
                {errors.costPerUnit && (
                  <FieldError errors={[errors.costPerUnit]} />
                )}
              </Field>

              <Field data-invalid={!!errors.sellingPrice}>
                <FieldLabel htmlFor="sellingPrice">Selling price</FieldLabel>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="any"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-invalid={!!errors.sellingPrice}
                  {...form.register("sellingPrice", { valueAsNumber: true })}
                />
                {errors.sellingPrice && (
                  <FieldError errors={[errors.sellingPrice]} />
                )}
              </Field>

              <Controller
                name="soldBy"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Sold by</FieldLabel>

                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      onOpenChange={(open) => {
                        if (!open) field.onBlur();
                      }}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid ? "true" : "false"}
                      >
                        <SelectValue placeholder="Select a Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Unit</SelectLabel>
                          <SelectItem value={Unit.PC}>Piece</SelectItem>
                          <SelectItem value={Unit.KG}>Kilogram</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>

                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                      onOpenChange={(open) => {
                        if (!open) field.onBlur();
                      }}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid ? "true" : "false"}
                      >
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {categoryList.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="branchId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Branch</FieldLabel>

                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(Number(v))} // ✅ convert to number
                      onOpenChange={(open) => {
                        if (!open) field.onBlur();
                      }}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid ? "true" : "false"}
                      >
                        <SelectValue placeholder="Select a Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Branch</SelectLabel>
                          {branchList.map((branch) => (
                            <SelectItem
                              key={branch.id}
                              value={String(branch.id)}
                            >
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>
        <div className="flex flex-row gap-2 justify-start mt-2">
          <DialogClose asChild className="flex-1">
            <Button type="button" variant="outline" form="product-form">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="flex-1" form="product-form">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
