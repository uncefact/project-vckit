import React, { useContext } from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, MarkdownField } from "@refinedev/mui";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { parseTableParams } from "@refinedev/core";


// const urlMap = {
//   '63f6aaea0bc18e6b5072': {
//     url: 'https://vckit-holder-demo.herokuapp.com/agent',
//     key: '6be43a8796107d3a71b8bf371ea06882b7cbcc35e4902d5c6f1dde3601533a4f'
//   },
//   '63f6ab274a880d344c39': {
//     url: 'https://vckit-issuer-demo.herokuapp.com/agent',
//     key: '2a7f4f62000559d507f0ba0a6812130e3624a9cee4a2dabbcb3e60c54117556b'
//   },
//   '63f6ab55ad7738f18069': {
//     url: 'https://vckit-verifier-demo.herokuapp.com/agent',
//     key: '0661f5c16440f69616fe6f3c2616d7006739f0217462ba5bed99a0ff6b33d340'
//   }
// }
// type urlMapKey = keyof typeof urlMap;

const getCredentialSubjectId = (params: any) => {
  return `${params.row.verifiableCredential.credentialSubject.id}`
}
const getIssuerId = (params: any) => {
    return `${params.row.verifiableCredential.issuer.id}`
  }
const getCredentialType = (params: any) => {
    const typeList = params.row.verifiableCredential.type
    const type = (typeList.length > 1) ? typeList[1]: typeList[0]
    return type
  }
export const CredentialList = () => {

    const { dataGridProps } = useDataGrid();

    const columns = React.useMemo<GridColumns<any>>(
        () => [
            {
                field: "credentialSubjectId",
                headerName: "Credential Subject ID",
                minWidth: 400,
                valueGetter: getCredentialSubjectId,
                renderCell: function render({ value }) {
                    return (
                        <MarkdownField
                            value={(value ?? "").slice(0, 80) + "..."}
                        />
                    );
                },
            },
            {
                field: "issuerId",
                headerName: "Issuer ID",
                minWidth: 400,
                valueGetter: getIssuerId,
                renderCell: function render({ value }) {
                    return (
                        <MarkdownField
                            value={(value ?? "").slice(0, 80)}
                        />
                    );
                },
            },
            {
                field: "credentialType",
                headerName: "Credential Type",
                minWidth: 200,
                valueGetter: getCredentialType,
                renderCell: function render({ value }) {
                    return (
                        <MarkdownField
                            value={(value ?? "").slice(0, 80)}
                        />
                    );
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                renderCell: function render({ row }) {
                    return (
                        <>
                            <ShowButton hideText recordItemId={row.id} />
                        </>
                    );
                },
                align: "center",
                headerAlign: "center",
                minWidth: 80,
            },
        ],
        [],
    );

    return (
        <List>
            <DataGrid {...dataGridProps} columns={columns} autoHeight />
        </List>
    );
};
