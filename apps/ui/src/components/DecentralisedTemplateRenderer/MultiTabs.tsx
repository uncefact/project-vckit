import React, { FunctionComponent } from "react";
import { TemplateProps } from "./../../types";
import { OpenAttestationAttachment } from "../../utils/shared";

interface MultiTabsProps {
  className?: string;
  hasAttachments: boolean;
  attachments?: OpenAttestationAttachment[];
  templates: TemplateProps[];
  setSelectedTemplate: (id: string) => void;
  selectedTemplate: string;
}

export const MultiTabs: FunctionComponent<MultiTabsProps> = ({
  hasAttachments,
  attachments,
  templates,
  setSelectedTemplate,
  selectedTemplate,
}) => {
  return (
    <div className="container">
      <div className="flex overflow-x-auto items-end">
        {templates.map(({ id, label }) => (
          <div
            className={`px-3 py-2 mr-2 multi-tab border-t border-r border-l rounded-t-xl border-cloud-100 ${
              id === selectedTemplate ? "bg-white text-cloud-900" : "bg-cloud-100 text-cloud-300"
            }`}
            key={id}
            data-testid={id}
          >
            <div
              className="truncate"
              onClick={() => {
                setSelectedTemplate(id);
              }}
            >
              <span>{label}</span>
            </div>
          </div>
        ))}
        {hasAttachments && (
          <div
            className={`px-3 py-2 mr-2 multi-tab border-t border-r border-l rounded-t-xl border-cloud-100 ${
              selectedTemplate === "attachmentTab" ? "bg-white text-cloud-900" : "bg-cloud-100 text-cloud-300"
            }`}
          >
            <div
              className="flex flex-nowrap items-center"
              data-testid="tab-attachment"
              onClick={() => {
                setSelectedTemplate("attachmentTab"); // To unset the last active tab
              }}
            >
              <div className="mr-2 w-auto">Attachments</div>
              <div className="rounded-full w-6 h-6 bg-gray-300 text-center" data-testid="attachment-number">
                {attachments && attachments.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
