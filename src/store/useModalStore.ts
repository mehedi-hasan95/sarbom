import { create } from "zustand";

interface ModalStore {
  openId: string | null;
  data: unknown;
  open: (id: string, data?: unknown) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  openId: null,
  data: null,
  open: (id, data = null) => set({ openId: id, data }),
  // keep `data` so the content doesn't vanish during the close animation
  close: () => set({ openId: null }),
}));
