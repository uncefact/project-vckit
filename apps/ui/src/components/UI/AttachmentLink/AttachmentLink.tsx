import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { Paperclip } from "react-feather";
import { getLogger } from "../../../utils/logger";
import { NestedDocumentState } from "./../../../constants/NestedDocumentState";
import { getOpenAttestationData } from "../../../utils/shared";

const { error } = getLogger("component:attachmentlink");

export interface AttachmentLinkProps {
  filename: string;
  data: string;
  type?: string;
  path?: string;
}
interface ExtensionIconProps {
  src: string;
}

const ExtensionIcon: FunctionComponent<ExtensionIconProps> = ({ ...props }) => {
  return <img {...props} className="max-w-full" alt="Extension Icon" />;
};

export const getExtension = (mimeType: string | undefined): React.ReactNode => {
  switch (true) {
    case mimeType === "text/csv" ||
      mimeType === "application/vnd.ms-excel" ||
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <ExtensionIcon src="/static/images/fileicons/csv.svg" data-testid="attachment-icon-csv" />;
    case mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword":
      return <ExtensionIcon src="/static/images/fileicons/doc.svg" data-testid="attachment-icon-doc" />;
    case mimeType === "image/jpeg":
      return <ExtensionIcon src="/static/images/fileicons/jpg.svg" data-testid="attachment-icon-jpg" />;
    case mimeType === "image/png":
      return <ExtensionIcon src="/static/images/fileicons/png.svg" data-testid="attachment-icon-png" />;
    case mimeType === "application/pdf":
      return <ExtensionIcon src="/static/images/fileicons/pdf.svg" data-testid="attachment-icon-pdf" />;
    case mimeType === "text/plain":
      return <ExtensionIcon src="/static/images/fileicons/txt.svg" data-testid="attachment-icon-txt" />;
    default:
      return (
        <div
          className="w-12 h-12 bg-gray-200 text-gray-700 p-2 rounded-full flex items-center"
          data-testid={`attachment-icon-paperclip`}
        >
          <Paperclip className="m-auto" />
        </div>
      );
  }
};

const openTab = (data: string) => {
  const url = `${window.location.protocol}//${window.location.host}`;
  const childWin = window.open(url, "_blank") as Window; // to omit noopener noreferrer for this case, otherwise unable to postMessage

  childWin.onload = (): void => {
    childWin.postMessage(
      {
        type: NestedDocumentState.LOAD,
        payload: data,
      },
      url
    );
  };
};

const isOpenAttestationFile = (decodedData: string) => {
  try {
    const decodedJson = JSON.parse(decodedData);
    const unwrappedDocument = getOpenAttestationData(decodedJson);
    if (!unwrappedDocument) throw new Error("File is not OA document"); //non-OA document returns undefined
    return true;
  } catch (e) {
    error("decode data not json: " + e);
    return false;
  }
};

export const AttachmentLink: FunctionComponent<AttachmentLinkProps> = ({ filename, data, type, path }) => {
  let filesize = "0";
  let canOpenFile = false;
  const hasBase64 = !!(data && type);
  const downloadHref = hasBase64 ? `data:${type};base64,${data}` : path || "#";
  const decodedData = atob(data);
  canOpenFile = isOpenAttestationFile(decodedData);
  filesize = prettyBytes(decodedData.length);

  return (
    <div className="transition duration-300 ease-out flex-1 rounded-xl border border-cloud-100 shadow-lg py-2 px-4 hover:no-underline">
      <div className="flex flex-row">
        <div className="w-auto mr-4">{getExtension(type)}</div>
        <div className="w-5/6">
          <p className="mb-2 break-all">
            <span className="transition duration-300 ease-out leading-5 text-cloud-500 break-words font-bold mr-1">
              {filename}
            </span>
            {hasBase64 && <span className="font-normal text-cloud-500 text-sm">({filesize})</span>}
          </p>
          <div className="flex">
            <div className="w-auto mr-2">
              <a
                href={downloadHref}
                download={`${filename}`}
                data-testid="attachment-download-link"
                className="text-cerulean-200 font-bold hover:underline"
              >
                Download
              </a>
            </div>
            {canOpenFile && data && (
              <div className="w-auto">
                <button
                  onClick={() => {
                    openTab(data);
                  }}
                  className="text-cerulean-200 hover:underline"
                  data-testid="attachment-open-link"
                >
                  Open
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
