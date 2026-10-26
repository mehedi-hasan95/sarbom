"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ModifyDialog } from "../modify/modify-dialog";
import { toast } from "sonner";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "../ui/button";

interface DeleteResponse {
  error?: unknown;
  data?: string;
}
interface Props {
  id: string;
  queryKey: readonly unknown[];
  deleteFn: (id: string) => Promise<DeleteResponse>;
  title?: string;
}
export const DeleteButton = ({ queryKey, deleteFn, title, id }: Props) => {
  const close = useModalStore((state) => state.close);
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
      close();
    },
    onError: () => toast.error("Something went wrong"),
  });
  return (
    <ModifyDialog
      title={title}
      description="Todo"
      trigger={<Button>Mehedi</Button>}
      id="delete_category"
      showTrigger={false}
    >
      <div className="flex gap-3 items-center">
        <Button variant="outline" onClick={close} disabled={isPending}>
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
      </div>
    </ModifyDialog>
  );
};
