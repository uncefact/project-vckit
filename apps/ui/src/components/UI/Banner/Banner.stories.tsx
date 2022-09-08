import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { Banner } from "./Banner";

export default {
  title: "UI/Banner",
  component: Banner,
  parameters: {
    componentSubtitle: "Banners.",
  },
};

export const Default = () => {
  return (
    <Router>
      <Banner
        to="/"
        buttonText="Contact us now"
        title="Want to try creating a verifiable document? You will be surprised how easy it is."
      />
    </Router>
  );
};
