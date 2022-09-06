import { getPaginatedPagesTotal, getPaginatedPosts, Pagination } from "@govtechsg/tradetrust-ui-components";
import React from "react";
import { FunctionComponent, useState } from "react";
import { ResourceWebinar } from "../UI/ResourceWebinar";
import { WebinarSingle } from "./types";

export const PaginatedWebinar: FunctionComponent<{ webinars: WebinarSingle[] }> = ({ webinars }) => {
  const webinarPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedPosts = getPaginatedPosts({ posts: webinars, postsPerPage: webinarPerPage, currentPage });
  const totalNoOfPages = getPaginatedPagesTotal({ posts: webinars, postsPerPage: webinarPerPage });

  return (
    <>
      {paginatedPosts.map((webinar, index) => (
        <ResourceWebinar
          title={webinar.title}
          description={webinar.description}
          resource={webinar.resource}
          key={index}
        />
      ))}

      {totalNoOfPages > 1 && (
        <div className="w-min mx-auto my-14">
          <Pagination totalNoOfPages={totalNoOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      )}
    </>
  );
};
