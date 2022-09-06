import React, { FunctionComponent } from "react";
import { Download } from "react-feather";
import { format } from "date-fns";
import { NewsSingle } from "../types";
import { TagBorderedSm } from "../../UI/Tag";

const NewsSingleTitle: FunctionComponent<{ title: string }> = ({ title }) => {
  return <h5 className="mt-8 mb-2">{title}</h5>;
};

export const NewsCard: FunctionComponent<{ news: NewsSingle }> = ({ news }) => {
  const isThumbnail = !!news.attributes.thumbnail;
  const image = isThumbnail ? news.attributes.thumbnail : "/static/images/news/news-generic.png";
  const isDownloadFile = !!news.attributes.file;

  return (
    <>
      <div
        data-testid="news-item-thumbnail"
        style={{ backgroundImage: `url(${image})` }}
        className="bg-center bg-no-repeat bg-cover p-8 absolute top-0 left-0 w-full h-full"
      />
      <div
        className={`transition-color duration-200 ease-out bg-black backface-invisible absolute top-0 left-0 w-full h-full group-hover:opacity-80 ${
          isThumbnail ? "opacity-60" : "opacity-70"
        }`}
      />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex flex-wrap">
            <TagBorderedSm className="flex items-center border border-white mr-2 h-8">{news.type}</TagBorderedSm>
            {isDownloadFile && (
              <div className="flex items-center w-8 h-8 border border-white rounded-lg text-white">
                <Download width="20" height="20" className="m-auto" />
              </div>
            )}
          </div>
        </div>
        <NewsSingleTitle title={news.attributes.title} />
        <p>{format(new Date(news.attributes.date), "d MMM yyyy")}</p>
      </div>
    </>
  );
};
