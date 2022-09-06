import React, { FunctionComponent, InputHTMLAttributes } from "react";
import { Button, ButtonSize } from "@govtechsg/tradetrust-ui-components";
import { NavLink } from "react-router-dom";

interface BannerProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  title: string;
  buttonText: string;
  to: string;
}

export const Banner: FunctionComponent<BannerProps> = ({ className, title, buttonText, to }: BannerProps) => {
  return (
    <div className={`${className ? className : ""}`}>
      <div className="container">
        <div className="rounded-xl bg-cerulean bg-cover bg-wave-lines-light">
          <div className="flex flex-wrap items-center px-4 py-6 text-white">
            <div className="px-2 w-full lg:w-2/3 mb-2 lg:mb-0">
              <h3 data-testid="banner-title">{title}</h3>
            </div>
            <div className="px-2 w-auto lg:ml-auto">
              <NavLink to={to}>
                <Button
                  className="bg-tangerine text-white hover:bg-tangerine-600 border-none rounded"
                  size={ButtonSize.LG}
                >
                  <h4>{buttonText}</h4>
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
