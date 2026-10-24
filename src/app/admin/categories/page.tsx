import { ModifyDialog } from "@/components/modify/modify-dialog";
import { CreateCategoryForm } from "./_components/create-category-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CategoryGrid } from "./_components/category-grid";

const Page = async () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Your Categories</h2>
        <ModifyDialog
          trigger={
            <Button variant={"outline"}>
              <PlusCircle /> Create Category
            </Button>
          }
        >
          <CreateCategoryForm />
        </ModifyDialog>
      </div>
      <CategoryGrid />
    </div>
  );
};

export default Page;
