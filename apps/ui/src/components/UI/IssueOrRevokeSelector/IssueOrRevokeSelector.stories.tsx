import { FunctionComponent } from "react";
import { IssueOrRevokeSelector } from "./IssueOrRevokeSelector";
import { MemoryRouter } from "react-router";

export default {
  title: "UI/IssueOrRevokeSelector",
  component: IssueOrRevokeSelector,
  parameters: {
    componentSubtitle: "IssueOrRevokeSelector",
  },
};

export const Default: FunctionComponent = () => (
  <MemoryRouter initialEntries={["/forms-selection"]}>
    <div className="mb-4">
      <IssueOrRevokeSelector />
    </div>
  </MemoryRouter>
);
