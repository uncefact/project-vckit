import { Selector } from "testcafe";
import { location, validateTextContent, validateIframeTexts, validateIssuerTexts } from "./helper";

fixture("Load action from plain certificate").page`${location}`;

const DocumentStatus = Selector("#document-status");
const CertificateDropzone = Selector("[data-testid='certificate-dropzone']");

test("Load document from action should work when url is valid", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://raw.githubusercontent.com/Open-Attestation/gallery/master/static/documents/tradetrust/v2/ebl-ropsten.tt`,
      permittedActions: ["VIEW"],
      redirect: "https://dev.tradetrust.io",
    },
  };
  await t.navigateTo(`${location}/?q=${encodeURI(JSON.stringify(action))}`);

  await validateIssuerTexts(["DEMO-TRADETRUST.OPENATTESTATION.COM"]);
  validateIframeTexts(["BILL OF LADING FOR OCEAN TRANSPORT OR MULTIMODAL TRANSPORT"]);
});

test("Load document from action should fail when url is invalid", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://raw.githubusercontent.com/Open-Attestation/gallery/master/static/documents/123.tt`,
      redirect: "https://dev.tradetrust.io",
    },
  };

  await t.navigateTo(`${location}/?q=${encodeURI(JSON.stringify(action))}`);

  await DocumentStatus.with({ visibilityCheck: false })();
  await validateTextContent(t, CertificateDropzone, [
    "This document is not valid",
    "Unable to load certificate with the provided parameters",
    "Unable to load the certificate from https://raw.githubusercontent.com/Open-Attestation/gallery/master/static/documents/123.tt",
  ]);
});
