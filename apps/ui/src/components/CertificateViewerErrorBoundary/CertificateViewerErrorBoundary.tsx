import React, { PropsWithChildren } from "react";
import { FunctionComponent } from "react";
import { ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryRenderer } from "../ErrorBoundary";
import { getCurrentProvider, useProviderContext } from "../../common/contexts/provider";
import { ErrorPage, ErrorPageProps } from "@govtechsg/tradetrust-ui-components";
import { Link } from "react-router-dom";
import { UnsupportedNetworkError } from "../../common/errors";

type CertificateViewerErrorBoundaryProps = Omit<ErrorBoundaryProps, "renderer">;

export const CertificateViewerErrorBoundary: FunctionComponent<CertificateViewerErrorBoundaryProps> = (props) => {
  const { children, onRecover, onError } = props;

  const { reloadNetwork } = useProviderContext();

  const recoverHandler = async () => {
    if (onRecover) await onRecover();
    await reloadNetwork();
  };

  return (
    <ErrorBoundary renderer={ErrorRenderer} onError={onError} onRecover={recoverHandler}>
      {children}
    </ErrorBoundary>
  );
};

enum CertificateViewerErrorType {
  Generic,
  UnsupportedNetwork,
  ContractRevert,
  RPCCallException,
}

/**
 * Attempts to guess the type of error from the Error object.
 * @param error Error received from boundary
 */
const getErrorType = (error: Error | undefined): CertificateViewerErrorType => {
  const provider = getCurrentProvider();
  if (!provider || error instanceof UnsupportedNetworkError) return CertificateViewerErrorType.UnsupportedNetwork;

  const errMsg = error?.message;
  if (!errMsg) return CertificateViewerErrorType.Generic;

  if (errMsg.indexOf("call revert exception") > -1) {
    return CertificateViewerErrorType.ContractRevert;
  } else if (errMsg.indexOf("SERVER_ERROR") > -1) {
    // RPC call may have returned an error. For eg, forbidden, bad request, etc.
    return CertificateViewerErrorType.RPCCallException;
  }

  return CertificateViewerErrorType.Generic;
};

const ErrorRenderer: ErrorBoundaryRenderer = (props) => {
  const { error, recover } = props;

  const errorType = getErrorType(error);

  const retryErrorLink = (
    <h3 className="font-normal my-2 sm:my-4 text-lg sm:text-xl">
      <Link to="#" onClick={recover}>
        {`OK, let's try again!`}
      </Link>
    </h3>
  );

  // Default props for error page
  let errorPageProps: PropsWithChildren<ErrorPageProps> = {
    pageTitle: "ERROR",
    header: "Something Went Wrong",
    description: error?.message ? error.message : "TradeTrust has encountered an issue.",
    image: "/static/images/errorpage/error-boundary.png",
    children: (
      <h3 className="font-normal my-2 sm:my-4 text-lg sm:text-2xl">
        Go to
        <Link className="text-cerulean-200" to="/">
          {" "}
          Homepage
        </Link>
        ?
      </h3>
    ),
  };

  switch (errorType) {
    case CertificateViewerErrorType.UnsupportedNetwork:
      errorPageProps = {
        ...errorPageProps,
        pageTitle: "Whoops!",
        header: "Unsupported Network",
        description: "Try changing to a correct network for the document.",
        children: retryErrorLink,
      };
      break;
    case CertificateViewerErrorType.RPCCallException:
    case CertificateViewerErrorType.ContractRevert:
      errorPageProps = {
        ...errorPageProps,
        pageTitle: "Whoops!",
        header: "Ouch! That didn't work!",
        description:
          "There might be an issue with the network or contract. Make sure you on the correct network for the document.",
        children: retryErrorLink,
      };
      break;
    case CertificateViewerErrorType.Generic:
    default:
    // Will use the default errorPageProps
  }

  const { children: errorPageChildren, ...errorPageRestProps } = errorPageProps;
  return <ErrorPage {...errorPageRestProps}>{errorPageChildren}</ErrorPage>;
};
