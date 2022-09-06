import React, { FunctionComponent, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AccordionItem } from "../../components/UI/Accordion/AccordionItem";
import { importAll } from "../../common/utils/importAll";
import { getSortedByDateAsc } from "../../utils";

export type Guidelines = {
  body: string;
  attributes: {
    title: string;
  };
};

let guidelines = importAll(require.context("../../../cms/guidelines/", false, /\.md$/)) as Guidelines[];
guidelines = getSortedByDateAsc(guidelines);

export const GuidelinesContent: FunctionComponent = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full h-full lg:w-2/3 bg-white rounded-xl shadow-lg py-4">
        <div className="border-b border-cloud-300 border-solid mx-4" />
        {guidelines.map((guideline, index) => (
          <AccordionItem
            key={`guideline-${index}`}
            classNameContainer="mb-2"
            classNameCollapse="rounded p-4 "
            classNameContent="px-4 pb-4"
            headingTag="h3"
            heading={guideline.attributes.title}
            divider
            openIndex={openIndex}
            accordionIndex={index}
            setOpenIndex={setOpenIndex}
          >
            <ReactMarkdown components={{ p: ({ ...props }) => <p className={"mb-4"} {...props} /> }}>
              {guideline.body}
            </ReactMarkdown>
          </AccordionItem>
        ))}
      </div>
      <div className="my-12 lg:my-8 w-full lg:w-1/3">
        <img className="mx-auto" src="/static/images/guidelines/Guidelines.png" alt="Guidelines person" />
      </div>
    </div>
  );
};
