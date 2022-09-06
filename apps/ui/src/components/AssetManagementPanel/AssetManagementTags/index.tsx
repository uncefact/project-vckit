import React, { FunctionComponent } from "react";
import { Tag } from "../../UI/Tag";

export const AssetManagementTags: FunctionComponent = () => {
  const tagCSS = "text-tangerine bg-white border border-cloud-100 rounded-md font-bold mr-2 mb-2";
  return (
    <div className="container">
      <div className="flex w-full py-2">
        <Tag className={tagCSS}>Transferable</Tag>
        <Tag className={tagCSS}>Negotiable</Tag>
      </div>
    </div>
  );
};
