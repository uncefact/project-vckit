import React, { ChangeEvent, FunctionComponent, useState } from "react";
import { WidgetProps } from "@rjsf/core";
import { ButtonVariant, ButtonSize } from "../../../UI/Button";
import { Upload } from "react-feather";
import { ActionsUrlObject } from "../../../../types";
import { useConfigContext } from "../../../../common/contexts/config";
import { getReservedStorageUrl } from "../../../../common/hooks/useQueue/utils/publish";

import { WatermarkPreview } from "../../WatermarkPreview";

export const CustomWatermarkPreviewWidget: FunctionComponent<WidgetProps> = ({
  id,
  autofocus,
  multiple,
  disabled,
  readonly,
  options,
  onChange,
}) => {
  interface FileData {
    dataURL: string;
    name: string;
    size: number;
    type: string;
  }

  const { config } = useConfigContext();

  const [filesMetadata, setFilesMetadata] = useState<any[]>([]);
  const [qrURL, setQrURL] = useState<ActionsUrlObject | undefined>();

  function processFile(file: File): Promise<FileData | DOMException> {
    const { name, size, type } = file;
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onerror = () => {
        reject(reader.error ?? "");
      };

      reader.onload = (event) => {
        resolve({
          dataURL: event?.target?.result,
          name,
          size,
          type,
        } as FileData);
      };
      reader.readAsDataURL(file);
    });
  }

  function processFiles(files: FileList): Promise<any[]> {
    return Promise.all([].map.call(files, processFile));
  }
  const FilesInfo = () => {
    if (filesMetadata.length === 0) {
      return null;
    }
    return (
      <ul className="file-info">
        {filesMetadata.map((info: any, key: number) => {
          return (
            <li key={key} className="mt-3" data-testid="document-attachment-preview">
              <WatermarkPreview dataURL={info.dataURL} qrURL={qrURL} />
            </li>
          );
        })}
      </ul>
    );
  };

  const generateQrUrl = async () => {
    if (config?.network !== "local") {
      if (config?.documentStorage !== undefined) {
        return getReservedStorageUrl(config.documentStorage, config.network);
      }
    }
  };

  const _onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesInfo = await processFiles(event.target.files);
      setQrURL(await generateQrUrl());
      setFilesMetadata(filesInfo);
      if (multiple) {
        return onChange(filesInfo.map((fileInfo) => fileInfo.dataURL));
      }
      return onChange(filesInfo[0].dataURL);
    }
  };

  return (
    <label>
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
        data-testid="custom-watermark-preview-widget"
      />
    </label>
  );
};
