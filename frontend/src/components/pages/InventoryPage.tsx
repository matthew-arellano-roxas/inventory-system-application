import { MOCK_PRODUCT_INFO, MOCK_PRODUCT_REPORTS } from "@/mock/mock.inventory";
import { InventoryTable } from "../inventory/InventoryTable";
import { StockMovementFeed } from "./StockMovementFeed";
import { MOCK_STOCK_MOVEMENTS } from "@/mock/mock.stock-movement";
import { ReusableSelect } from "@/components//ReusableSelect";
import { useState } from "react";
import { MOCK_BRANCHES } from "@/mock/mock.branches";
export const InventoryPage = () => {
  const [selectedId, setSelectedId] = useState("all");
  return (
    <div className="max-w-[clamp(260px,50vw,100vw)] mx-auto lg:max-w-full lg:px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b mb-6">
        {/* Left Side: Text Content */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Inventory Dashboard
          </h1>
          <p className="text-muted-foreground text-sm max-w-[500px]">
            Manage your product information and view performance reports for
            your selected branch.
          </p>
        </div>

        {/* Right Side: Select Input */}
        <div className="w-full md:w-[200px] shrink-0">
          <ReusableSelect
            label="Branch Location"
            items={MOCK_BRANCHES}
            value={selectedId}
            onValueChange={(val) => setSelectedId(val)}
            itemKey="id"
            itemLabel="name"
            placeholder="Select Branch"
            showAllOption={false}
            // Use triggerClassName if you want to make the select box look more robust
          />
        </div>
      </div>

      <InventoryTable
        infoData={MOCK_PRODUCT_INFO}
        reportData={MOCK_PRODUCT_REPORTS}
        className="mb-8"
      />
      <div className="flex flex-col gap-1 mb-4 ">
        <h1 className="text-2xl font-bold tracking-tight">
          Stock Movements Feed
        </h1>
        <p className="text-muted-foreground text-sm">
          View recent stock movements in your store.
        </p>
      </div>

      <StockMovementFeed movements={MOCK_STOCK_MOVEMENTS} />
    </div>
  );
};
