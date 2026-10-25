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
import { useModalStore } from "@/store/useModalStore";
import { cn } from "cn";
import { JSX, useId } from "react";

interface Props {
  children: React.ReactNode;
  trigger?: JSX.Element;
  title?: string;
  description?: string;
  className?: string;
  id?: string;
}
export const ModifyDialog = ({
  children,
  className,
  description,
  title,
  trigger = <Button variant="outline">Open</Button>,
  id,
}: Props) => {
  const autoId = useId();
  const modalId = id ?? autoId;

  const isOpen = useModalStore((state) => state.openId === modalId);
  const open = useModalStore((state) => state.open);
  const close = useModalStore((state) => state.close);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => (next ? open(modalId) : close())}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className={cn("sm:max-w-sm", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
