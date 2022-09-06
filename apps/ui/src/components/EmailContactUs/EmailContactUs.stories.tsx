import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { EmailContactUsSuccess, EmailContactUsError } from "./EmailContactUs";
import { ContactUs } from "../../pages/contact";
export default {
  title: "Email/EmailState",
  component: EmailContactUsSuccess,
  parameters: {
    componentSubtitle: "Shown when Email success.",
  },
};

export const Success = () => {
  return (
    <Router>
      <ContactUs>
        <EmailContactUsSuccess />
      </ContactUs>
    </Router>
  );
};

export const Error = () => {
  return (
    <Router>
      <ContactUs>
        <EmailContactUsError />
      </ContactUs>
    </Router>
  );
};
