import React, { FunctionComponent } from "react";
import { css } from "@emotion/core";
import QRCode from "qrcode.react";

interface QrCode {
  url: string;
  size?: number;
}

export const QrCode: FunctionComponent<QrCode> = ({ url, size = 250 }) => (
  <div
    css={css`
      .show-print {
        display: none;
      }

      @media print {
        .show-print {
          position: relative;
          display: flex;
          page-break-before: always;
          align-items: center;
          justify-content: center;
          padding: 32px;
          border-style: solid;
          border-width: 0.5px;
          border-color: #000;
        }

        .genterated-text {
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: 0.8em;
          color: grey;
        }
      }
    `}
  >
    <div className="show-print">
      <QRCode value={url} size={size} />
      <div style={{ fontSize: 32, marginLeft: 64 }}>Scan the QR code with your phone camera.</div>
      <div className="genterated-text">Automatically Generated</div>
    </div>
  </div>
);
