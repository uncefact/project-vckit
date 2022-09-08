import { OpenAttestationDocument } from "@govtechsg/open-attestation";
import { ProgressBar, ToggleSwitch } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProviderContext } from "../../../../common/contexts/provider";
import {
  getDocumentStoreAddress,
  getIssuedDocumentStatus,
  getTempDns,
  getWrappedDocumentStatus,
  issuingDocument,
  wrappingDocument,
} from "../../../../reducers/demo-create";
import { LoadingModal } from "../../../UI/Overlay";
import { DemoCreateContext } from "../contexts/DemoCreateContext";
import { DemoFormContext } from "../contexts/DemoFormContext";
import { DemoCreateButtonRow } from "../DemoCreateButtonRow";
import { schema } from "../DemoCreateForm/schema";
import { FormItemSchema } from "../DemoCreateForm/types";
import { getFormValue, isImageData } from "../utils";
import { gaEvent } from "../../../../common/analytics";
import { makeRawDocument } from "./helpers";
import { DocumentPreview } from "./DemoPreview";

const DemoCreateReviewItem = ({
  title,
  properties,
  name,
}: {
  title: string;
  properties?: Record<string, any>;
  name: string;
}) => {
  const { formValues } = useContext(DemoFormContext);

  if (properties !== undefined) {
    return (
      <>
        {Object.entries(properties).map(([itemName, item]) => {
          const _name = `${name}.${itemName}`;

          return <DemoCreateReviewItem key={_name} name={_name} title={item.title} properties={item.properties} />;
        })}
      </>
    );
  }

  const formValue = getFormValue(formValues, name);

  let renderedFormValue = <p>{formValue}</p>;

  if (isImageData(formValue)) {
    renderedFormValue = <img src={formValue} className="h-24" />;
  }

  return (
    <div className="my-5">
      <h4 className="mb-2">{title}</h4>
      {renderedFormValue}
    </div>
  );
};

const DefaultReview = (data: Record<string, FormItemSchema>) => {
  return (
    <div>
      {Object.entries(data).map(([itemName, item]) => {
        const _item = item as FormItemSchema;

        return (
          <DemoCreateReviewItem key={itemName} name={itemName} title={_item.title} properties={_item.properties} />
        );
      })}
    </div>
  );
};

export const DemoCreateReview: FunctionComponent = () => {
  const { setActiveStep } = useContext(DemoCreateContext);
  const { formValues } = useContext(DemoFormContext);
  const { getTransactor } = useProviderContext();
  const wrapDocumentStatus = useSelector(getWrappedDocumentStatus);
  const issueDocumentStatus = useSelector(getIssuedDocumentStatus);
  const documentStoreAddress = useSelector(getDocumentStoreAddress);
  const tempDns = useSelector(getTempDns);
  const dispatch = useDispatch();
  const rawDocument: OpenAttestationDocument = useMemo(() => {
    return makeRawDocument(documentStoreAddress, formValues, tempDns);
  }, [documentStoreAddress, formValues, tempDns]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const handleBack = () => {
    setActiveStep("form");
  };

  const handleNext = () => {
    setLoading(true);
    dispatch(wrappingDocument(rawDocument));
  };

  useEffect(() => {
    const provider = getTransactor();
    if (wrapDocumentStatus !== null && wrapDocumentStatus === "success") {
      dispatch(issuingDocument(provider));
      gaEvent({
        action: "magic_demo_issue",
        category: "magic_demo",
      });
    }
  }, [wrapDocumentStatus, dispatch, getTransactor]);

  useEffect(() => {
    if (issueDocumentStatus !== null && issueDocumentStatus !== "pending") {
      setActiveStep("issue");
    }
  }, [issueDocumentStatus, setActiveStep]);

  const toggleHandler = useCallback(() => setIsPreviewMode(!isPreviewMode), [setIsPreviewMode, isPreviewMode]);

  return (
    <>
      {loading && (
        <LoadingModal
          title="Issuing Document"
          content={
            <p>
              Please do not navigate out of this demo
              <br />
              This process might take a while
            </p>
          }
        />
      )}
      <ProgressBar totalSteps={3} step={2} />
      <div className="my-4 flex justify-between">
        <h3 className="my-3">Please confirm details</h3>
        <div className="text-cloud-900 flex items-center">
          <div className="align-middle mr-4">Preview mode:</div>
          <ToggleSwitch isOn={isPreviewMode} handleToggle={toggleHandler} />
        </div>
      </div>
      {isPreviewMode ? <DocumentPreview document={rawDocument} /> : DefaultReview(schema)}
      <div className="border-t border-cloud-300">
        <DemoCreateButtonRow onBack={handleBack} onNext={handleNext} />
      </div>
    </>
  );
};
