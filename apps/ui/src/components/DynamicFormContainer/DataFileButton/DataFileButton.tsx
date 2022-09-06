import Ajv from "ajv";
import React, { FunctionComponent, useState } from "react";
import { Button, ButtonVariant } from "../../UI/Button";
import { readFileAsCsv, readFileAsJson, downloadCsvDataFile, downloadJsonDataFile } from "../../../common/utils/utils";
import { getLogger } from "../../../utils/logger";
import { FormError, FormErrorBanner } from "./../FormErrorBanner";
import { Draft04 as Core, JSONSchema } from "json-schema-library";
import { ToolTip } from "../../UI/ToolTip";
import { StyledDropZone } from "../../UI/StyledDropZone";

const { stack } = getLogger("DataFileButton");

const text = {
  header: "You can either upload data file(.JSON or .CSV) to pre-fill fields on this form or enter the fields manually",
  buttonText: "Upload Data File",
  downloadJson: "Download .JSON Data Schema",
  downloadCsv: "Download .CSV Data Schema",
};

type DataFileDefault = {
  data: unknown;
  ownership?: {
    beneficiaryAddress: string;
    holderAddress: string;
  };
};

type DataFileCsv = JSON[];

type DataFileUpload = DataFileDefault | DataFileCsv;

interface DataFileButton {
  onDataFile: (dataFile: unknown) => void;
  schema: JSONSchema;
}

interface ValidateDataFile {
  isValidated: boolean;
  errors: FormError;
}

interface GetDataFileBasedOnExtension {
  dataFile: DataFileUpload;
  dataToValidate: unknown;
}

export const DataFileButton: FunctionComponent<DataFileButton> = ({ onDataFile, schema }) => {
  const [error, setError] = useState(false);
  const [fileErrors, setFileErrors] = useState<FormError>(null);

  const getDataFileBasedOnExtension = async (file: File): Promise<GetDataFileBasedOnExtension> => {
    let dataFile;
    let dataToValidate;
    if (file.name.indexOf(".csv") > 0) {
      dataFile = await readFileAsCsv(file);
      dataToValidate = dataFile[0]; // use 1 item for fields validation
    } else {
      dataFile = await readFileAsJson<DataFileDefault>(file);
      dataToValidate = dataFile.data;
    }
    return { dataFile, dataToValidate };
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const validateDataFile = (schema: JSONSchema, data: unknown): ValidateDataFile => {
    const ajv = new Ajv({ allErrors: true });
    const isValidated = ajv.validate(schema, data) as boolean;
    return { isValidated, errors: ajv.errors };
  };

  const onDropAccepted = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      const { dataFile, dataToValidate } = await getDataFileBasedOnExtension(file);
      const { isValidated, errors } = validateDataFile(schema, dataToValidate);

      if (!isValidated) {
        setError(true);
        setFileErrors(errors);
        return;
      }

      setError(false);
      setFileErrors(null);

      onDataFile(dataFile);
    } catch (e) {
      if (e instanceof Error) {
        stack(e);

        setError(true);
        setFileErrors([
          // ajv set error manually, printing out error message on UI
          {
            instancePath: "",
            keyword: "type",
            message: e.message,
            params: {},
            schemaPath: "#/type",
          },
        ]);
      }
    }
  };

  const core = new Core();
  const jsonTemplate = core.getTemplate({}, schema);

  const defaultStyle = "bg-yellow-50";
  const activeStyle = "bg-yellow-100";

  // TODO: when change to Tailwindcss v2 for ui Update please update the background color, or use a color that is closes to this color.
  return (
    <>
      {error && (
        <div className="my-2" data-testid="file-read-error">
          <FormErrorBanner formErrorTitle="Uploaded data file format has errors." formError={fileErrors} />
        </div>
      )}
      <StyledDropZone
        dropzoneOptions={{ onDropAccepted, multiple: false, accept: [".csv", ".json"] }}
        defaultStyle={defaultStyle}
        activeStyle={activeStyle}
        fileErrors={fileErrors}
        dropzoneIcon="/static/images/upload-icon-dark.png"
        dataTestId="data-file-dropzone"
      >
        <p className="text-center mb-4">{text.header}</p>
        <div className="mb-4">
          <Button data-testid="data-upload-button" variant={ButtonVariant.OUTLINE_PRIMARY} className="flex mx-auto">
            {text.buttonText}
          </Button>
        </div>
      </StyledDropZone>

      <div className="md:flex text-sm justify-between text-cerulean-200 mt-4 px-4">
        <div className="flex items-end mb-2 md:mb-0">
          <ToolTip toolTipText="JSON Schema is a lightweight data interchange format that generates clear, easy-to-understand documentation, making validation and testing easier. JSON Schema is used to describe the structure and validation constraints of JSON documents." />
          <div
            className="ml-2 cursor-pointer hover:underline"
            data-testid="download-json-data-schema-button"
            onClick={() => downloadJsonDataFile(jsonTemplate)}
          >
            {text.downloadJson}
          </div>
        </div>
        <div className="flex items-end">
          <ToolTip toolTipText="CSV Schema defines a textual language which can be used to define the data structure, types and rules for CSV data formats. A CSV data file is a delimited text file that uses a comma to separate values. Each line of the file is a data record. Each record consists of one or more fields, separated by commas." />
          <div
            className="ml-2 cursor-pointer hover:underline"
            data-testid="download-csv-data-schema-button"
            onClick={() => downloadCsvDataFile(jsonTemplate)}
          >
            {text.downloadCsv}
          </div>
        </div>
      </div>
    </>
  );
};
