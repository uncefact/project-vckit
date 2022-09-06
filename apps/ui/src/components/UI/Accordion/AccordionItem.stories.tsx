import React, { useState } from "react";
import { AccordionItem } from "./AccordionItem";

export default {
  title: "UI/AccordionItem",
  component: AccordionItem,
  parameters: {
    componentSubtitle: "AccordionItem.",
  },
};

export const AccordionItemFaq = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  const index = 1;
  return (
    <AccordionItem
      heading="What is TradeTrust?"
      openIndex={openIndex}
      setOpenIndex={setOpenIndex}
      accordionIndex={index}
    >
      TradeTrust is a digital utility that comprises a set of globally-accepted standards and frameworks that connects
      governments and businesses to a public blockchain to enable trusted interoperability and exchanges of electronic
      trade documents across digital platforms. The four key components of TradeTrust are:
    </AccordionItem>
  );
};

export const AccordionItemDemo = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  return (
    <>
      <AccordionItem
        heading="Exporter Details"
        headingTag="h3"
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        accordionIndex={1}
      >
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
        enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
        qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
        consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
        quaerat voluptatem.
      </AccordionItem>
      <AccordionItem
        heading="Importer Details"
        headingTag="h3"
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        accordionIndex={2}
      >
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
        enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
        qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
        consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
        quaerat voluptatem.
      </AccordionItem>
      <AccordionItem
        heading="Description of Goods"
        headingTag="h3"
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        accordionIndex={3}
      >
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
        enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
        qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
        consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
        quaerat voluptatem.
      </AccordionItem>
    </>
  );
};
