import { Persona } from "../../../types";
import { APP_NAME } from "../../../appConfig";

export const TransferableRecordPersonas: Persona[] = [
  {
    image: "/static/images/home//howItWorks/persona/persona1.png",
    jobTitle: "The Exporter",
    description:
      "This is Kevin, he is an exporter with customers in many different countries. See how he cuts down on time and cost when dealing with Blank-Endorsed BL.",
    learnMore: {
      title: "Electronic Bill of Lading",
      thenSteps: [
        {
          stepTitle: "Step 1",
          icon: "/static/images/home/howItWorks/icons/paperReceive.svg",
          description: "Exporter received BL from carrier (via courier)",
        },
        {
          stepTitle: "Step 2",
          icon: "/static/images/home/howItWorks/icons/paperCheck.svg",
          description: "Exporter checks the details of BL including entire endorsement chain",
        },
        {
          stepTitle: "Step 3",
          icon: "/static/images/home/howItWorks/icons/paperEndorse.svg",
          description: "Exporter inserts BL into document pack and arranges courier pickup",
        },
        {
          stepTitle: "Step 4",
          icon: "/static/images/home/howItWorks/icons/paperDispatch.svg",
          description: "Exporter endorses and dispatches the BL to Negotiating Bank (via courier)",
        },
      ],
      nowSteps: [
        {
          stepTitle: "Step 1",
          icon: "/static/images/home/howItWorks/icons/eReceive.svg",
          description: "Exporter receives eBL from carrier (via email)",
        },
        {
          stepTitle: "Step 2",
          icon: "/static/images/home/howItWorks/icons/eCheck.svg",
          description: "Exporter checks for authenticity and provenance including endorsement entry",
        },
        {
          stepTitle: "Step 3",
          icon: "/static/images/home/howItWorks/icons/eEndorse.svg",
          description:
            "Exporter performs endorsement to Negotiating Bank and sends eBL to Negotiating Bank (via email)",
        },
      ],
      endMessage: `${APP_NAME} is more than a tool to hasten your exporting processes. Get in touch to find out more!`,
    },
  },
  {
    image: "/static/images/home/howItWorks/persona/persona2.png",
    jobTitle: "The Carrier",
    description: `This is Lizzie and she works for a Carrier. She uses an electronic Bill-of-Lading (eBL) solution enabled by ${APP_NAME} to issue and surrender eBLs to her clients.`,
    learnMore: {
      title: "Issuance and Surrender of Electronic Bill of Lading",
      startMessage: "Benefits gained by Lizzie",
      benefits: [
        {
          benefitTitle: "1",
          icon: "/static/images/home/howItWorks/icons/customerExperience.svg",
          description: "Improved customer experience with fast, transparent and trusted eBL",
        },
        {
          benefitTitle: "2",
          icon: "/static/images/home/howItWorks/icons/signUp.svg",
          description: "Remove the need to subscribe to multiple eBL solutions",
        },
        {
          benefitTitle: "3",
          icon: "/static/images/home/howItWorks/icons/paperRisk.svg",
          description: "Lower the risk of human error",
        },
        {
          benefitTitle: "4",
          icon: "/static/images/home/howItWorks/icons/paperAuthenticity.svg",
          description: `Legal certainty as ${APP_NAME} is designed to align to MLETR`,
        },
      ],
      endMessage: `These ${APP_NAME} benefits are just the tip of the iceberg. Get in touch to find out more!`,
    },
  },
  {
    image: "/static/images/home/howItWorks/persona/persona3.png",
    jobTitle: "The Importer",
    description: `This is Cara. She is an importer using ${APP_NAME} to streamline her cargo collection process and this has benefitted her oganisation immensely.`,
    learnMore: {
      title: "Electronic Bill of Lading",
      startMessage: "Benefits gained by Cara",
      benefits: [
        {
          benefitTitle: "1",
          icon: "/static/images/home/howItWorks/icons/speedUp.svg",
          description: "Shortened endorsement process",
        },
        {
          benefitTitle: "2",
          icon: "/static/images/home/howItWorks/icons/wallet.svg",
          description: "Lower cost, faster turnaround and less paperwork",
        },
        {
          benefitTitle: "3",
          icon: "/static/images/home/howItWorks/icons/paperRisk.svg",
          description: "Lower risk of human error",
        },
        {
          benefitTitle: "4",
          icon: "/static/images/home/howItWorks/icons/paperTick.svg",
          description: "Simplify the checking of entire endorsement chain",
        },
      ],
      endMessage: `These ${APP_NAME} benefits are just the tip of the iceberg. Get in touch to find out more!`,
    },
  },
  {
    image: "/static/images/home/howItWorks/persona/persona4.png",
    jobTitle: "The Banker",
    description: `This is Liam. He is a banker who processes trade financing applications. Find out how he managed to reduce fraud by using ${APP_NAME} to process Blank-Endorsed BL.`,
    learnMore: {
      title: "Electronic Bill of Lading",
      thenSteps: [
        {
          stepTitle: "Step 1",
          icon: "/static/images/home/howItWorks/icons/paperReceive.svg",
          description:
            "Negotiating Bank receives BL from Exporter (via courier) and checks the details of BL including entire endorsement chain",
        },
        {
          stepTitle: "Step 2",
          icon: "/static/images/home/howItWorks/icons/paperEndorse.svg",
          description: "Negotiating Bank endorses BL and dispatches BL to Issuing Bank (via courier)",
        },
        {
          stepTitle: "Step 3",
          icon: "/static/images/home/howItWorks/icons/paperCheck.svg",
          description:
            "Issuing Bank receives BL from Negotiating Bank (via courier) and checks the details of BL including the entire endorsement chain before endorsing the BL",
        },
        {
          stepTitle: "Total Time Taken",
          description: "10-20 days",
        },
      ],
      nowSteps: [
        {
          stepTitle: "Step 1",
          icon: "/static/images/home/howItWorks/icons/eCheck.svg",
          description:
            "Negotiating Bank receives eBL from Carrier (via email) and checks for authenticity and provenance including the endorsement entry",
        },
        {
          stepTitle: "Step 2",
          icon: "/static/images/home/howItWorks/icons/eEndorse.svg",
          description: "Negotiating Bank performs endorsement and sends to the Issuing Bank (via email)",
        },
        {
          stepTitle: "Step 3",
          icon: "/static/images/home/howItWorks/icons/cheque.svg",
          description: `Issuing Bank checks for authenticity (via ${APP_NAME}) and provenance including the endorsement entry before endorsing the eBL`,
        },
        {
          stepTitle: "Total Time Taken",
          description: "Less Than 1 day",
        },
      ],
      endMessage: `${APP_NAME} is more than a tool to prevent fraud. Get in touch to find out more!`,
    },
  },
];
