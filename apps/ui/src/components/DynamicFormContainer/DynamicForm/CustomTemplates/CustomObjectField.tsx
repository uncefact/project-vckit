import React, { FunctionComponent } from "react";
import { ObjectFieldTemplateProps } from "@rjsf/core";

type BreakPoints = {
  [key: string]: {
    [key: string]: string;
  };
};

type Layout = {
  [key: string]: number[];
};

type Properties = {
  content: React.ReactElement;
  name: string;
  disabled: boolean;
  readonly: boolean;
  hidden: boolean;
}[];

// Title UI should be reused in custom array item
export const CustomTitle: FunctionComponent<{ title: string }> = ({ title }) => {
  return (
    <>
      {title && <div className="border-t border-cloud-200 my-16" data-testid="custom-title-divider" />}
      {title && <h4 className="text-cloud-900 capitalize my-4">{title}</h4>}
    </>
  );
};

// Because we dynamically load column spans from config file at runtime,
// we need to specify these breakpoints so that Tailwind knows to compile them.
const breakpoints: BreakPoints = {
  sm: {
    "1": "col-span-1",
    "2": "col-span-2",
    "3": "col-span-3",
    "4": "col-span-4",
    "5": "col-span-5",
    "6": "col-span-6",
    "7": "col-span-7",
    "8": "col-span-8",
    "9": "col-span-9",
    "10": "col-span-10",
    "11": "col-span-11",
    "12": "col-span-12",
  },
  md: {
    "1": "md:col-span-1",
    "2": "md:col-span-2",
    "3": "md:col-span-3",
    "4": "md:col-span-4",
    "5": "md:col-span-5",
    "6": "md:col-span-6",
    "7": "md:col-span-7",
    "8": "md:col-span-8",
    "9": "md:col-span-9",
    "10": "md:col-span-10",
    "11": "md:col-span-11",
    "12": "md:col-span-12",
  },
  lg: {
    "1": "lg:col-span-1",
    "2": "lg:col-span-2",
    "3": "lg:col-span-3",
    "4": "lg:col-span-4",
    "5": "lg:col-span-5",
    "6": "lg:col-span-6",
    "7": "lg:col-span-7",
    "8": "lg:col-span-8",
    "9": "lg:col-span-9",
    "10": "lg:col-span-10",
    "11": "lg:col-span-11",
    "12": "lg:col-span-12",
  },
};

// Parses the ui:layout option and spans
// fields across specified number of columns
export const buildLayout = (props: Properties, layouts: Layout): React.ReactElement => {
  const content: any[] = [];

  // Iterate through each field in an object schema
  props.forEach((prop: any, index: number) => {
    const fieldClasses: string[] = [];

    const key = `${prop.content.key}-${index}`;

    // Iterate through each breakpoint size: sm, md, lg
    Object.keys(layouts).forEach((size: string) => {
      // Only set col-span classes if valid sizes provided
      if (["sm", "md", "lg"].includes(size)) {
        // Get the number of col-span for a specific screen size
        const value = layouts[size]?.[index];

        // If sm is set then we use the minimum breakpoint which is 0px
        const breakPoint = size === "sm" ? "" : size + ":";

        // If no column span is provided or size or col-span is invalid, default to 12 - full row.
        const colSpanClass = breakpoints[size][value] ?? `${breakPoint}col-span-12`;

        fieldClasses.push(colSpanClass);
      }
    });

    content.push(
      <div key={key} className={`${fieldClasses.join(" ")}`}>
        {prop.content}
      </div>
    );
  });
  return <div className="grid grid-cols-12 gap-2">{content}</div>;
};

const renderLayout = (props: Properties, layouts: Layout) => {
  if (!layouts) {
    return props.map((prop: any, index: number) => {
      const key = `${prop.content.key}-${index}`;
      return <div key={key}>{prop.content}</div>;
    });
  }

  return buildLayout(props, layouts);
};

export const CustomObjectFieldTemplate: FunctionComponent<ObjectFieldTemplateProps> = ({
  properties,
  title,
  description,
  uiSchema,
}) => {
  return (
    <>
      <CustomTitle title={title} />

      {renderLayout(properties, uiSchema?.uiLayout)}

      {description}
    </>
  );
};
