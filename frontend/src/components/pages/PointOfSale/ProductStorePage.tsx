import { useState } from "react";
import { Plus, ShoppingCart, Store } from "lucide-react";

// Components
import { ProductActionModal } from "@/components/pos/ProductActionModal";
import { ProductSnippetCard } from "@/components/pos/ProductSnippetCard";
import { SelectionModal as NewItemModal } from "@/components/pos/SelectionModal";
import { Tooltip } from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { DebouncedSearch } from "@/components/DebouncedSearch";
import { ManagedSelect } from "@/components/pos/ManagedSelect";
import { InputModal } from "@/components/InputModal";
import { Badge } from "@/components/ui/badge"; // Recommended for the cart count

// Types & Mock
import { MOCK_PRODUCT_SNIPPETS } from "@/mock/mock.product";
import { MOCK_PRODUCT_INFO } from "@/mock/mock.inventory";
import type { CategoryResponse } from "@/types/api/response/category.response";
import type {
  Product,
  ProductSnippet,
} from "@/types/api/response/product.response";

export function ProductStorePage({
  products = MOCK_PRODUCT_SNIPPETS,
}: {
  products?: ProductSnippet[];
}) {
  const [selectedCategoryId, setCategorySelectedId] = useState<number | string>(
    101,
  );
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modal States
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [iseEditCategoryModalOpen, setIsEditCategoryModalOpen] =
    useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);

  // Active Item States
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);

  // Mock Cart Count (You should link this to your actual cart state later)
  const cartCount = 3;

  const options = ["Product", "Category"];
  const categories: CategoryResponse[] = [
    { id: 101, name: "Beverages", createdAt: "2026-02-01T10:15:00.000Z" },
    { id: 102, name: "Snacks", createdAt: "2026-02-03T08:20:00.000Z" },
  ];

  const getProduct = (id: number) =>
    MOCK_PRODUCT_INFO.find((p) => p.id === id) ?? null;

  const handleView = (p: ProductSnippet) => {
    const product = getProduct(p.id);
    if (product) {
      setSelectedProduct(product);
      setIsModelOpen(true);
    }
  };

  return (
    <div className="relative pb-24 mx-8">
      <div className="flex flex-col gap-1 border-b pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tighter uppercase text-slate-900">
            Product Catalog
          </h1>
        </div>
        <p className="text-sm font-medium text-muted-foreground pl-[52px]">
          Manage your inventory and process sales transactions.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:w-80">
            <DebouncedSearch onSearch={() => {}} />
          </div>
          <Tooltip description="Add new content">
            <Button
              variant="default"
              size="icon"
              onClick={() => setIsNewItemModalOpen(true)}
              className="mt-6"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>

        <ManagedSelect
          className="w-full sm:max-w-[200px]"
          options={categories}
          value={selectedCategoryId}
          placeholder="Category"
          onSelect={(id) => setCategorySelectedId(id)}
          onUpdate={(cat) => {
            setEditingCategory(cat);
            setIsEditCategoryModalOpen(true);
          }}
          onDelete={(cat) => console.log("Delete", cat.id)}
        />
      </div>
      {/* --- PRODUCT GRID --- */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
      >
        {products.map((product) => (
          <ProductSnippetCard
            key={product.id}
            product={product}
            onUpdate={(p) => console.log("Update", p.name)}
            onDelete={(p) => console.log("Delete", p.id)}
            onCardClick={handleView}
          />
        ))}
      </div>
      {/* --- MODALS --- */}
      <ProductActionModal
        product={selectedProduct}
        isOpen={isModelOpen}
        onClose={() => setIsModelOpen(false)}
        onSubmit={(p, q, type) => console.log(type, p.name, q)}
      />
      <NewItemModal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        title="Create New"
        items={options}
        onSelect={(value) => {
          if (value === "Category") setIsNewCategoryModalOpen(true);
        }}
      />
      <InputModal
        key={editingCategory?.id} // Reset state on change
        isOpen={iseEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        onSubmit={(val) => console.log("Update Category", val)}
        title="Edit Category"
        label="Category Name"
        defaultValue={editingCategory?.name}
      />
      <InputModal
        isOpen={isNewCategoryModalOpen}
        onClose={() => setIsNewCategoryModalOpen(false)}
        onSubmit={(val) => console.log("New Category", val)}
        title="New Category"
        label="Category Name"
        placeholder="Enter category name..."
      />
      {/* --- IMPROVED CHECKOUT BUTTON --- */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[400px] px-4 animate-in slide-in-from-bottom-4 duration-300">
          <Button className="w-full h-14 rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-between px-6 text-lg font-bold transition-all hover:scale-105 active:scale-95">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-3 -right-3 h-5 w-5 flex items-center justify-center p-0 text-[10px] border-2 border-primary">
                  {cartCount}
                </Badge>
              </div>
              <span>Checkout</span>
            </div>
            <p className="opacity-90">₱1,250.00</p>
          </Button>
        </div>
      )}
    </div>
  );
}
