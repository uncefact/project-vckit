import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { roundInstructionsText } from ".";
import { updateCertificate } from "../../reducers/certificate";
import { CertificateDropZoneContainer } from "../CertificateDropZone/CertificateDropZoneContainer";
import { setActive, reset } from "../../reducers/sample";
import { loadDemoCertificate, getDemoCert } from "./helpers";
import { useProviderContext } from "../../common/contexts/provider";
import { ChainId } from "../../constants/chain-info";

interface DraggableDemoCertificateProps {
  chainId: ChainId;
}

const DraggableDemoCertificate: FunctionComponent<DraggableDemoCertificateProps> = (props) => (
  <div className="hidden md:block w-full md:w-1/2 px-4">
    <div className="relative w-full h-full">
      <img
        src="/static/images/dropzone/drop_arrow.svg"
        className="absolute -left-28 lg:-left-24 xl:-left-32 top-1/4"
        style={{ width: "135px" }}
      />
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-2/3 lg:w-1/2 xl:w-64 mr-auto px-4 inline-block box-content">
          <div className="aspect-w-1 aspect-h-1">
            <div className="rounded-full w-full h-full bg-cerulean flex ">
              <p className="text-base px-5 text-center text-white font-bold absolute top-1/2">
                {roundInstructionsText}
              </p>
            </div>
            <div
              className="absolute"
              draggable
              onDragStart={(e) => e.dataTransfer.setData(getDemoCert(props.chainId), "true")}
            >
              <a href={getDemoCert(props.chainId)} download="demo.tt" rel="noindex nofollow" className="cursor-default">
                <img
                  className="-top-2/5 absolute cursor-grab active:cursor-grabbing"
                  src="/static/images/dropzone/certificate.svg"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const DropZoneSectionContainer = (): React.ReactElement => {
  const dispatch = useDispatch();
  const loadCertificate = React.useCallback((payload: any) => dispatch(updateCertificate(payload)), [dispatch]);
  const { currentChainId } = useProviderContext();

  return currentChainId ? (
    <div className="flex flex-wrap md:flex-nowrap mt-4 -mx-4">
      <div className="w-full md:w-1/2">
        <div
          id="demoDrop"
          onDrop={(event) => {
            if (event.dataTransfer && event.dataTransfer.getData(getDemoCert(currentChainId))) {
              loadDemoCertificate(loadCertificate, currentChainId);
              dispatch(setActive());
            } else {
              dispatch(reset());
            }
          }}
        >
          <CertificateDropZoneContainer />
        </div>
      </div>
      <DraggableDemoCertificate chainId={currentChainId} />
    </div>
  ) : (
    <div>You are currently on an unsupported network.</div>
  );
};
