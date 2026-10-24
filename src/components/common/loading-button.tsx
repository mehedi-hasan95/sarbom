import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "cn";

interface Props {
  title?: string;
  className?: string;
}
export const LoadingButton = ({ className, title = "Loading..." }: Props) => {
  return (
    <Button disabled className={cn(className)}>
      <Spinner data-icon="inline-start" />
      {title}
    </Button>
  );
};
