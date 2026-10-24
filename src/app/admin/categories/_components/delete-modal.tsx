"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteResponse {
  error?: unknown;
  data?: string;
}
interface Props {
  id: string | null;
  onClose: () => void;
  queryKey: readonly unknown[];
  deleteFn: (id: string) => Promise<DeleteResponse>;
  title?: string;
}

export const DeleteCategoryDialog = ({
  id,
  onClose,
  queryKey,
  deleteFn,
  title,
}: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteFn,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(String(data.error));
        return;
      }
      queryClient.invalidateQueries({ queryKey: queryKey });
      toast.success(data.data);
      onClose();
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <Dialog
      open={!!id}
      onOpenChange={(open) => {
        // block closing (overlay click, Esc, X button) while deleting
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              if (id) mutate(id);
            }}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
