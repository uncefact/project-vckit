import { FormItemSchema } from "./types";

export const schema = {
  documentName: {
    type: "string",
    uiType: "withLabel",
    title: "Document Name",
  },
  cooId: {
    type: "string",
    uiType: "withLabel",
    title: "CoO ID",
    options: {
      readonly: true,
    },
  },
  issueIn: {
    type: "string",
    uiType: "withLabel",
    title: "Issued In",
  },
  issueDateTime: {
    type: "string",
    uiType: "withLabel",
    title: "Issued Date and Time",
  },
  exporterDetails: {
    title: "Exporter Details",
    type: "object",
    uiType: "accordion",
    properties: {
      exportCountry: {
        title: "Export Country (Country Code)",
        type: "string",
        uiType: "withLabel",
      },
      exporterName: {
        title: "Exporter Name",
        type: "string",
        uiType: "withLabel",
      },
      exporterAddress: {
        title: "Exporter Address",
        type: "object",
        uiType: "withLabel",
        properties: {
          line1: {
            type: "string",
            uiType: "withoutLabel",
            title: "Address Line 1",
          },
          line2: {
            type: "string",
            uiType: "withoutLabel",
            title: "Address Line 2",
          },
          postalCode: {
            type: "string",
            uiType: "withoutLabel",
            title: "Postal Code",
          },
        },
      },
    },
  },
  importerDetails: {
    title: "Importer Details",
    type: "object",
    uiType: "accordion",
    properties: {
      importCountry: {
        title: "Import Country (Country Code)",
        type: "string",
        uiType: "withLabel",
      },
      importerName: {
        title: "Importer Name",
        type: "string",
        uiType: "withLabel",
      },
      importerAddress: {
        title: "Importer Address",
        type: "object",
        uiType: "withLabel",
        properties: {
          line1: {
            type: "string",
            uiType: "withoutLabel",
            title: "Address Line 1",
          },
          line2: {
            type: "string",
            uiType: "withoutLabel",
            title: "Address Line 2",
          },
          postalCode: {
            type: "string",
            uiType: "withoutLabel",
            title: "Postal Code",
          },
        },
      },
    },
  },
  descriptionOfGoods: {
    title: "Description of Goods",
    type: "object",
    uiType: "accordion",
    properties: {
      includedConsignments: {
        title: "Included Consignments",
        type: "string",
        uiType: "withLabel",
      },
      importerNameMarksAndNumber: {
        title: "Importer Name Marks and Number",
        type: "string",
        uiType: "withLabel",
      },
      numberAndKindOfPackage: {
        title: "Number and Kind of package; Description of Goods",
        type: "string",
        uiType: "withLabel",
      },
      hsCode: {
        title: "H.S. Code",
        type: "string",
        uiType: "withLabel",
      },
      invoiceNumber: {
        title: "Invoice Number",
        type: "string",
        uiType: "withLabel",
      },
      dateOfInvoice: {
        title: "Date of Invoice",
        type: "string",
        uiType: "withLabel",
      },
      loadingBaseportLocationName: {
        title: "Loading Baseport Location Name",
        type: "string",
        uiType: "withLabel",
      },
      mainCarriageTransportMovementId: {
        title: "Main Carriage Transport Movement ID",
        type: "string",
        uiType: "withLabel",
      },
    },
  },

  firstSignatoryAuthentication: {
    title: "First Signatory Authentication",
    type: "object",
    uiType: "accordion",
    properties: {
      actualDate: {
        title: "Date",
        type: "string",
        uiType: "withoutLabel",
      },
      statement: {
        title: "Statement",
        type: "string",
        uiType: "textarea",
      },
      signature: {
        title: "Signature",
        type: "string",
        uiType: "upload",
      },
    },
  },
} as Record<string, FormItemSchema>;
