import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { FlowSelectorTypes } from "../../../types";

interface IssueOrRevokeSelectorProps {
  activeType?: FlowSelectorTypes;
}

interface Link {
  type: FlowSelectorTypes;
  to: string;
  label: string;
}

export const IssueOrRevokeSelector: FunctionComponent<IssueOrRevokeSelectorProps> = ({ activeType = "issue" }) => {
  const links = [
    {
      type: "issue",
      label: "Create Document",
      to: "/forms-selection",
    },
    {
      type: "revoke",
      label: "Revoke Document",
      to: "/revoke",
    },
  ] as Link[];

  return (
    <div className="space-x-6 text-lg">
      {links.map((link) => {
        let className = `text-cloud-900`;

        if (link.type == activeType) {
          className += ` font-bold underline`;
        }

        return (
          <NavLink data-testid={`${link.type}-selector`} key={link.to} to={link.to} className={className}>
            {link.label}
          </NavLink>
        );
      })}
    </div>
  );
};
