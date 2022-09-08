import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { Paperclip, Trash2 } from "react-feather";
import { FileUploadType } from "../../../../../types";
import csv from "./csv.svg";
import doc from "./doc.svg";
import jpg from "./jpg.svg";
import pdf from "./pdf.svg";
import png from "./png.svg";
import txt from "./txt.svg";

interface FilesInfoType {
  filesInfo: FileUploadType[];
  removeFile: (index: number) => void;
}

interface ExtensionIconProps {
  src: string;
}

const ExtensionIcon: FunctionComponent<ExtensionIconProps> = ({ ...props }) => {
  return <img {...props} className="flex items-center justify-center mr-2" alt="" />;
};

export const getExtension = (mimeType: string | undefined): React.ReactNode => {
  switch (true) {
    case mimeType === "text/csv" ||
      mimeType === "application/vnd.ms-excel" ||
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <ExtensionIcon src={csv} data-testid="attachment-icon-csv" />;
    case mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword":
      return <ExtensionIcon src={doc} data-testid="attachment-icon-doc" />;
    case mimeType === "image/jpeg":
      return <ExtensionIcon src={jpg} data-testid="attachment-icon-jpg" />;
    case mimeType === "image/png":
      return <ExtensionIcon src={png} data-testid="attachment-icon-png" />;
    case mimeType === "application/pdf":
      return <ExtensionIcon src={pdf} data-testid="attachment-icon-pdf" />;
    case mimeType === "text/plain":
      return <ExtensionIcon src={txt} data-testid="attachment-icon-txt" />;
    default:
      return (
        <div
          className="rounded-full bg-gray-300 h-12 w-12 flex items-center justify-center mr-2"
          data-testid={`attachment-icon-paperclip`}
        >
          <Paperclip />
        </div>
      );
  }
};

export const FilesInfo: FunctionComponent<FilesInfoType> = ({ filesInfo, removeFile }) => {
  if (!filesInfo || filesInfo.length === 0) {
    return null;
  }
  return (
    <ul className="file-info mt-4">
      {filesInfo.map(({ filename, data, type }: FileUploadType, key: number) => {
        const decodedData = atob(data);
        const size = prettyBytes(decodedData.length);
        return (
          <li
            key={key}
            data-testid={`upload-file-${key}`}
            className="border border-gray-300 border-solid rounded my-1 h-16 flex items-center px-4"
          >
            {getExtension(type)}
            <p className="font-bold text-cloud-900 flex-grow break-all">
              {filename}
              <span className="text-gray text-xs font-regular"> ({size})</span>
            </p>

            <div
              className="cursor-pointer"
              data-testid={`remove-uploaded-file-${key}`}
              onClick={() => {
                removeFile(key);
              }}
            >
              <Trash2 className="text-cerulean-200" />
            </div>
          </li>
        );
      })}
    </ul>
  );
};
