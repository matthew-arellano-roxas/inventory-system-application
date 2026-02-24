import { DebouncedSearch } from "@/components/DebouncedSearch";
import { CreateProductFormModal } from "@/components/forms/CreateProductFormModal";
import { InputModal } from "@/components/InputModal";
import { Loader } from "@/components/Loader";
import { ManagedSelect } from "@/components/pos/ManagedSelect";
import { ProductSnippetCard } from "@/components/pos/ProductSnippetCard";
import { SelectionModal } from "@/components/pos/SelectionModal";
import { Tooltip } from "@/components/ToolTip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCategoryActions } from "@/hooks/useCategoryActions";
import { usePosCatalogQueries } from "@/hooks/usePosCatalogQueries";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Plus, ShoppingBasket, Store } from "lucide-react";
import { useRef, useState } from "react";
import { useParams } from "react-router";

type ModalView =
  | "IDLE"
  | "CATEGORY_FORM"
  | "PRODUCT_CREATE_FORM"
  | "SELECTION_MENU";

export function ProductSelectionPage() {
  const { branchId: branchIdParam } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchParams, getParam, setParams } = useQueryParams();
  const search = getParam("search") ?? "";
  const branchId =
    branchIdParam && !Number.isNaN(Number(branchIdParam))
      ? Number(branchIdParam)
      : null;
  const rawCategoryId = getParam("categoryId");
  const categoryId =
    rawCategoryId && !Number.isNaN(Number(rawCategoryId))
      ? Number(rawCategoryId)
      : null;
  const { branchList, categoryList, productList, isPending } =
    usePosCatalogQueries({ branchId, categoryId, search });
  const [activeModal, setActiveModal] = useState<ModalView>("IDLE");
  const {
    handleSelectCategory,
    handleUpdateCategory,
    handleCategoryDelete,
    handleCategoryModalClose,
    handleCategoryModalSubmit,
    categoryModal,
  } = useCategoryActions(setActiveModal);

  function isElementFocused(el: HTMLElement | null): boolean {
    if (!el) return false;
    return document.activeElement === el;
  }

  // Search
  const handleSearch = (value: string) => {
    const nextSearch = value.trim();
    if (
      !nextSearch &&
      isElementFocused(inputRef.current) &&
      searchParams.has("search")
    ) {
      setParams({ search: null });
      return;
    }

    setParams({ search: nextSearch || null });
  };

  // New Item
  const handleNewItemModalSelect = (value: string) => {
    if (value === "Category") {
      setActiveModal("CATEGORY_FORM");
    } else {
      setActiveModal("PRODUCT_CREATE_FORM");
    }
  };

  const handleNewItemModalClose = () => {
    setActiveModal("IDLE");
  };

  if (Object.values(isPending).every((val) => val === true)) return <Loader />;

  return (
    <div className="relative pb-24 mx-8">
      <SubHeader />
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:w-80">
            <DebouncedSearch
              delay={1000}
              onSearch={handleSearch}
              ref={inputRef}
              defaultValue={search}
            />
          </div>
          <Tooltip description="Add new content">
            <Button
              variant="default"
              size="icon"
              onClick={() => setActiveModal("SELECTION_MENU")}
              className="mt-6"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>

        <ManagedSelect
          label="Category"
          className="w-full sm:max-w-[200px]"
          value={categoryId ?? undefined}
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
        isOpen={activeModal === "CATEGORY_FORM"}
        title={categoryModal.title}
        label={categoryModal.label}
        placeholder={categoryModal.placeholder}
        onClose={handleCategoryModalClose}
        autoComplete={false}
        onSubmit={handleCategoryModalSubmit}
      />
      <SelectionModal
        title="New Item"
        items={["Category", "Product"]}
        isOpen={activeModal === "SELECTION_MENU"}
        onSelect={handleNewItemModalSelect}
        onClose={handleNewItemModalClose}
      />
      <CreateProductFormModal
        setIsOpen={(state) =>
          state ? setActiveModal("PRODUCT_CREATE_FORM") : setActiveModal("IDLE")
        }
        categoryList={categoryList}
        branchList={branchList}
        isOpen={activeModal === "PRODUCT_CREATE_FORM"}
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
