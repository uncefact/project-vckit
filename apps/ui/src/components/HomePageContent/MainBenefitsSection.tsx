import React, { FunctionComponent } from "react";
import { APP_NAME } from "../../appConfig";

const backgroundStyling = {
  backgroundSize: "1920px auto",
  backgroundPosition: "center 160px",
};

interface MainBenefitsProps {
  details: MainBenefits;
  id: number;
}

type MainBenefits = {
  image: string;
  title: string;
  description: string[];
};

const mainBenefits: MainBenefits[] = [
  {
    image: "/static/images/home/mainBenefits/secure.svg",
    title: "Legal certainty for electronic Transferable Documents",
    description: [
      "Singapore’s  Electronic Transactions Act (ETA) amendments enable the creation and use of electronic Bills of Lading (eBLs) that are legally equivalent to paper-based Bills of Lading.",
    ],
  },
  {
    image: "/static/images/home/mainBenefits/reduce.svg",
    title: "Increase efficiency, lower cost and lower risk of fraud",
    description: [
      "Risk of fraud is mitigated through the use of DLT technology to verify the authenticity and provenance of the trade documents.",
      "US$4 billion savings annually if half of today’s shipping lines adopt eBLs – according to the Digital Container Shipping Association (DSCA).",
    ],
  },
  {
    image: "/static/images/home/mainBenefits/trade.svg",
    title: "Support innovative service offerings",
    description: [
      "Aid the convergence of physical, financial and document chains making automation of key processes possible.",
    ],
  },
];

const MainBenefitsElement: React.FunctionComponent<MainBenefitsProps> = ({ details, id }) => {
  const offsetAlignment = (): string => {
    switch (id) {
      case 0:
        return "lg:mt-40 xl:mt-44 2xl:mt-52";
      case 1:
        return "lg:mt-8 xl:mt-8 2xl:mt-8";
      case 2:
        return "lg:mt-40 xl:mt-52 2xl:mt-64";
      default:
        return "";
    }
  };

  return (
    <div className={`px-0 lg:px-8 xl:px-12 2xl:px-24 lg:w-4/12 mt-12 ${offsetAlignment()}`}>
      <img className="mx-auto" src={details.image} alt="mainBenefitsIcon" />
      <h4 className="font-ubuntu font-normal text-center mb-8 lg:text-left lg:text-3xl" data-testid="benefit-title">
        {details.title}
      </h4>
      <ul className="list-disc">
        {details.description.map((description, index) => (
          <li key={index} className="mb-4">
            <p className="text-base">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const MainBenefitsSection: FunctionComponent = () => {
  return (
    <section id="main-benefits" className="bg-white text-gray-700 py-16">
      <div className="bg-no-repeat lg:bg-single-wave" style={backgroundStyling}>
        <div className="container">
          <div className="text-center">
            <h1 className="font-ubuntu text-cloud leading-none text-4xl lg:text-5xl">Main Benefits</h1>
            <h2 className="font-roboto mt-4 leading-6 text-xl lg:text-xl">
              {APP_NAME} can bring benefits to the trade, finance and logistics community:
            </h2>
          </div>
          <div className="flex flex-wrap lg:justify-around">
            {mainBenefits.map((details, index) => (
              <MainBenefitsElement key={index} details={details} id={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
