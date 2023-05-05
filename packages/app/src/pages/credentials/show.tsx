import React from "react";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import {  Box } from "@mui/material";

const wrapString = (str: string, x: number) => {
    const chunks = str.match(/.{1,80}/g);
    if (!chunks) {
        console.log("this should not happen")
        return str;
    }
    return chunks.join("\n")
}

export const CredentialShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;
    const jwt = record?.proof.jwt;
    const splitJwt = record?.proof.jwt ? wrapString(jwt, 80) : null;
    if (splitJwt && record && record.proof.jwt){     
        record.proof.jwt = splitJwt
    }
    return (
        <Show isLoading={isLoading}>
            <Box>
                <pre white-space="pre-line">
                {JSON.stringify(record, null, 2)}
                </pre>
                
                
            </Box>
        </Show>
    );
};
