import type { CategoryResponse } from "@/types/api/response";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useCategoryMutation } from "./useCategoryMutation";
import { useQueryParams } from "./useQueryParams";

export type ModalView =
  | "IDLE"
  | "CATEGORY_FORM"
  | "PRODUCT_CREATE_FORM"
  | "SELECTION_MENU";

type CategoryModalStates = {
  title: string;
  label: string;
  placeholder: string;
  isEditing: boolean;
  selectedCategoryToEdit: number | null;
};

export function useCategoryActions(
  setActiveModal: Dispatch<SetStateAction<ModalView>>,
) {
  const [selectedCategory, setSelectedCategory] = useState<number | string>();

  const {
    create: createCategory,
    update: updateCategory,
    remove: removeCategory,
  } = useCategoryMutation();

  const { setParams } = useQueryParams();

  const [categoryModal, setCategoryModal] = useState<CategoryModalStates>({
    title: "New Category",
    label: "Category",
    placeholder: "Input category name",
    isEditing: false,
    selectedCategoryToEdit: null,
  });

  const handleSelectCategory = (catId: string | number) => {
    if (catId) {
      setSelectedCategory(catId);
      setParams({ categoryId: catId });
    } else {
      setSelectedCategory(catId);
      setParams({ categoryId: null });
    }
  };

  const handleUpdateCategory = async (category: CategoryResponse) => {
    setCategoryModal((prev) => ({
      ...prev,
      title: "Update Category",
      label: "Category",
      placeholder: "Input category name",
      isEditing: true,
      selectedCategoryToEdit: category.id,
    }));
    setActiveModal("CATEGORY_FORM");
  };

  const handleCategoryDelete = (category: CategoryResponse) => {
    removeCategory.mutate(category.id);
  };

  // Category Modal
  const handleCategoryModalClose = () => {
    setActiveModal("IDLE");
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
    setActiveModal("IDLE");
  };

  return {
    categoryModal,
    selectedCategory,
    setSelectedCategory,
    setCategoryModal,
    handleSelectCategory,
    handleUpdateCategory,
    handleCategoryDelete,
    handleCategoryModalClose,
    handleCategoryModalSubmit,
  };
}
