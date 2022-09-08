import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";

import { EmailForm } from "./EmailForm";

describe("emailForm", () => {
  it("should have hidden input tag with value='contact', for netlify email to work", () => {
    const history = createMemoryHistory();
    const container = render(
      <Router history={history}>
        <EmailForm />
      </Router>
    );
    const inputNetlify = container.getByDisplayValue("contact");

    expect(inputNetlify).not.toBeNull();
    expect(inputNetlify).toHaveAttribute("type", "hidden");
  });

  it("should have required full name field", () => {
    const history = createMemoryHistory();
    const container = render(
      <Router history={history}>
        <EmailForm />
      </Router>
    );
    const field = container.getByPlaceholderText("* Full Name");

    expect(field).not.toBeNull();
    expect(field).toHaveAttribute("required");
  });

  it("should have required email field", () => {
    const history = createMemoryHistory();
    const container = render(
      <Router history={history}>
        <EmailForm />
      </Router>
    );
    const field = container.getByPlaceholderText("* Email Address");

    expect(field).not.toBeNull();
    expect(field).toHaveAttribute("required");
  });

  it("should have required organisation field", () => {
    const history = createMemoryHistory();
    const container = render(
      <Router history={history}>
        <EmailForm />
      </Router>
    );
    const field = container.getByPlaceholderText("* Name of your organisation");

    expect(field).not.toBeNull();
    expect(field).toHaveAttribute("required");
  });

  it("should have message field", () => {
    const history = createMemoryHistory();
    const container = render(
      <Router history={history}>
        <EmailForm />
      </Router>
    );
    const field = container.getByPlaceholderText("Message");

    expect(field).not.toBeNull();
    expect(field).not.toHaveAttribute("required");
  });
});
