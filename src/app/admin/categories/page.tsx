import { ModifyDialog } from "@/components/modify/modify-dialog";
import { CreateCategoryForm } from "./_components/create-category-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CategoryGrid } from "./_components/category-grid";
import { Separator } from "@/components/ui/separator";

const Page = async () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>Your Categories</h2>
        <ModifyDialog
          trigger={
            <Button variant={"outline"}>
              <PlusCircle /> Create Category
            </Button>
          }
          id="create_category"
        >
          <CreateCategoryForm />
        </ModifyDialog>
      </div>
      <Separator className="mt-3" />
      <CategoryGrid />
    </div>
  );
};

export default Page;
