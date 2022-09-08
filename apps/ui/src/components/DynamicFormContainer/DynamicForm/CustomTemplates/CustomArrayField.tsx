import React, { FunctionComponent } from "react";
import { Trash2, ChevronUp, ChevronDown } from "react-feather";
import { IconAddFile } from "@govtechsg/tradetrust-ui-components";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import { Button, ButtonVariant } from "../../../UI/Button";
import { CustomTitle } from "./CustomObjectField";

export const CustomArrayFieldTemplate: FunctionComponent<ArrayFieldTemplateProps> = (props) => {
  const { items, title, canAdd, onAddClick } = props;

  return (
    <>
      <CustomTitle title={title} />
      {canAdd && (
        <Button variant={ButtonVariant.OUTLINE_PRIMARY} className="mb-4" onClick={onAddClick}>
          <IconAddFile className="mr-2" />
          Add Item
        </Button>
      )}
      {items.map((element, index) => {
        return (
          <div
            key={`custom-array-field-${index}`}
            data-testid={`custom-array-field-${index}`}
            role="listitem"
            className="p-4 shadow-lg border border-cloud-100 rounded-xl mb-8"
          >
            <div className="flex flex-wrap justify-end">
              {element.hasMoveUp && (
                <Button
                  data-testid={`move-up`}
                  className="bg-white text-cerulean hover:bg-cloud-100 w-auto ml-2"
                  onClick={element.onReorderClick(index, index - 1)}
                >
                  <ChevronUp />
                </Button>
              )}
              {element.hasMoveDown && (
                <Button
                  data-testid={`move-down`}
                  className="bg-white text-cerulean hover:bg-cloud-100 w-auto ml-2"
                  onClick={element.onReorderClick(index, index + 1)}
                >
                  <ChevronDown />
                </Button>
              )}
              {element.hasRemove && (
                <Button
                  data-testid={`remove`}
                  className="bg-rose-400 text-white hover:bg-red-400 w-auto ml-2"
                  onClick={element.onDropIndexClick(index)}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
            {element.children}
          </div>
        );
      })}
    </>
  );
};
