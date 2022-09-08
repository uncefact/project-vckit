import { DocumentTypeContent } from "../../../types";
import { TransferableRecordPersonas } from "./TransferableRecordPersonas";
import { VerifiableDocumentPersonas } from "./VerifiableDocumentPersonas";
import { APP_NAME } from "../../../appConfig";

export const DocumentContent: DocumentTypeContent[] = [
  {
    type: "Transferable Records",
    description:
      "Transferable Records are trade documents that entitle the holder to claim the performance of an obligation or ownership.",
    examples:
      "Examples of transferable records typically include bills of lading, bills of exchange, promissory notes, and warehouse receipts.",
    message: `See how things change from the use of ${APP_NAME}-enabled solutions when dealing with eBL `,
    users: TransferableRecordPersonas,
  },
  {
    type: "Verifiable Documents",
    description: "Verifiable Documents are other non-transferable trade documents that do not confer ownership.",
    examples:
      "Examples of verifiable documents typically include Certificate of Origin (CoO), Invoices and promissory notes.",
    message: `See how each persona has benefited from using ${APP_NAME} when dealing with Certificate of Origin.`,
    users: VerifiableDocumentPersonas,
  },
];
