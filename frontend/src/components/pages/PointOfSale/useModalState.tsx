import { useCallback, useState } from "react";

export type ModalView =
  | "IDLE"
  | "CATEGORY_FORM"
  | "PRODUCT_CREATE_FORM"
  | "SELECTION_MENU";

export function useModalState(initial: ModalView = "IDLE") {
  const [activeModal, setActiveModal] = useState<ModalView>(initial);

  const open = useCallback((modal: ModalView) => setActiveModal(modal), []);
  const close = useCallback(() => setActiveModal("IDLE"), []);

  return { activeModal, open, close };
}
