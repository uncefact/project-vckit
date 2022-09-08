import React, { FunctionComponent } from "react";
import { Download } from "react-feather";
import { NewsSingle } from "./../../News/types";
export interface ResourceDownloadProps {
  title: string;
  resources: NewsSingle[];
}

export const ResourceDownload: FunctionComponent<ResourceDownloadProps> = ({ title, resources }) => {
  return (
    <>
      <div className="text-gray-700 text-xl font-medium mb-2">{title}</div>
      <div className="bg-white rounded-lg shadow-lg py-1 px-4">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.attributes.file}
            download={resource.attributes.title}
            className="inline-block text-base font-medium text-cerulean-200 flex items-center my-3"
          >
            <Download className="mr-2" width="20" height="20" />
            {resource.attributes.title}
          </a>
        ))}
      </div>
    </>
  );
};
