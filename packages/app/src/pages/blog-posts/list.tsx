import { IResourceComponentsProps } from "@refinedev/core";
import { MuiListInferencer } from "@refinedev/inferencer/mui";

export const BlogPostList: React.FC<IResourceComponentsProps> = () => {
  return (
    <MuiListInferencer
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
