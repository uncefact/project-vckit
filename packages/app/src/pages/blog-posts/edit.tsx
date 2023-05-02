import { IResourceComponentsProps } from "@refinedev/core";
import { MuiEditInferencer } from "@refinedev/inferencer/mui";

export const BlogPostEdit: React.FC<IResourceComponentsProps> = () => {
  return (
    <MuiEditInferencer
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
