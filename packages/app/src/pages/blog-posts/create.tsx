import { IResourceComponentsProps } from "@refinedev/core";
import { MuiCreateInferencer } from "@refinedev/inferencer/mui";

export const BlogPostCreate: React.FC<IResourceComponentsProps> = () => {
  return (
    <MuiCreateInferencer
      fieldTransformer={(field: any) => {
        if (["$permissions", "$updatedAt"].includes(field.key)) {
          return false;
        }

        if (field.key === "$createdAt") {
          field.key = "created_at";
          field.title = "Created At";
        }

        return field;
      }}
    />
  );
};
