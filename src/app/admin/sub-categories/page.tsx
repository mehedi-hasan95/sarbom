import { ModifyDialog } from "@/components/modify/modify-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SubCategoryGrid } from "./_components/sub-category-grid";
import { CreateSubCategoryForm } from "./_components/create-sub-category-form";

const Page = async () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>Your Categories</h2>
        <ModifyDialog
          trigger={
            <Button variant={"outline"}>
              <PlusCircle /> Create Sub Category
            </Button>
          }
          id="create_sub_category"
        >
          <CreateSubCategoryForm />
        </ModifyDialog>
      </div>
      <Separator className="mt-3" />
      <SubCategoryGrid />
    </div>
  );
};

export default Page;
