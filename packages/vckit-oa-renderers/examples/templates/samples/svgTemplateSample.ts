import { v2 } from "@govtechsg/open-attestation";

interface PersonalInformation {
  type: string[];
  location: {
    type: string[];
    address: {
      type: string[];
      name: string;
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
}

interface Item {
  type: string[];
  product: {
    type: string[];
    id: string;
    description: string;
    weight: {
      type: string[];
      unitCode: string;
      value: string;
    };
  };
  itemCount: number;
  grossWeight: {
    type: string[];
    value: string;
    unitCode: string;
  };
  lineItemTotalPrice: {
    type: string[];
    price: number;
    priceCurrency: string;
  };
}

export interface SVGTemplateCertificate extends v2.OpenAttestationDocument {
  svgTemplateFile?: string;
  svgTemplate?: string;
  type: string[];
  purchaseOrderNo: string;
  orderDate: string;
  buyer: PersonalInformation;
  seller: PersonalInformation;
  items: Item[];
  totalWeight: object;
  totalOrderAmount: object;
  $template: v2.TemplateObject;
}

export const svgTemplateCertificate: SVGTemplateCertificate = {
  issuers: [
    {
      name: "institute of blockchain"
    }
  ],
  $template: {
    name: "svgTemplate",
    type: v2.TemplateType.EmbeddedRenderer,
    url: "http://localhost:3000"
  },
  svgTemplateFile: "http://localhost:3000/src/templates/samples/purchaseOrderForm.svg",
  svgTemplate: "purchaseOrderForm",
  type: ["PurchaseOrder"],
  purchaseOrderNo: "fe71665a-e7b3-49ba-ac89-82fc2bf1e877",
  orderDate: "2021-02-21",
  buyer: {
    type: ["Organization"],
    location: {
      type: ["Place"],
      address: {
        type: ["PostalAddress"],
        name: "Generic Motors of America",
        streetAddress: "12 Generic Motors Dr",
        addressLocality: "Detroit",
        addressRegion: "Michigain",
        postalCode: "48232-5170",
        addressCountry: "USA"
      }
    }
  },
  seller: {
    type: ["Organization"],
    location: {
      type: ["Place"],
      address: {
        type: ["PostalAddress"],
        name: "Aishi Metal Shinzo Co., Ltd.",
        streetAddress: "1651, Shimonakano, Yoshida",
        addressLocality: "Tsubame-shi",
        addressRegion: "Niigata-ken",
        postalCode: "959-0215",
        addressCountry: "Japan"
      }
    }
  },
  items: [
    {
      type: ["TradeLineItem"],
      product: {
        type: ["Product"],
        id: "https://aishi-metal-shinzo.example.com/products/UNS-S30400-chromium-nickel-stainless-steel-roll",
        description: "UNS S30400 chromium-nickel stainless steel roll",
        weight: {
          type: ["QuantitativeValue"],
          unitCode: "lbs",
          value: "16500"
        }
      },
      itemCount: 5,
      grossWeight: {
        type: ["QuantitativeValue"],
        value: "82500",
        unitCode: "lbs"
      },
      lineItemTotalPrice: {
        type: ["PriceSpecification"],
        price: 5200,
        priceCurrency: "USD"
      }
    },
    {
      type: ["TradeLineItem"],
      product: {
        type: ["Product"],
        id:
          "https://aishi-metal-shinzo.example.com/products/Galvannealed-ASTM-A-653-zinc-iron-alloy-coated-steel-sheet",
        description: "Galvannealed ASTM A-653 zinc-iron alloy-coated steel sheet",
        weight: {
          type: ["QuantitativeValue"],
          value: "12680",
          unitCode: "lbs"
        }
      },
      itemCount: 20,
      grossWeight: {
        type: ["QuantitativeValue"],
        value: "253600",
        unitCode: "lbs"
      },
      lineItemTotalPrice: {
        type: ["PriceSpecification"],
        price: 4400,
        priceCurrency: "USD"
      }
    }
  ],
  totalWeight: {
    type: ["QuantitativeValue"],
    value: "336100",
    unitCode: "lbs"
  },
  totalOrderAmount: {
    type: ["PriceSpecification"],
    price: 9600,
    priceCurrency: "USD"
  }
};
