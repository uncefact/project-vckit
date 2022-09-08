import React, { FunctionComponent } from "react";
import { ChevronLeft } from "react-feather";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "react-router-dom";
import { allNews } from "./../components/News";
import { NewsSingle, NewsTag } from "./../components/News/types";
import { NewsDetailContent } from "./../components/News/NewsDetailContent/NewsDetailContent";
import { ResourceDownload } from "./../components/UI/ResourceDownload";

export const NewsPageDetail: FunctionComponent = () => {
  const location = useLocation();
  const params: { slug: string } = useParams();
  const detail: NewsSingle = allNews.find((news) => news.slug === params.slug);
  const newsletters: NewsSingle[] = allNews.filter((news) => news.type === NewsTag.NEWSLETTER);

  return (
    <>
      <Helmet>
        <meta
          property="description"
          content="Check out our events and browse through our latest news and official statements."
        />
        <meta
          property="og:description"
          content="Check out our events and browse through our latest news and official statements."
        />
        <meta property="og:title" content="TradeTrust - An easy way to check and verify your documents" />
        <meta property="og:url" content={`${window.location.origin}${location.pathname}`} />
        <title>TradeTrust - {detail.attributes.title}</title>
      </Helmet>
      <div className="container py-12">
        <div className="flex">
          <div className="w-auto">
            <Link to="/news" className="text-gray-800 flex flex-nowrap items-center">
              <ChevronLeft />
              <span>Back</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap py-4 mb-8 -mx-4">
          <div className="w-full lg:w-2/3 lg:px-4">
            <NewsDetailContent detail={detail} />
          </div>
          <div className="w-full lg:w-1/3 lg:px-4 hidden lg:block">
            <ResourceDownload title="Newsletter" resources={newsletters} />
          </div>
        </div>
      </div>
    </>
  );
};
