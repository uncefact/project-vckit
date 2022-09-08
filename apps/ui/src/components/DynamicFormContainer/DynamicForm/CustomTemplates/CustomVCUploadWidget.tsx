import React, { ChangeEvent, FunctionComponent, useCallback, useState, useRef, MouseEvent, useReducer } from "react";
import { WidgetProps } from "@rjsf/core";
import { Upload } from "react-feather";
import { FrameActions, FrameConnector, renderDocument } from "@govtechsg/decentralized-renderer-react-components";
import { obfuscateDocument, OpenAttestationDocument } from "@govtechsg/open-attestation";
import { ButtonVariant, ButtonSize, Button } from "../../../UI/Button";
import { DEFAULT_RENDERER } from "../../../../appConfig";
import { generateIdAndKey } from "../../../../common/API/storageAPI";
import { storeVc } from "../../../../utils/utils";

type VCDocumentState = {
  document?: any;
  hasRedaction: boolean;
};

enum VCDocumentActionType {
  "obfuscate" = "obfuscate",
  "initialize" = "initialize",
}

type VCDocumentAction =
  | { type: VCDocumentActionType.obfuscate; payload: string[] | string }
  | { type: VCDocumentActionType.initialize; payload: any };

const initialState: VCDocumentState = { document: undefined, hasRedaction: false };

// We're implementing a reducer to separate state management.
// We don't want the distributed renderer to rerender on every edit.
// As such we must move the obfuscate function and document state out of the component
function reducer(state: VCDocumentState, action: VCDocumentAction): VCDocumentState {
  switch (action.type) {
    case VCDocumentActionType.obfuscate: {
      const res = obfuscateDocument(state.document, action.payload);
      return { document: res, hasRedaction: true };
    }
    case VCDocumentActionType.initialize:
      return { document: action.payload, hasRedaction: false };
    default:
      return state;
  }
}

interface FileData {
  dataURL: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export const CustomVCUploadWidget: FunctionComponent<WidgetProps> = ({
  id,
  autofocus,
  multiple,
  disabled,
  readonly,
  options,
  onChange,
}) => {
  const [originalDoc, setOriginalDoc] = useState<OpenAttestationDocument>();
  const [document, setDocument] = useState<OpenAttestationDocument>();
  const [height, setHeight] = useState<number>();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState("");
  const [renderer, setRenderer] = useState((options.renderer as any)?.url ?? DEFAULT_RENDERER);

  const [state, dispatchAction] = useReducer(reducer, initialState);

  // Set inside config file
  const documentStorage = (options.documentStorage as any)?.url;
  const templates = options.redactionTemplates as any;

  // Obfuscate fields based on redaction template selected
  const handleTemplateObfuscate = (templateName: any) => {
    const { key } = templates[templateName];

    if (key) {
      dispatchAction({ type: VCDocumentActionType.obfuscate, payload: key });

      const res = obfuscateDocument(state.document, key);
      setDocument(res);
    }
  };

  const toFrame = useRef<any>();

  const handleSaveVC = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    // If user has redacted data or VC has no self url,
    // then store VC to storage API and return new url.
    if (state.hasRedaction || !url) {
      let newDocument = state.document;

      const queueData = generateIdAndKey();

      // If redacted, then ensure original self url is obfuscated
      if (url) {
        newDocument = obfuscateDocument(state.document as any, "credentialSubject.links");
      }

      try {
        const payloadUrl = await storeVc({
          documentStorage,
          id: queueData.data.id,
          decryptionKey: queueData.data.key,
          document: newDocument as OpenAttestationDocument,
        });

        if (payloadUrl) {
          onChange(payloadUrl);
        }
      } catch {
        setError("Unable to store file");
      }
    }
    // VC with self url and no redactions, just store the self url
    // Artificially wait 0.5 sec to provide visual feedback
    else {
      return setTimeout(() => {
        onChange(url);
        setLoading(false);
      }, 500);
    }

    setLoading(false);
  };

  /**
   * @param action Set of host actions that renderer can call
   */
  const dispatch = useCallback(
    (action: FrameActions): void => {
      if (action.type === "UPDATE_HEIGHT") {
        if (!height) {
          setHeight(action.payload);
        }
      }

      if (action.type === "OBFUSCATE") {
        dispatchAction({ type: VCDocumentActionType.obfuscate, payload: action.payload });
      }
    },
    /*eslint-disable */
    [height]
  );

  /**
   * Once distributed renderer is loaded,
   * it dispatches a call to parent frame to load document
   */
  const onConnected = useCallback(
    (frame: any) => {
      toFrame.current = frame;
      if (toFrame.current && document) {
        toFrame.current(renderDocument({ document }));
      }
    },
    [document]
  );

  /**
   * Processes uploaded file.
   */
  async function processFile(file: File): Promise<any> {
    // Reset all values
    setError("");
    setUrl("");
    setHeight(undefined);
    setRenderer((options.renderer as any)?.url ?? DEFAULT_RENDERER);

    try {
      const { name } = file;

      // Must be JSON
      // Otherwise error is set and invalid file is displayed
      const payload = JSON.parse(await file.text());

      return new Promise(async (resolve, reject) => {
        const reader = new window.FileReader();

        reader.onerror = () => {
          reject(reader.error ?? "");
        };

        // Check if renderer is present
        const rendererUrl = payload?.openAttestationMetadata?.template?.url;
        if (rendererUrl) {
          setRenderer(rendererUrl);
        }

        // Extract selfUrl to be reused if VC is not redacted
        const selfUrl = payload?.credentialSubject?.links?.self?.href;
        setUrl(selfUrl);

        // Rerender the component
        setDocument({ ...payload });
        // Store the document in reducer for edit
        dispatchAction({ type: VCDocumentActionType.initialize, payload: { ...payload } });
        // Store a copy for reset
        setOriginalDoc({ ...payload });

        reader.onload = () => {
          resolve({
            name,
            url,
            payload,
          } as Partial<FileData>);
        };
        reader.readAsDataURL(file);
      });
    } catch (err) {
      setError("Invalid file");
    }
  }
  const FilesInfo = useCallback(() => {
    if (error) {
      return <p className="mt-3 text-error">{error}</p>;
    }

    if (!document) {
      return null;
    }

    return (
      <ul className="file-info mt-4">
        <div>
          {!error &&
            (renderer ? (
              <div>
                <FrameConnector
                  style={{ height: `${height}px`, width: "100%", border: "0px" }}
                  source={renderer}
                  dispatch={dispatch}
                  onConnected={onConnected}
                />
              </div>
            ) : (
              <p className="mt-3 mb-3 text-error">Unable to detect renderer</p>
            ))}
        </div>
      </ul>
    );
    /*eslint-disable */
  }, [document, height, error]);

  const _onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      await processFile(event.target.files[0]);

      // In case an error occurs, we allow the same file to be uploaded
      event.target.value = "";
    }
  };

  const hasValidFile = !error && document;

  return (
    <>
      <label>
        <div>
          <div className={`${ButtonVariant.OUTLINE_PRIMARY} ${ButtonSize.MD} border w-max`}>
            <Upload className="inline mr-4 text-cerulean" />
            <p className="inline font-bold">{options.text ?? "Upload Button"}</p>
          </div>
          <FilesInfo />
          <input
            id={id}
            className="hidden"
            type="file"
            onChange={_onChange}
            disabled={readonly || disabled}
            defaultValue=""
            autoFocus={autofocus}
            multiple={multiple}
            accept={(options.accept as string) ?? undefined}
            data-testid="custom-vc-upload-widget"
          />
        </div>
      </label>

      {hasValidFile && (
        <div className="flex justify-between">
          <div>
            {templates && (
              <select
                data-testid="select-vc-template"
                className={`capitalize border ${ButtonSize.MD} ${ButtonVariant.OUTLINE_PRIMARY}`}
                value={template}
                onChange={(e) => {
                  setTemplate(e.target.value);
                  handleTemplateObfuscate(e.target.value);
                }}
              >
                <option>Select a template</option>
                {Object.keys(templates).map((templateName: any) => (
                  <option data-testid={`option-${templateName}`} key={templateName} value={templateName}>
                    {templates[templateName]?.title ?? templateName}
                  </option>
                ))}
              </select>
            )}
            {state.hasRedaction && (
              <Button
                data-testid="button-redaction-reset"
                className="ml-4"
                variant={ButtonVariant.OUTLINE_PRIMARY}
                type="button"
                onClick={() => {
                  dispatchAction({
                    type: VCDocumentActionType.initialize,
                    payload: { ...originalDoc },
                  });
                  setDocument({ ...originalDoc } as OpenAttestationDocument);
                  setTemplate("");
                }}
              >
                Reset
              </Button>
            )}
          </div>

          <Button
            data-testid="button-save-vc"
            className="w-[80px]"
            variant={ButtonVariant.PRIMARY}
            type="button"
            onClick={handleSaveVC}
            loading={loading}
          >
            Save
          </Button>
        </div>
      )}
    </>
  );
};
