import { create } from "zustand";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useDialogStore = create<Props>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
