import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import FooterLogo from "../../../assets/images/footer_logo.png";
import { COPYRIGHT_TEXT, COPYRIGHT_YEAR, FOOTER_LINKS } from "../../../appConfig";

interface IFooterItem {
  text: string;
  href?: string;
}

const FooterItem = ({ text, href = "#" }: IFooterItem) => {
  return (
    <li data-testid={`footer:item:${text}`} className="md:inline-block">
      <Link
        data-testid={`footer:item:${text}:link`}
        className="block hover:underline hover:text-dark-blue-color text-lg text-black-color py-1 px-4"
        to={href}
      >
        {text}
      </Link>
    </li>
  );
};

export interface IFooter {
  name?: string;
}

export const Footer: React.FunctionComponent<IFooter> = ({ name }) => {
  return (
    <BrowserRouter>
      <footer
        data-testid={`footer:${name || "default"}`}
        className="text-center border-t border-solid border-border-color pt-8 md:pt-16"
      >
        <div>
          <img className="m-auto" src={FooterLogo} alt="Logo" />
        </div>
        <div className="my-11 md:mt-9 md:mb-16">
          <ul className="p-0 m-0 list-none">
            {FOOTER_LINKS.map((item: IFooterItem) => (
              <FooterItem key={item.text} {...item} />
            ))}
          </ul>
        </div>
        <div className="bg-light-grey-color p-5">
          <p className="text-sm m-0 font-second-font-family">
            {COPYRIGHT_TEXT} &copy; {COPYRIGHT_YEAR}
          </p>
        </div>
      </footer>
    </BrowserRouter>
  );
};
