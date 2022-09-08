import { Dropdown, DropdownItem } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState } from "react";
import { Download } from "react-feather";
import { convertSecondsToMinAndSec } from "../../../utils";

export type Webinar = {
  youtubeEmbedCode: string;
  tag: string;
  downloads: {
    fileName: string;
    path: string;
  }[];
  videoChapters: {
    title: string;
    timeStamp: number;
  }[];
};

interface ResourceWebinarProps {
  title: string;
  description: string;
  resource: Webinar;
}

export const ResourceWebinar: FunctionComponent<ResourceWebinarProps> = ({ title, description, resource }) => {
  const { youtubeEmbedCode, tag, downloads, videoChapters } = resource;
  const [currentTimeStamp, setCurrentTimeStamp] = useState(0);

  return (
    <div className="bg-white shadow-lg rounded-lg mb-8">
      <div className="flex flex-wrap">
        <div className="w-full xl:w-1/2">
          <div className="aspect-16-9 h-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-t-lg"
              src={`https://www.youtube.com/embed/${youtubeEmbedCode}${
                currentTimeStamp ? `?autoplay=1&rel=0&start=${currentTimeStamp}` : "?rel=0"
              }`}
              title={title}
              frameBorder="0"
              allow="autoplay; fullscreen"
              data-testid="youtubeEmbed-iframe"
            />
          </div>
        </div>
        <div className="w-full xl:w-1/2">
          <div className="text-cloud-900 px-5 pt-3 pb-5">
            <h4 className="title mb-2">
              <a
                href={`https://www.youtube.com/watch?v=${youtubeEmbedCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cloud-900"
                data-testid="youtubeEmbed-title-link"
              >
                {title}
              </a>
            </h4>
            <div className="inline-block border border-solid border-gray w-auto text-sm rounded font-medium p-1 mb-4">
              {tag}
            </div>
            <p className="mb-4">{description}</p>
            <Dropdown
              data-testid="quick-video-links-dropdown"
              dropdownButtonText="Quick Video Links"
              classNameShared="w-full lg:w-auto"
              className="rounded border border-gray-300 p-2 mb-2"
            >
              {videoChapters.map((videoChapter, i) => {
                return (
                  <DropdownItem
                    key={i}
                    className={"break-words text-clip whitespace-normal text-cloud-900 "}
                    data-testid="video-chapters-dropdown"
                    onClick={() => setCurrentTimeStamp(videoChapter.timeStamp)}
                  >
                    {videoChapter.title} [{convertSecondsToMinAndSec(videoChapter.timeStamp)}]
                  </DropdownItem>
                );
              })}
            </Dropdown>
            <div className="py-2 text-blue">
              {downloads?.map((download, index) => (
                <a
                  className="font-semibold flex items-start mt-1"
                  href={download.path}
                  download={download.fileName}
                  key={index}
                  data-testid="download-link"
                >
                  <Download />
                  <span className="ml-2">{download.fileName}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
