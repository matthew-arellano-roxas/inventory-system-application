import { DebouncedSearch } from "@/components/DebouncedSearch";
import { ProductFormModal } from "@/components/forms/ProductFormModal";
import { InputModal } from "@/components/InputModal";
import { ManagedSelect } from "@/components/pos/ManagedSelect";
import { ProductSnippetCard } from "@/components/pos/ProductSnippetCard";
import { SelectionModal } from "@/components/pos/SelectionModal";
import { Tooltip } from "@/components/ToolTip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCategoryMutation } from "@/hooks/useCategoryMutation";
import { usePosCatalogQueries } from "@/hooks/usePosCatalogQueries";
import type { CategoryResponse } from "@/types/api/response";
import { Plus, ShoppingBasket, Store } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";

type CategoryModalStates = {
  isOpen: boolean;
  title: string;
  label: string;
  placeholder: string;
  isEditing: boolean;
  selectedCategoryToEdit: number | null;
};

type ModalView = "IDLE" | "CATEGORY_FORM" | "PRODUCT_FORM" | "SELECTION_MENU";

export function ProductSelectionPage() {
  const { branchList, categoryList, productList, isPending } =
    usePosCatalogQueries();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState<ModalView>("IDLE");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const {
    create: createCategory,
    update: updateCategory,
    remove: removeCategory,
  } = useCategoryMutation();

  const [categoryModal, setCategoryModal] = useState<CategoryModalStates>({
    isOpen: false,
    title: "New Category",
    label: "Category",
    placeholder: "Input category name",
    isEditing: false,
    selectedCategoryToEdit: null,
  });

  const [newItemModal, setNewItemModal] = useState({
    isOpen: false,
    title: "New Item",
    defaultValue: "",
    items: ["Category", "Product"],
  });

  const [selectedCategory, setSelectedCategory] = useState<number | string>();

  // Search
  const handleSearch = (value: string) => {
    if (!value) {
      setSearchParams((prev) => {
        prev.delete("search");
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.set("search", value);
        return prev;
      });
    }
  };

  // Category Select
  const handleSelectCategory = (catId: string | number) => {
    if (catId) {
      setSelectedCategory(catId);
      setSearchParams((prev) => {
        prev.set("category", String(catId));
        return prev;
      });
    } else {
      setSelectedCategory(catId);
      setSearchParams((prev) => {
        prev.delete("category");
        return prev;
      });
    }
  };

  const handleUpdateCategory = async (category: CategoryResponse) => {
    setCategoryModal((prev) => ({
      ...prev,
      isOpen: true,
      title: "Update Category",
      label: "Category",
      placeholder: "Input category name",
      isEditing: true,
      selectedCategoryToEdit: category.id,
    }));
  };

  const handleCategoryDelete = (category: CategoryResponse) => {
    removeCategory.mutate(category.id);
  };

  // New Item
  const handleNewItemModalSelect = (value: string) => {
    if (value === "Category") {
      setCategoryModal((prev) => ({
        ...prev,
        isOpen: true,
        isEditing: false,
        title: "New Category",
        label: "Category",
        placeholder: "Input category name",
      }));
    } else {
      setIsProductModalOpen(true);
    }
    setNewItemModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNewItemModalClose = () => {
    setNewItemModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Category Modal
  const handleCategoryModalClose = () => {
    setCategoryModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCategoryModalSubmit = (value: string) => {
    if (categoryModal.isEditing) {
      updateCategory.mutate({
        id: categoryModal.selectedCategoryToEdit!,
        newData: { name: value },
      });
    } else {
      createCategory.mutate(value);
    }
    setCategoryModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="relative pb-24 mx-8">
      <SubHeader />
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:w-80">
            <DebouncedSearch onSearch={handleSearch} />
          </div>
          <Tooltip description="Add new content">
            <Button
              variant="default"
              size="icon"
              onClick={() =>
                setNewItemModal((prev) => ({ ...prev, isOpen: true }))
              }
              className="mt-6"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>

        <ManagedSelect
          label="Category"
          className="w-full sm:max-w-[200px]"
          value={selectedCategory}
          options={categoryList}
          placeholder="Select Category"
          onSelect={handleSelectCategory}
          onUpdate={handleUpdateCategory}
          onDelete={handleCategoryDelete}
        />
      </div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
      >
        {productList.map((product) => (
          <ProductSnippetCard
            key={product.id}
            product={product}
            onUpdate={(p) => console.log("Update", p.name)}
            onDelete={(p) => console.log("Delete", p.id)}
            onCardClick={(p) => console.log("Delete", p.id)}
          />
        ))}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[400px] px-4 animate-in slide-in-from-bottom-4 duration-300">
          <Button className="w-full h-14 rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-between px-6 text-lg font-bold transition-all hover:scale-105 active:scale-95">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBasket className="h-6 w-6" />
                <Badge className="absolute -top-3 -right-3 h-5 w-5 flex items-center justify-center p-0 text-[10px] border-2 border-primary">
                  10
                </Badge>
              </div>
              <span>Checkout</span>
            </div>
            <p className="opacity-90">₱1,250.00</p>
          </Button>
        </div>
      </div>
      <InputModal
        isOpen={categoryModal.isOpen}
        title={categoryModal.title}
        label={categoryModal.label}
        placeholder={categoryModal.placeholder}
        onClose={handleCategoryModalClose}
        autoComplete={false}
        onSubmit={handleCategoryModalSubmit}
      />
      <SelectionModal
        {...newItemModal}
        onSelect={handleNewItemModalSelect}
        onClose={handleNewItemModalClose}
      />
      <ProductFormModal
        setIsOpen={(state) => setIsProductModalOpen(state)}
        categoryList={categoryList}
        branchList={branchList}
        isOpen={isProductModalOpen}
      />
    </div>
  );
}

function SubHeader() {
  return (
    <div className="space-y-1 mb-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
          <Store className="h-5 w-5" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-black tracking-tighter uppercase text-slate-900">
          Point of Sale
        </h1>
      </div>
      <p className="text-sm font-medium text-muted-foreground pl-[52px]">
        Select a branch to begin processing transactions.
      </p>
    </div>
  );
}
