import { create } from "zustand";

interface ModalStore {
  openId: string | null;
  data: string | null;
  open: (id: string, data?: string | null) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  openId: null,
  data: null,
  open: (id, data = null) => set({ openId: id, data }),
  close: () => set({ openId: null, data: null }),
}));

export const useSetIdStore = create<{
  id: string;
  setId: (id: string) => void;
}>((set) => ({
  id: "",
  setId: (id) => set({ id }),
}));
