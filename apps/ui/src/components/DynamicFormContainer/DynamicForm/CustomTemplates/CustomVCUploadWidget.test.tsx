import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CustomVCUploadWidget } from "./CustomVCUploadWidget";
import { v4 as uuid } from "uuid";
import * as oa from "@govtechsg/open-attestation";
import { storeVc } from "../../../../utils/utils";

jest.mock("../../../../utils/utils", () => ({
  storeVc: jest.fn(),
}));

const onChangeMock = jest.fn();

const FrameConnectorMock = () => {
  return <>Hello</>;
};

jest.mock("@govtechsg/decentralized-renderer-react-components", () => ({
  ...jest.requireActual("@govtechsg/decentralized-renderer-react-components"),
  FrameConnector: FrameConnectorMock,
}));

const propsToPassIntoWidget = (): any => {
  return {
    options: {
      text: "Upload VC",
      accept: ".tt",
      documentStorage: {
        url: `http://${uuid()}`,
      },
      renderer: {
        url: `http://${uuid()}`,
      },
      redactionTemplates: {
        default: {
          title: "Recipient",
          key: ["credentialSubject.recipient"],
        },
        specific: {
          title: "Degree",
          key: ["credentialSubject.degree"],
        },
      },
    },
    onChange: onChangeMock,
  };
};

beforeEach(() => jest.clearAllMocks());

describe("CustomVCUploadWidget", () => {
  const fileData = JSON.stringify({
    credentialSubject: {
      links: {
        self: {
          href: "http://testurl.com",
        },
      },
    },
  });

  const mockFile = new File([fileData], "mockFile.tt");

  beforeEach(() => {
    File.prototype.text = jest.fn().mockResolvedValue(fileData);
  });

  describe("uploading and storing vc", () => {
    it("should not store unredacted vc with self link and return url on successful upload", async () => {
      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} />);

      const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;

      await act(async () => {
        userEvent.upload(fileWidget, mockFile);
      });

      const saveVc = screen.getByTestId("button-save-vc") as HTMLButtonElement;

      userEvent.click(saveVc);

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith("http://testurl.com");
      });
    });

    it("should store redacted vc and return url on successful upload", async () => {
      (storeVc as any).mockImplementationOnce(() => Promise.resolve("http://newUrl.com"));

      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} />);

      await act(async () => {
        const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;

        userEvent.upload(fileWidget, mockFile);
      });

      await act(async () => {
        const selectTemplate = screen.getByTestId("select-vc-template") as HTMLSelectElement;

        userEvent.selectOptions(selectTemplate, "default");
      });

      await act(async () => {
        const saveVc = screen.getByTestId("button-save-vc") as HTMLButtonElement;

        userEvent.click(saveVc);
      });

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith("http://newUrl.com");
      });
    });

    it("should store unredacted vc without a self url and return url on successful upload", async () => {
      const fileDataNoUrl = JSON.stringify({
        credentialSubject: {
          test: "a",
        },
      });

      const mockFileNoUrl = new File([fileDataNoUrl], "mockFile.tt");

      File.prototype.text = jest.fn().mockResolvedValue(fileDataNoUrl);

      (storeVc as any).mockImplementationOnce(() => Promise.resolve("http://newUrl.com"));

      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} />);

      await act(async () => {
        const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;

        userEvent.upload(fileWidget, mockFileNoUrl);
      });

      await act(async () => {
        const saveVc = screen.getByTestId("button-save-vc") as HTMLButtonElement;

        userEvent.click(saveVc);
      });

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith("http://newUrl.com");
      });
    });
  });

  describe("displaying errors", () => {
    onChangeMock.mockClear();

    it("should display correct error if fails to store VC", async () => {
      (storeVc as jest.Mock).mockRejectedValueOnce(undefined);

      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} />);
      await act(async () => {
        const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;
        userEvent.upload(fileWidget, mockFile);
      });
      await act(async () => {
        const selectTemplate = screen.getByTestId("select-vc-template") as HTMLSelectElement;
        userEvent.selectOptions(selectTemplate, "default");
      });
      await act(async () => {
        const saveVc = screen.getByTestId("button-save-vc") as HTMLButtonElement;
        userEvent.click(saveVc);
      });
      await waitFor(() => {
        expect(onChangeMock).not.toHaveBeenCalled();
        screen.getByText("Unable to store file");
      });
    });

    it("should display error if file doesn't contain a valid link", async () => {
      const testData = "some invalid file";
      File.prototype.text = jest.fn().mockResolvedValueOnce(testData);

      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} />);
      const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;

      userEvent.upload(fileWidget, mockFile);

      await waitFor(() => {
        expect(onChangeMock).not.toHaveBeenCalled();
        screen.getByText("Invalid file");
      });
    });
  });

  describe("renderer and templates", () => {
    it("should display renderer for linked VC", async () => {
      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} />);

      const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;

      userEvent.upload(fileWidget, mockFile);

      await waitFor(() => {
        screen.getByText("Hello");
      });
    });

    it("should display redaction templates if available", async () => {
      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} />);

      const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;

      userEvent.upload(fileWidget, mockFile);

      await waitFor(() => {
        const selectTemplate = screen.getByTestId("select-vc-template") as HTMLSelectElement;

        expect((selectTemplate.children[0] as HTMLOptionElement).value).toStrictEqual("Select a template");
        expect((selectTemplate.children[1] as HTMLOptionElement).value).toStrictEqual("default");
        expect((selectTemplate.children[2] as HTMLOptionElement).value).toStrictEqual("specific");
      });
    });

    it("should not display redaction templates if not available", async () => {
      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} options={{ text: "Upload VC", accept: ".tt" }} />);

      const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;

      userEvent.upload(fileWidget, mockFile);

      await waitFor(() => {
        const selectTemplate = screen.queryByTestId("select-vc-template") as HTMLSelectElement;
        expect(selectTemplate).toBeFalsy();
      });
    });

    it("should display reset button if redactions have been made", async () => {
      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} />);

      const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;
      await act(async () => {
        userEvent.upload(fileWidget, mockFile);
      });

      expect(screen.queryByTestId("button-redaction-reset") as HTMLButtonElement).toBeFalsy();

      await act(async () => {
        const selectTemplate = screen.getByTestId("select-vc-template") as HTMLSelectElement;

        userEvent.selectOptions(selectTemplate, "default");
      });

      expect(screen.queryByTestId("button-redaction-reset") as HTMLButtonElement).toBeTruthy();
    });

    it("should call obfuscateDocument on every key in redaction template when template is selected", async () => {
      const res = jest.spyOn(oa, "obfuscateDocument");

      render(<CustomVCUploadWidget {...propsToPassIntoWidget()} />);

      await act(async () => {
        const fileWidget = screen.getByTestId("custom-vc-upload-widget") as HTMLInputElement;

        userEvent.upload(fileWidget, mockFile);
      });

      const selectTemplate = screen.getByTestId("select-vc-template") as HTMLSelectElement;

      await waitFor(() => {
        userEvent.selectOptions(selectTemplate, "default");

        expect(res).toHaveBeenCalledWith(JSON.parse(fileData), ["credentialSubject.recipient"]);
      });
    });
  });
});
