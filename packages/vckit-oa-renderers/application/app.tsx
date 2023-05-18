import React, { useCallback, useEffect, useState } from "react";
import { FrameActions, FrameConnector, HostActionsHandler } from "@govtechsg/decentralized-renderer-react-components";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

interface AppProps {
  documents: {
    name: string;
    document: any;
  }[];
}

const TemplatesContainer = styled.div``;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  button {
    color: #fff;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-weight: 700;
    border-radius: 0.25rem;
    background-color: #4299e1;
    cursor: pointer;
    border: 0;
  }
  button: hover {
    background-color: #2b6cb0;
  }
`;

const FrameContainer = styled.div`
  display: flex;
`;
const DocumentsContainer = styled.div`
  width: 300px;
  min-width: 300px;
  max-width: 300px;
  padding: 0.5rem;

  .document {
    cursor: pointer;
    padding: 0.5rem;
    background-color: #ebf8ff;
    border-top: 4px solid #4299e2;
    margin-bottom: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .document.active {
    border-top-color: #38b2ac;
    background-color: #e6fffa;
  }
`;

export const App: React.FunctionComponent<AppProps> = ({ documents }): React.ReactElement => {
  const [toFrame, setToFrame] = useState<HostActionsHandler>();
  const [height, setHeight] = useState(50);
  const [templates, setTemplates] = useState<{ id: string; label: string }[]>([]);
  const [document, setDocument] = useState<{ name: string; document: any }>();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const fn = useCallback((toFrame: HostActionsHandler) => {
    // wrap into a function otherwise toFrame function will be executed
    setToFrame(() => toFrame);
  }, []);

  const fromFrame = (action: FrameActions): void => {
    if (action.type === "UPDATE_HEIGHT") {
      setHeight(action.payload);
    }
    if (action.type === "UPDATE_TEMPLATES") {
      setTemplates(action.payload);
      setSelectedTemplate(action.payload[0].id);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.renderDocument = document => {
    if (toFrame && document) {
      toFrame({
        type: "RENDER_DOCUMENT",
        payload: {
          document
        }
      });
    }
  };
  useEffect(() => {
    if (toFrame && document) {
      toFrame({
        type: "RENDER_DOCUMENT",
        payload: {
          document: document.document
        }
      });
    }
  }, [toFrame, document]);
  useEffect(() => {
    if (toFrame && selectedTemplate) {
      toFrame({
        type: "SELECT_TEMPLATE",
        payload: selectedTemplate
      });
    }
  }, [selectedTemplate, toFrame]);

  return (
    <div>
      <ActionsContainer>
        <button
          onClick={() => {
            if (toFrame) {
              toFrame({
                type: "PRINT"
              });
            }
          }}
        >
          Print
        </button>
      </ActionsContainer>
      <FrameContainer>
        <DocumentsContainer>
          <div
            css={css`
              text-align: center;
              font-weight: bold;
            `}
          >
            Documents
          </div>
          {documents.length === 0 && <div>Please configure the application and provide at least one document</div>}
          {documents.map((d, index) => {
            return (
              <div key={index} className={`document ${document === d ? "active" : ""}`} onClick={() => setDocument(d)}>
                {d.name}
              </div>
            );
          })}
        </DocumentsContainer>
        {!document && (
          <div
            css={css`
              text-align: center;
              flex-grow: 1;
              align-self: center;
              cursor: pointer;
            `}
          >
            Please select a document on the left bar
          </div>
        )}
        <div
          css={css`
            width: 100%;
            display: ${document ? "block" : "none"};
          `}
        >
          <TemplatesContainer>
            <ul
              css={css`
                display: flex;
                border-bottom: 1px solid #e2e8f0;
                list-style: none;
                margin: 0;
                padding: 0;
                li {
                  margin-right: 0.25rem;
                }
                li.selected {
                  margin-bottom: -1px;
                }
                a {
                  text-decoration: none;
                  padding-left: 1rem;
                  padding-right: 1rem;
                  padding-top: 0.5rem;
                  padding-bottom: 0.5rem;
                  font-weight: 600;
                  display: inline-block;
                  background-color: white;
                  border-style: solid;
                  border-color: #e2e8f0;
                }
                li.selected a {
                  color: #2b6cb0;
                  border-bottom: none;
                  border-left-width: 1px;
                  border-right-width: 1px;
                  border-top-width: 1px;
                  border-top-left-radius: 0.25rem;
                  border-top-right-radius: 0.25rem;
                }

                li a {
                  color: #4299e1;
                  border-width: 0px;
                }
              `}
            >
              {templates.map(template => (
                <li
                  key={template.id}
                  className={`tab ${selectedTemplate === template.id ? "selected" : ""}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <a href="#">{template.label}</a>
                </li>
              ))}
            </ul>
          </TemplatesContainer>
          <div
            css={css`
              border: 1px solid #e2e8f0;
              border-top: none;
              padding: 2rem;
              margin-right: 0.5rem;
            `}
          >
            <FrameConnector
              source="http://localhost:3000"
              dispatch={fromFrame}
              onConnected={fn}
              css={css`
                margin: auto;
                max-width: 1120px;
                border: 0;
                width: 100%;
                height: ${height}px;
                padding: 1rem;
                padding-top: 0.5rem;
              `}
            />
          </div>
        </div>
      </FrameContainer>
    </div>
  );
};
