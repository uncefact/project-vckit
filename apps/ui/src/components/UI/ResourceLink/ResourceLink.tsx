import React, { FunctionComponent } from "react";
import { Resource } from "../../../types";

export interface ResourceLinkProps {
  title: string;
  resources: Resource[];
  icon?: string;
}

export const ResourceLink: FunctionComponent<ResourceLinkProps> = ({ title, resources, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-lg mb-4 py-2 px-4">
      <div className="flex">
        <div className="flex-grow">
          <h4 className="text-gray-700">{title}</h4>
          {resources.map((resource, index) => (
            <div className="text-blue" key={index}>
              <a
                className="text-base font-bold flex items-end mb-2"
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link"
              >
                {resource.title}
              </a>
              {resource.date && (
                <div className="text-gray-500 text-base font-medium border-b border-solid border-gray-300">
                  {resource.date}
                </div>
              )}
            </div>
          ))}
        </div>
        {icon && <img src={icon} alt="link icon" className="object-contain" data-testid="link-icon" />}
      </div>
    </div>
  );
};
