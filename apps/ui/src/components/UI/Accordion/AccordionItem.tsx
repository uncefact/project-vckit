import React, { FunctionComponent } from "react";
import { addClassNameIfExist } from "../../../utils";

type headingTag = "h3" | "h5";

interface AccordionItemProps {
  classNameContainer?: string;
  classNameCollapse?: string;
  classNameContent?: string;
  headingTag?: headingTag;
  heading: string;
  children: React.ReactNode;
  divider?: boolean;
  openIndex: number;
  setOpenIndex: (index: number) => void;
  accordionIndex: number;
}

export const AccordionItem: FunctionComponent<AccordionItemProps> = ({
  classNameContainer,
  classNameCollapse,
  classNameContent,
  headingTag = "h5",
  heading,
  divider = false,
  openIndex,
  setOpenIndex,
  accordionIndex,
  children,
}) => {
  const isOpen = openIndex === accordionIndex;
  return (
    <div className={`transition-color duration-200${addClassNameIfExist(` ${classNameContainer}`)}`}>
      <div
        className={`flex justify-between items-center transition-colors duration-200 cursor-pointer hover:text-cerulean${
          isOpen ? " text-cerulean" : ""
        }${addClassNameIfExist(` ${classNameCollapse}`)}`}
        onClick={() => setOpenIndex(isOpen ? -1 : accordionIndex)}
      >
        {headingTag === "h3" && <h3>{heading}</h3>}
        {headingTag === "h5" && <h5>{heading}</h5>}
        <svg
          data-testid="accordion-icon"
          className={`transition-transform duration-200 ${isOpen ? " rotate-180" : " rotate-0"} min-w-min min-h-min`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="stroke-current"
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="stroke-current"
            d="M8 10L12 14L16 10"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {isOpen && <div className={addClassNameIfExist(classNameContent)}>{children}</div>}
      {divider && <div className="border-b border-cloud-300 border-solid mx-4" />}
    </div>
  );
};
