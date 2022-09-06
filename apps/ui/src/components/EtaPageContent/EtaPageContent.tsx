import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@govtechsg/tradetrust-ui-components";

const SectionMap = () => {
  return (
    <section className="pt-8 pb-16">
      <div className="max-w-3xl mx-auto lg:absolute left-0 right-0">
        <img src="/static/images/eta/map.png" alt="" />
      </div>
      <div className="lg:h-48" />
      <div className="container relative z-10">
        <div className="flex flex-wrap -mx-4 mb-16">
          <div className="w-full lg:w-1/3 px-4 lg:px-8">
            <div className="mb-8">
              <h3 className="text-cerulean">Europe</h3>
              <p>IMDA & MPA&lsquo;s collaboration with Port of Rotterdam on eBL through TradeTrust</p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 px-4 lg:px-8">
            <div className="mb-8">
              <h3 className="text-cerulean-200">Singapore</h3>
              <h5>TradeTrust</h5>
              <ul>
                <li>
                  <p>comprises set of globally-accepted standards and frameworks</p>
                </li>
                <li>
                  <p>enables trusted interoperability of digital trade documents</p>
                </li>
                <li>
                  <p>
                    provides proof of authenticity and provenance of documents and offers title transfer through
                    open-source software
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full lg:w-1/3 px-4 lg:px-8">
            <div className="mb-4">
              <h3 className="text-rose">China</h3>
              <p>
                SG-Shenzhen Smart City Initiative to explore cross-border trade and trade financing using eBLs and
                Letters of Credit
              </p>
            </div>
            <h3 className="text-tangerine">Australia</h3>
            <p>
              Trial of digital verification methods for electronic Certificates of Origin between border agencies and
              businesses
            </p>
          </div>
        </div>
        <div className="flex flex-wrap text-center">
          <div className="w-full mb-4">
            <h4>Ready to learn how TradeTrust can benefit your business?</h4>
          </div>
          <div className="w-full">
            <Link to="/demo">
              <Button className="bg-tangerine text-white hover:bg-tangerine-600 rounded-xl text-2xl px-4">
                Try Our Demo Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionAmendedEta = () => {
  return (
    <section className="bg-white relative z-10">
      <div className="bg-wave-lines-light bg-cover bg-cerulean rounded-lg text-white p-8 text-center lg:absolute left-0 right-0 max-w-4xl mx-auto lg:-translate-y-1/2">
        <h2>The amended ETA supports and complements the government’s trade digitalization initiatives.</h2>
      </div>
    </section>
  );
};

const EblFeature = ({ title, src }: { title: string; src: string }) => {
  return (
    <div className="flex items-center my-4">
      <div className="w-16 mr-4 text-center flex-none">
        <img className="ml-auto" src={src} alt={title} />
      </div>
      <div className="flex-grow">
        <h5 className="uppercase leading-tight">{title}</h5>
      </div>
    </div>
  );
};

const SectionWhyBl = () => {
  return (
    <section className="bg-white pt-8 pb-12 lg:pb-40">
      <div className="container">
        <h1 className="text-center mb-8">Why Do We Need eBLs?</h1>
        <div className="flex flex-wrap">
          <div className="w-2/3 lg:w-1/2 xl:w-2/5 mx-auto px-4">
            <img src="/static/images/eta/why-ebls.png" alt="" />
          </div>
          <div className="w-full lg:w-1/2 xl:w-2/5 mx-auto px-4">
            <div className="flex flex-wrap items-center">
              <div className="w-1/2 mr-auto">
                <EblFeature title="Faster Processing" src="/static/images/eta/time.svg" />
              </div>
              <div className="w-1/2">
                <EblFeature title="Lowered Fraud Risks" src="/static/images/eta/fraud.svg" />
              </div>
            </div>
            <div className="flex flex-wrap items-center">
              <div className="w-1/2 mr-auto">
                <EblFeature title="Cost Saving" src="/static/images/eta/cost.svg" />
              </div>
              <div className="w-1/2">
                <EblFeature title="Faster Processing" src="/static/images/eta/idea.svg" />
              </div>
            </div>
            <div className="flex flex-wrap">
              <ul className="list-disc">
                <li className="mb-8">
                  <p>
                    No additional costs to hold cargo as goods are less likely to arrive at their port of destination
                    before document processing is complete
                  </p>
                </li>
                <li className="mb-8">
                  <p>
                    <b>US$4 billion</b> estimated savings a year if 50% of the container shipping industry adopts eBLs,
                    according to Digital Container Shipping Association
                  </p>
                </li>
                <li>
                  <p>
                    Trade financing banks can obtain collateral security over the eBL, allowing them to obtain
                    regulatory capital relief and pass on cost savings to clients
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhatBl = ({ title, src }: { title: string; src: string }) => {
  return (
    <div className="w-full lg:w-1/3 px-4 mb-4 lg:mb-0">
      <div className="h-full rounded-lg bg-cerulean text-white py-4 px-16">
        <img className="mx-auto mb-8" src={src} alt={title} />
        <h5>{title}</h5>
      </div>
    </div>
  );
};

const SectionWhatBl = () => {
  return (
    <section className="py-8 text-center">
      <div className="container">
        <div className="max-w-3xl mx-auto mb-8">
          <h1>What Is The Bill of Lading?</h1>
          <h5>
            A Bill of Lading is a transport document and a document of title over goods in transit, it is also a key
            document for international trade
          </h5>
        </div>
        <div className="flex flex-wrap -mx-4 mb-8">
          <WhatBl
            title="Seller engages Carrier to deliver cargo and will receive a Bill of Lading (BL)"
            src="/static/images/eta/ship.svg"
          />
          <WhatBl title="Seller releases BL to Buyer upon payment" src="/static/images/eta/bl.svg" />
          <WhatBl
            title="Buyer can only collect the goods when they produce the original BL"
            src="/static/images/eta/goods.svg"
          />
        </div>
        <div className="max-w-4xl mx-auto">
          <p>
            Possession of the original BL is of crucial importance. Previously, usage of electronic versions of BLs had
            been difficult due to technological and legal challenges in establishing what is the &quot;original
            document&quot; and &quot;who possesses it&quot;
          </p>
        </div>
      </div>
    </section>
  );
};

const SectionWhatEta = () => {
  return (
    <section className="py-8 bg-white text-center">
      <div className="container">
        <h1>What is ETA?</h1>
        <div className="flex flex-wrap max-w-5xl mx-auto">
          <div className="w-full lg:w-2/5 mx-auto">
            <div className="py-4 lg:py-8">
              <img className="mx-auto" src="/static/images/eta/ecommerce.svg" alt="" />
              <h5>
                The Electronic Transactions Act (ETA) facilitates the use of e-commerce and e-transactions by giving
                e-contracts and e-signatures the same status as written contracts and signatures
              </h5>
            </div>
          </div>
          <div className="w-full lg:w-2/5 mx-auto">
            <div className="py-4 lg:py-8">
              <img className="mx-auto" src="/static/images/eta/document.svg" alt="" />
              <h5>
                Recent ETA amendments enable the creation and use of Electronic Transferable Records (ETRs), such as
                electrotonic Bills of Lading (eBLs)
              </h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionEta = () => {
  return (
    <section className="py-8 lg:py-12 bg-cerulean-50">
      <div className="container">
        <div className="flex flex-wrap lg:flex-nowrap items-center">
          <div className="w-full lg:w-1/3 xxl:w-1/4 lg:flex-none">
            <h1 className="leading-tight mb-4 lg:mb-8">Electronic Transactions Act (ETA)</h1>
            <h4 className="leading-tight uppercase">
              Enabling digitalisation of trade documents: convenience & savings for businesses
            </h4>
          </div>
          <div className="w-full lg:flex-grow">
            <img src="/static/images/eta/eta-bg.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const EtaPageContent: FunctionComponent = () => {
  return (
    <>
      <SectionEta />
      <SectionWhatEta />
      <SectionWhatBl />
      <SectionWhyBl />
      <SectionAmendedEta />
      <SectionMap />
    </>
  );
};
