import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const Page = async () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2>Your Products</h2>
        <Link href={`/admin/products/new`}>
          <Button>
            <PlusCircle />
            Create Product
          </Button>
        </Link>
      </div>

      <Separator className="mt-3" />
    </div>
  );
};

export default Page;
