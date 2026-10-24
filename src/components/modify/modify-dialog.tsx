"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/store/useModalStore";
import { cn } from "cn";
import { JSX } from "react";

interface Props {
  children: React.ReactNode;
  trigger?: JSX.Element;
  title?: string;
  description?: string;
  className?: string;
}
export const ModifyDialog = ({
  children,
  className,
  description,
  title,
  trigger = <Button variant="outline">Open</Button>,
}: Props) => {
  const open = useDialogStore((state) => state.open);
  const setOpen = useDialogStore((state) => state.setOpen);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger render={trigger} />
        <DialogContent className={cn("sm:max-w-sm", className)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </form>
    </Dialog>
  );
};
