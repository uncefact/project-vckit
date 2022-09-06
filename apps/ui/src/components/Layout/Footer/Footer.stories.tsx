import React from "react";
import { BrowserRouter } from "react-router-dom";

import { Footer } from "./Footer";

export default {
  title: "Layout/Footer",
  component: Footer,
};

export const DefaultFooter = (): React.ReactNode => {
  return (
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};
