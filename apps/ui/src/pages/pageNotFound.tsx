import { ErrorPage } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";

export const PageNotFound: FunctionComponent = () => {
  return (
    <ErrorPage
      pageTitle="ERROR 404"
      header="Oops!"
      description="The page you are trying to reach doesn't seem to exist."
      image="/static/images/errorpage/404.png"
    >
      <h3 className="font-normal my-2 sm:my-4 text-lg sm:text-2xl">
        Go to
        <Link className="text-cerulean-200" to="/">
          {" "}
          Homepage
        </Link>
        ?
      </h3>
    </ErrorPage>
  );
};
