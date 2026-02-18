import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryResponse } from "@/types/api/response/category.response";

interface FilterProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  categories: CategoryResponse[];
}

export const ProductFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: FilterProps) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id.toString()}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
