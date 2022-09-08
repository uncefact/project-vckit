import React, { FunctionComponent, useState, useCallback } from "react";
import { compareAsc, compareDesc } from "date-fns";
import { Pagination, getPaginatedPosts, getPaginatedPagesTotal } from "@govtechsg/tradetrust-ui-components";
import { NewsTag, NewsSort, NewsSingle } from "./../types";
import { NewsLink } from "./../NewsLink";
import { NewsFilter } from "./../NewsFilter";

export const newsPerPage = 12;

const PaginatedNews: FunctionComponent<{ filteredNews: NewsSingle[] }> = ({ filteredNews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedPosts = getPaginatedPosts({ posts: filteredNews, postsPerPage: newsPerPage, currentPage });
  const totalNoOfPages = getPaginatedPagesTotal({ posts: filteredNews, postsPerPage: newsPerPage });

  return (
    <>
      <div className="flex flex-wrap py-4 -mx-4">
        {paginatedPosts.map((news, index) => {
          return (
            <div key={index} className="w-full md:w-1/2 lg:w-1/3 mb-8 px-4">
              <NewsLink news={news} />
            </div>
          );
        })}
      </div>
      <Pagination totalNoOfPages={totalNoOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  );
};

export const NewsContent: FunctionComponent<{ allNews: NewsSingle[] }> = ({ allNews }) => {
  const [searchStr, setSearchStr] = useState<string>("");
  const [dropdownFilter, setDropdownFilter] = useState<NewsTag>();
  const [dropdownSort, setDropdownSort] = useState<NewsSort>();

  const filterBySearchStr = useCallback(
    (news: NewsSingle) => news.attributes.title.toLowerCase().includes(searchStr.toLowerCase()),
    [searchStr]
  );

  const filterByTag = useCallback(
    (news: NewsSingle) => {
      if (!dropdownFilter) {
        return news;
      } else {
        return news.type === dropdownFilter;
      }
    },
    [dropdownFilter]
  );

  const sortByDate = useCallback(
    (a, b) => {
      switch (dropdownSort) {
        case NewsSort.ASC:
          return compareAsc(new Date(a.attributes.date), new Date(b.attributes.date));
        case NewsSort.DESC:
          return compareDesc(new Date(a.attributes.date), new Date(b.attributes.date));
        default:
          return 0;
      }
    },
    [dropdownSort]
  );

  const filteredNews = allNews.filter(filterBySearchStr).filter(filterByTag).sort(sortByDate);

  return (
    <>
      <NewsFilter
        searchStr={searchStr}
        setSearchStr={setSearchStr}
        dropdownFilter={dropdownFilter}
        setDropdownFilter={setDropdownFilter}
        dropdownSort={dropdownSort}
        setDropdownSort={setDropdownSort}
      />
      <PaginatedNews filteredNews={filteredNews} />
    </>
  );
};
