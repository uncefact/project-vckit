import React, { FunctionComponent } from "react";
import { Settings } from "react-feather";
import { NavigationBar as NavBar, NavigationItem, NAVIGATION_ITEM_TYPE } from "@govtechsg/tradetrust-ui-components";
import { NavLink } from "react-router-dom";
import { VCKIT_WEBSITE } from "../../../appConfig";
import Logo from "../../../assets/images/header_logo.svg";
import { Button, ButtonSize, ButtonVariant } from "../../UI/Button";

import { useAuthContext } from "../../../common/contexts/AuthenticationContext";
import { LoginButton } from "../../../components/Authentication/LoginButton/LoginButton";
import { LogoutButton } from "../../../components/Authentication/LogoutButton/LogoutButton";

const SHOW_MENU_LEFT_ITEMS = false;
const SHOW_SETTINGS = false;
const SETTINGS_ID = "settings";

const LOGIN_ID = "login";
const LOGOUT_ID = "logout";

export const leftNavItems: NavigationItem[] = [
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationLink,
    id: "demo",
    label: "Demo",
    path: "/demo",
    customLink: (
      <NavLink activeClassName="text-cerulean" className="block w-full text-current" to={"/demo"}>
        Demo
      </NavLink>
    ),
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationDropDownList,
    id: "resources",
    label: "Resources",
    path: "",
    dropdownItems: [
      {
        id: "learn",
        label: "Learn",
        path: "/learn",
        customLink: (
          <NavLink activeClassName="text-cerulean" className="block w-full px-4 py-3" to={"/learn"}>
            Learn
          </NavLink>
        ),
      },
      {
        id: "faq",
        label: "FAQ",
        path: "/faq",
        customLink: (
          <NavLink activeClassName="text-cerulean" className="block w-full px-4 py-3" to={"/faq"}>
            FAQ
          </NavLink>
        ),
      },
      {
        id: "eta",
        label: "ETA",
        path: "/eta",
        customLink: (
          <NavLink activeClassName="text-cerulean" className="block w-full px-4 py-3" to={"/eta"}>
            ETA
          </NavLink>
        ),
      },
      {
        id: "guidelines(non-ethereum)",
        label: "Guidelines (Non-Ethereum)",
        path: "/guidelines",
        customLink: (
          <NavLink activeClassName="text-cerulean" className="block w-full px-4 py-3" to={"/guidelines"}>
            Guidelines (Non-Ethereum)
          </NavLink>
        ),
      },
    ],
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationDropDownList,
    id: "news-events",
    label: "News & Events",
    path: "",
    dropdownItems: [
      {
        id: "news",
        label: "News",
        path: "/news",
        customLink: (
          <NavLink activeClassName="text-cerulean" className="block w-full px-4 py-3" to={"/news"}>
            News
          </NavLink>
        ),
      },
      {
        id: "event",
        label: "Event",
        path: "/event",
        customLink: (
          <NavLink activeClassName="text-cerulean" className="block w-full px-4 py-3" to={"/event"}>
            Event
          </NavLink>
        ),
      },
    ],
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationLink,
    id: "contact",
    label: "Contact",
    path: "/contact",
    customLink: (
      <NavLink activeClassName="text-cerulean" className="block w-full text-current" to={"/contact"}>
        Contact
      </NavLink>
    ),
  },
];

export const rightNavItems: NavigationItem[] = [
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationIconButton,
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
    customLink: (
      <NavLink activeClassName="text-cerulean" className="block w-full py-2 text-current" to={"/settings"}>
        <Settings className="stroke-current" />
      </NavLink>
    ),
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
    id: "create-documents",
    label: "Create Doc",
    path: `${VCKIT_WEBSITE}/creator`,
    customLink: (
      <NavLink to={"/creator"} data-testid="navbar-create-doc">
        <Button name="create-doc" variant={ButtonVariant.PRIMARY} size={ButtonSize.LG} className="w-[130px]">
          Create Doc
        </Button>
      </NavLink>
    ),
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
    id: "verify",
    label: "Verify Doc",
    path: `${VCKIT_WEBSITE}/verify`,
    customLink: (
      <NavLink to={"/verify"} data-testid="navbar-verify-doc">
        <Button name="verify-doc" variant={ButtonVariant.PRIMARY} size={ButtonSize.LG} className="w-[130px]">
          Verify Doc
        </Button>
      </NavLink>
    ),
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
    id: "login",
    label: "Login",
    path: "#",
    customLink: <LoginButton variant={ButtonVariant.PRIMARY} size={ButtonSize.LG} className="w-[130px]" />,
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
    id: "logout",
    label: "Logout",
    path: "#",
    customLink: <LogoutButton variant={ButtonVariant.PRIMARY} size={ButtonSize.LG} className="w-[130px]" />,
  },
];

const NavLogo = () => {
  return (
    <NavLink to={"/"}>
      <img className="w-32" alt="Logo" src={Logo} />
    </NavLink>
  );
};

export interface NavigationBarProps {
  toggleNavBar: boolean;
  setToggleNavBar: (toggleNavbar: boolean) => void;
  leftItems: NavigationItem[];
  rightItems: NavigationItem[];
}

export const NavigationBar: FunctionComponent<NavigationBarProps> = (props) => {
  const { isLoggedIn } = useAuthContext();

  const leftItems = props.leftItems.length ? props.leftItems : leftNavItems;
  const rightItems = props.rightItems.length ? props.rightItems : rightNavItems;

  const menuLeftItems = SHOW_MENU_LEFT_ITEMS ? leftItems : [];

  const menuRightItems = rightItems.filter((item: NavigationItem) => {
    if (item.id === LOGIN_ID) {
      return isLoggedIn ? false : true;
    }
    if (item.id === LOGOUT_ID) {
      return isLoggedIn ? true : false;
    }
    return !SHOW_SETTINGS && item.id === SETTINGS_ID ? false : true;
  });

  // TODO Currently we're wrapping GovTech's navbar, which
  // has a number of hardcoded values.
  // Should we require more customization, we'll
  // need to implement our own.
  return (
    <div className="min-h-[65px] pt-3 md:pt-1 bg-light-grey-color" data-testid="navbar">
      <NavBar
        logo={<NavLogo />}
        menuLeft={menuLeftItems}
        menuRight={menuRightItems}
        menuMobile={[...menuLeftItems, ...menuRightItems]}
        setToggleNavBar={props.setToggleNavBar}
        toggleNavBar={props.toggleNavBar}
      />
    </div>
  );
};
