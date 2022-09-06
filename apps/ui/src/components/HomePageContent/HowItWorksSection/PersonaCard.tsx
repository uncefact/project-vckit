import React, { useContext } from "react";
import { OverlayContext } from "@govtechsg/tradetrust-ui-components";
import { Persona, PersonaProps } from "../../../types";
import { PersonaModal } from "./PersonaModal";

export const PersonaCard: React.FunctionComponent<PersonaProps> = ({ personaIndex, details }) => {
  const { showOverlay } = useContext(OverlayContext);
  const onOverlayHandler = (modalContent: Persona) => {
    showOverlay(<PersonaModal personaIndex={personaIndex} details={modalContent} />);
  };

  return (
    <div className="flex flex-col m-4 lg:w-6/12 lg:m-0 lg:mb-8" data-testid="persona-card">
      <div className="min-h-220 lg:flex lg:items-center">
        <img className="mx-auto min-w-220" src={details.image} />
        <div className="flex flex-col items-center lg:items-start lg:justify-start">
          <h5 className="mb-2">{details.jobTitle}</h5>
          <p className="text-base text-center mx-5 lg:mx-0 lg:text-left lg:min-h-90">{details.description}</p>
          <a
            className="block pt-3 text-cerulean-200 text-base font-bold cursor-pointer"
            onClick={() => onOverlayHandler(details)}
            data-testid={`persona-details-${personaIndex}`}
          >
            Click to find out more
          </a>
        </div>
      </div>
    </div>
  );
};
