"use client";
import { CreateProductForm } from "./_components/create-product-form";

const Page = () => {
  return (
    <CreateProductForm
      categories={[{ slug: "clothing", name: "Clothing" }]}
      subCategories={[
        { slug: "t-shirts", name: "T-shirts", categorySlug: "clothing" },
      ]}
      uploadImage={async (file) => URL.createObjectURL(file)}
      onSubmit={(values) => console.log(values)}
    />
  );
};

export default Page;
