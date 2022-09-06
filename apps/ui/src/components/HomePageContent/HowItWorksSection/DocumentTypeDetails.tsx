import React from "react";
import { DocumentTypeContentProps } from "../../../types";
import { PersonaCard } from "./PersonaCard";

export const DocumentTypeDetails: React.FunctionComponent<DocumentTypeContentProps> = ({ documentTypeContent }) => {
  return (
    <div className="flex flex-wrap my-8 text-base">
      <p className="w-full text-center">{documentTypeContent.description}</p>
      <p className="w-full text-center">{documentTypeContent.examples}</p>
      <h5 className="w-full text-center mt-12 mb-8 text-xl">{documentTypeContent.message}</h5>
      {documentTypeContent.users.map((details: any, index: any) => (
        <PersonaCard key={index} details={details} personaIndex={index} />
      ))}
    </div>
  );
};
