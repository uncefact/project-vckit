import React, { useEffect } from "react";
import { CSSRules } from "./styles"
import WarningIcon from '@mui/icons-material/Warning';
export const DemoBanner = () => {
    useEffect(() => {
        const styleTag = document.createElement("style");
        document.head.appendChild(styleTag);
        CSSRules.forEach((rule) =>
            styleTag.sheet?.insertRule(rule, styleTag.sheet.cssRules.length),
        );
    }, []);

    return (
        <div
            className="banner"
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                padding: "8px 16px",
                backgroundColor: "#ff9800",
                borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
            }}
        >
            {/* sider offset for center alignment */}
            <div
                style={{
                    width: "200px",
                }}
            />
            <a
                className="gh-link"
                href="https://github.com/uncefact/project-vckit"
                target="_blank"
                rel="noreferrer"
            >
                <div
                    className="content"
                    style={{
                        position: "relative",
                        zIndex: 2,
                        color: "#fff",
                        display: "flex",
                        flexDirection: "row",
                        gap: "8px",
                    }}
                >
                      <span
                        className="warning"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "32px",
                            height: "32px",
                            fontSize: "32px",
                            lineHeight: "32px",
                        }}
                    >
                        <WarningIcon />
                    </span>

                    <span
                        className="text"
                        style={{
                            padding: "4px 0",
                            fontSize: "16px",
                            lineHeight: "24px",
                            textShadow: "0px 0px 4px rgba(255, 255, 255, 0.5)",
                        }}
                    >
                      vc-kit is in public beta, so please expect some rough edges. Click here to report issues or propose new features. 
                    </span>
                </div>
            </a>
        </div>
    );
};