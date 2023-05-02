import { IResourceComponentsProps } from "@refinedev/core";
import { MuiShowInferencer } from "@refinedev/inferencer/mui";

export const BlogPostShow: React.FC<IResourceComponentsProps> = () => {
  return (
    <MuiShowInferencer
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
