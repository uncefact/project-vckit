import React, { FunctionComponent } from "react";

export type Media = {
  attributes: {
    title: string;
    date: string;
    link: string;
  };
};

export interface ResourceMediaProps {
  title: string;
  medias: Media[];
}

export const ResourceMedia: FunctionComponent<ResourceMediaProps> = ({ title, medias }) => {
  return (
    <div className="bg-white shadow-md mb-4 pt-2 px-3 pb-3">
      <div className="flex">
        <div className="flex-grow">
          <div className="text-gray-700 text-xl font-medium">{title}</div>
          {medias.map((media, index) => (
            <div className="pt-2 text-blue" key={index}>
              <a
                className="text-base font-medium flex items-end mb-2"
                href={media.attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link"
              >
                {media.attributes.title}
              </a>
              {media.attributes.date && (
                <div className="text-gray-500 text-base font-medium border-b border-solid border-gray-300 pb-4 mb-1">
                  {media.attributes.date}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
