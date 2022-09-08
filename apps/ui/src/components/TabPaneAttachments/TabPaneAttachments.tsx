import React, { FunctionComponent } from "react";
import { AttachmentLink } from "../UI/AttachmentLink";
import { OpenAttestationAttachment } from "../../utils/shared";

interface TabPaneAttachmentsProps {
  attachments: OpenAttestationAttachment[];
}

export const TabPaneAttachments: FunctionComponent<TabPaneAttachmentsProps> = ({ attachments }) => {
  return (
    <div className="container">
      <div className="flex flex-col flex-wrap -mx-4 md:flex-row">
        {attachments.map(({ filename, data, type }, index) => (
          <div className="flex lg:w-1/3 xl:w-1/4 mb-3 px-4" key={index} data-testid={`attachment-tile-${index}`}>
            <AttachmentLink filename={filename} data={data} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
};
