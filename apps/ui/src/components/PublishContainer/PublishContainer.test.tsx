import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useConfigContext } from "../../common/contexts/config";
import { useFormsContext } from "../../common/contexts/forms";
import { useQueue } from "../../common/hooks/useQueue";
import { PublishContainer } from "./PublishContainer";
import { QueueState } from "./../../constants/QueueState";

import sampleConfig from "../../test/fixture/config/v2/sample-config-ropsten.json";

jest.mock("../../common/contexts/forms");
jest.mock("../../common/contexts/config");
jest.mock("../../common/hooks/useQueue");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockUseConfigContext = useConfigContext as jest.Mock;
const mockUseQueue = useQueue as jest.Mock;
const mockSetActiveFormIndex = jest.fn();
const mockSetForms = jest.fn();
const mockProcessDocuments = jest.fn();

const whenNoConfig = (): void => {
  mockUseConfigContext.mockReturnValue({ config: undefined });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    forms: [
      {
        fileName: "document-1",
        data: { formData: {} },
        templateIndex: 0,
      },
    ],
    currentForm: {
      fileName: "document-1",
      data: { formData: {} },
      templateIndex: 0,
    },
  });
};

const whenPublishStateIsNotConfirmed = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    forms: [
      {
        fileName: "document-1",
        data: { formData: {} },
        templateIndex: 0,
      },
    ],
    currentForm: {
      fileName: "document-1",
      data: { formData: {} },
      templateIndex: 0,
    },
  });
  mockUseQueue.mockReturnValue({
    processDocuments: mockProcessDocuments,
    queueState: QueueState.INITIALIZED,
    successfulProcessedDocuments: [],
    failedProcessedDocuments: [],
    pendingProcessDocuments: [],
  });
};

describe("publishContainer", () => {
  it("should redirect to '/' if no config file", () => {
    whenNoConfig();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(screen.queryAllByText(/Please wait while we prepare your document/)).toHaveLength(0);
  });

  it("should display preparing screen when documents are being sorted into jobs", () => {
    whenPublishStateIsNotConfirmed();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(screen.queryAllByText(/Please wait while we prepare your document/)).toHaveLength(1);
  });
});
