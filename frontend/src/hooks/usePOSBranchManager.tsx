import type { BranchResponse } from "@/types/api/response";
import { useBranchMutation } from "./useBranchMutation";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";

type ModalState = {
  editing: boolean;
  isOpen: boolean;
  defaultValue: string;
  title: string;
  branchId: number | null;
};

export const usePOSBranchManager = () => {
  const { remove, create, update } = useBranchMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const [modal, setModal] = useState<ModalState>({
    editing: false,
    isOpen: false,
    defaultValue: "",
    title: "",
    branchId: null as number | null,
  });

  const handleBranchView = (branch: BranchResponse) => {
    const currentPath = location.pathname;
    navigate(`${currentPath}/${branch.id}`);
  };

  const handleOnModalSubmit = async (name: string) => {
    console.log(modal.branchId);
    if (modal.editing && modal.branchId) {
      console.log(modal.branchId);
      await update.mutate({ id: modal.branchId, name });
    } else {
      await create.mutate(name);
    }
    setModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleBranchDelete = async (branch: BranchResponse) => {
    remove.mutate(branch.id, {});
  };

  const handleBranchRename = async (branch: BranchResponse) => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
      defaultValue: branch.name,
      editing: true,
      title: "Rename Branch",
      branchId: branch.id,
    }));
  };

  const handleOnModalClose = () => {
    setModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleAddBranch = () => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
      title: "Add Branch",
      editing: false,
      defaultValue: "",
    }));
  };

  return {
    handleBranchView,
    handleBranchDelete,
    handleBranchRename,
    handleOnModalSubmit,
    handleOnModalClose,
    handleAddBranch,
    modal,
  };
};
