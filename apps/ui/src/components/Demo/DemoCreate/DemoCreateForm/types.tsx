export interface FormItemSchema {
  type: "string" | "object";
  uiType?: "accordion" | "withLabel" | "withoutLabel" | "upload" | "textarea";
  title: string;
  properties?: { [s: string]: FormItemSchema } | ArrayLike<FormItemSchema>;
  options?: {
    readonly: boolean;
  };
}
