import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { NewsSingle } from "./../types";
import { NewsCard } from "../NewsCard";

const getLink = (news: NewsSingle) => {
  switch (true) {
    case !!news.attributes.file:
      return news.attributes.file;
    default:
      return `/news/${news.slug}`;
  }
};

export const NewsLink: FunctionComponent<{ news: NewsSingle }> = ({ news }) => {
  const isNavLink = !!news.body;
  const link = getLink(news);
  const sharedStylesLink = `group inline-block w-full p-6 rounded-lg overflow-hidden relative h-full text-white hover:text-white`;

  return (
    <>
      {isNavLink && link ? (
        <NavLink data-testid="news-item-link" to={link} className={`${sharedStylesLink}`}>
          <NewsCard news={news} />
        </NavLink>
      ) : (
        <a
          data-testid="news-item-link"
          className={`${sharedStylesLink}`}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <NewsCard news={news} />
        </a>
      )}
    </>
  );
};
