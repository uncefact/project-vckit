import { v2, utils } from "@govtechsg/open-attestation";
import { ButtonIcon } from "@govtechsg/tradetrust-ui-components";
import QRCode, { ImageSettings } from "qrcode.react";
import React, { FunctionComponent, useState } from "react";
import { Download, Printer } from "react-feather";
import { SvgIcon, SvgIconQRCode } from "../UI/SvgIcon";
import { WrappedOrSignedOpenAttestationDocument, getOpenAttestationData } from "../../utils/shared";
interface DocumentUtilityProps {
  document: WrappedOrSignedOpenAttestationDocument;
  onPrint: () => void;
}

interface DocumentWithAdditionalMetadata extends v2.OpenAttestationDocument {
  name?: string;
  links?: {
    self?: {
      href?: string;
    };
  };
}

export const DocumentUtility: FunctionComponent<DocumentUtilityProps> = ({ document, onPrint }) => {
  const [qrCodePopover, setQrCodePopover] = useState(false);
  const documentWithMetadata = getOpenAttestationData(document) as DocumentWithAdditionalMetadata; // Extending document data to account for undefined metadata in OA schema
  const { name, links } = utils.isRawV3Document(documentWithMetadata)
    ? documentWithMetadata.credentialSubject
    : documentWithMetadata;
  const fileName = name ?? "Untitled";
  const qrcodeUrl = links?.self?.href;

  const imageSettings: ImageSettings = {
    src: `/static/images/logo-qrcode.png`,
    height: 50,
    width: 55,
    excavate: true,
  };

  return (
    <div className="container no-print bg-white pb-8">
      <div className="flex flex-wrap">
        <div className="w-auto ml-auto">
          {qrcodeUrl && (
            <div
              className="relative"
              onClick={() => {
                setQrCodePopover(!qrCodePopover);
              }}
            >
              <ButtonIcon
                className="bg-white border-2 border-cloud-100 rounded-xl hover:bg-gray-100"
                aria-label="document-utility-qr-button"
              >
                <SvgIcon className="text-cerulean" strokeWidth="0.5" fill="currentColor">
                  <SvgIconQRCode />
                </SvgIcon>
              </ButtonIcon>
              <div
                data-testid="qr-code-svg"
                className={`absolute border p-2 mt-2 top-100 right-0 shadow-md rounded bg-white ${
                  qrCodePopover ? "block" : "hidden"
                }`}
              >
                <QRCode
                  value={qrcodeUrl}
                  level="Q"
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  imageSettings={imageSettings}
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-auto ml-3">
          <ButtonIcon
            className="bg-white text-cerulean border-2 border-cloud-100 rounded-xl hover:bg-gray-100"
            aria-label="document-utility-print-button"
            onClick={() => onPrint()}
          >
            <Printer />
          </ButtonIcon>
        </div>
        <div className="w-auto ml-3">
          <a
            download={`${fileName}.tt`}
            target="_black"
            href={`data:text/json;,${encodeURIComponent(JSON.stringify(document, null, 2))}`}
            role="button"
            aria-label="document-utility-download"
          >
            <ButtonIcon className="bg-white text-cerulean border-2 border-cloud-100 rounded-xl hover:bg-gray-100">
              <Download />
            </ButtonIcon>
          </a>
        </div>
      </div>
    </div>
  );
};
