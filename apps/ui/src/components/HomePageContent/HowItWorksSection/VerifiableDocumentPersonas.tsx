import { Persona } from "../../../types";

export const VerifiableDocumentPersonas: Persona[] = [
  {
    image: "/static/images/home/howItWorks/persona/persona5.png",
    jobTitle: "The Exporter",
    description:
      "This is Joan. She is an exporter with customers in many countries. Find out how she improves the process of handling the Certificate of Origin using TradeTrust.",
    learnMore: {
      title: "Electronic Certificate of Origin",
      thenSteps: [
        {
          stepTitle: "Step 1",
          icon: "/static/images/home/howItWorks/icons/paperReceive.svg",
          description: "Exporter receives CoO from Exporting Country's Cert Issuing Authority (via courier)",
        },
        {
          stepTitle: "Step 2",
          icon: "/static/images/home/howItWorks/icons/paperCheck.svg",
          description: "Exporter checks the details of CoO",
        },
        {
          stepTitle: "Step 3",
          icon: "/static/images/home/howItWorks/icons/paperDispatch.svg",
          description: "Exporter dispatches the CoO to Bank (via courier)",
        },
        {
          stepTitle: "Total Time Taken",
          description: "10-20 days",
        },
      ],
      nowSteps: [
        {
          stepTitle: "Step 1",
          icon: "/static/images/home/howItWorks/icons/eReceive.svg",
          description: "Exporter receives eCoO from Exporting Country's Cert Issuing Authority (via email)",
        },
        {
          stepTitle: "Step 2",
          icon: "/static/images/home/howItWorks/icons/eCheck.svg",
          description: "Exporter checks for authenticity and provenance",
        },
        {
          stepTitle: "Step 3",
          icon: "/static/images/home/howItWorks/icons/eDispatch.svg",
          description: "Exporter sends the eCoO to Bank (via email)",
        },
        {
          stepTitle: "Total Time Taken",
          description: "Less Than 1 day",
        },
      ],
      endMessage: "TradeTrust is more than a tool to hasten your exporting processes. Get in touch to find out more!",
    },
  },
  {
    image: "/static/images/home/howItWorks/persona/persona6.png",
    jobTitle: "Cert Issuing/Checking Authority",
    description:
      "This is Sean, he works for Customs Authority, and he is using TradeTrust to issue Certificate of Origin. See how he benefited from using TradeTrust to issue the Certificate of Origin",
    learnMore: {
      title: "Electronic Certificate of Origin",
      thenSteps: [
        {
          stepTitle: "Step 1",
          icon: "/static/images/home/howItWorks/icons/paperDispatch.svg",
          description: "Exporting Country's Cert Issuing Authority issues and dispatches CoO to Exporter's courier",
        },
        {
          stepTitle: "Step 2",
          icon: "/static/images/home/howItWorks/icons/paperTick.svg",
          description: "Exporter uses CoO for various process including sending to Importer for verification",
        },
        {
          stepTitle: "Step 3",
          icon: "/static/images/home/howItWorks/icons/paperReceive.svg",
          description: "Importing Country's Cert Checking Authority receives CoO from Importer (via courier)",
        },
        {
          stepTitle: "Step 4",
          icon: "/static/images/home/howItWorks/icons/paperCheck.svg",
          description: "Importing Country's Cert Checking Authority checks the details of CoO Manually",
        },
      ],
      nowSteps: [
        {
          stepTitle: "Step 1",
          icon: "/static/images/home/howItWorks/icons/eDispatch.svg",
          description: "Exporting Country's Cert Issuing Authority issues and send eCoO to Exporter via email",
        },
        {
          stepTitle: "Step 2",
          icon: "/static/images/home/howItWorks/icons/eDistribute.svg",
          description: "Exporter uses eCoO for various process including sending to Importer for verification",
        },
        {
          stepTitle: "Step 3",
          icon: "/static/images/home/howItWorks/icons/eCheck.svg",
          description:
            "Importing Country's Cert Checking Authority receives eCoO from Importer via email and checks for authenticity and provenance via TradeTrust website",
        },
      ],
      endMessage: "TradeTrust is more than a tool to hasten your exporting processes. Get in touch to find out more!",
    },
  },
  {
    image: "/static/images/home/howItWorks/persona/persona7.png",
    jobTitle: "The Importer",
    description:
      "This is James, he is an importer using TradeTrust to streamline his cargo collection process. See how he has benefited from using TradeTrust.",
    learnMore: {
      title: "Electronic Certificate of Origin",
      startMessage: "Benefits gained by James",
      benefits: [
        {
          benefitTitle: "1",
          icon: "/static/images/home/howItWorks/icons/efficiency.svg",
          description: "Efficiency gain from streamlining of processes",
        },
        {
          benefitTitle: "2",
          icon: "/static/images/home/howItWorks/icons/wallet.svg",
          description: "Reduced cost, faster turnaround and less paperwork",
        },
        {
          benefitTitle: "3",
          icon: "/static/images/home/howItWorks/icons/paperRisk.svg",
          description: "Lower risk of fraud and human error",
        },
        {
          benefitTitle: "4",
          icon: "/static/images/home/howItWorks/icons/eCheck.svg",
          description:
            "Need not subscribe to expensive solutions as eCoO can be verified for free via the TradeTrust website",
        },
      ],
      endMessage: "These TradeTrust benefits are just the tip of the iceberg. Get in touch to find out more!",
    },
  },
  {
    image: "/static/images/home/howItWorks/persona/persona8.png",
    jobTitle: "The Banker",
    description:
      "This is Tanu. She is a banker using TradeTrust to minimise fraud when processing Certificates of Origin in trade financing applications.",
    learnMore: {
      title: "Electronic Certificate of Origin",
      startMessage: "Benefits gained by Tanu",
      benefits: [
        {
          benefitTitle: "1",
          icon: "/static/images/home/howItWorks/icons/speedUp.svg",
          description: "Faster turnaround and less manual paperwork",
        },
        {
          benefitTitle: "2",
          icon: "/static/images/home/howItWorks/icons/paperAuthenticity.svg",
          description: "Lower risk of fraud as eCoO can be verified for its authenticity and provenance",
        },
        {
          benefitTitle: "3",
          icon: "/static/images/home/howItWorks/icons/paperRisk.svg",
          description: "Lower the risk of human error",
        },
        {
          benefitTitle: "4",
          icon: "/static/images/home/howItWorks/icons/paperMoney.svg",
          description: "May be able to offer better trade financing terms to customers due to reduced risk",
        },
      ],
      endMessage: "These TradeTrust benefits are just the tip of the iceberg. Get in touch to find out more!",
    },
  },
];
