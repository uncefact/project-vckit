import React from "react";
import { EmailSuccessPage } from "./pages/emailSuccess";
import { EmailErrorPage } from "./pages/emailError";
import { FaqPage } from "./pages/faq";
import { EtaPage } from "./pages/eta";
import VerifyPage from "./pages/verify";
import { HomePage } from "./pages/home";
import { NewsPage } from "./pages/news";
import { NewsPageDetail } from "./pages/newsDetail";
import { LearnPage } from "./pages/learn";
import { SettingsAddressBookPage, SettingsAddressResolverPage, SettingsPage } from "./pages/settings";
import { ViewerPage } from "./pages/viewer";
import { ContactPage } from "./pages/contact";
import { EventPage } from "./pages/event";
import { EventPageDetail } from "./pages/event/eventDetail";
import { PrivateRoute } from "./components/PrivateRoute";
import { Route, Switch } from "react-router-dom";
import { DemoPage } from "./pages/demo";
import { DemoVerifyPage } from "./pages/demoVerify";
import { DemoCreatePage } from "./pages/demoCreate";
import { PageNotFound } from "./pages/pageNotFound";
import { Guidelines } from "./pages/guidelines";
import { HomeContainer } from "./components/Home";
import { FormSelectionContainer } from "./components/FormSelectionContainer";
import { DynamicFormContainer } from "./components/DynamicFormContainer";
import { PublishContainer } from "./components/PublishContainer";
import { RevokeContainer } from "./components/RevokeContainer";

const renderViewer = (): React.ReactElement => <ViewerPage />;
const renderMagicViewer = (): React.ReactElement => <ViewerPage isMagicDemo />;
export const routes: RouteInterface[] = [
  { path: "/", exact: true, component: HomePage },
  { path: "/verify", exact: true, component: VerifyPage },
  { path: "/viewer", exact: true, render: renderViewer },
  { path: "/demo", exact: true, component: DemoPage },
  {
    path: "/demo/create",
    exact: true,
    component: DemoCreatePage,
    privateRoute: true,
  },
  { path: "/demo/verify", exact: true, component: DemoVerifyPage, privateRoute: true },
  {
    path: "/demo/viewer",
    exact: true,
    render: renderMagicViewer,
    privateRoute: true,
  },
  { path: "/faq", exact: true, component: FaqPage },
  { path: "/eta", exact: true, component: EtaPage },
  { path: "/settings", exact: true, component: SettingsPage },
  { path: "/settings/address-resolver", exact: true, component: SettingsAddressResolverPage },
  { path: "/settings/address-book", exact: true, component: SettingsAddressBookPage },
  { path: "/email/success", exact: true, component: EmailSuccessPage },
  { path: "/email/error", exact: true, component: EmailErrorPage },
  { path: "/news", exact: true, component: NewsPage },
  { path: "/news/:slug", exact: true, component: NewsPageDetail },
  { path: "/learn", exact: true, component: LearnPage },
  { path: "/event", exact: true, component: EventPage },
  { path: "/event/:slug", exact: true, component: EventPageDetail },
  { path: "/contact", exact: true, component: ContactPage },
  { path: "/guidelines", exact: true, component: Guidelines },

  // Document-Creator Routes
  { path: "/creator", exact: true, component: HomeContainer },
  { path: "/forms-selection", exact: true, component: FormSelectionContainer },
  { path: "/form", exact: true, component: DynamicFormContainer },
  { path: "/publish", exact: true, component: PublishContainer },
  { path: "/revoke", exact: true, component: RevokeContainer },

  // TradeTrust also has settings route which contains address book and resolver
  // We currently have no use for them.

  { path: "*", component: PageNotFound },
];
export interface RouteInterface {
  path: string;
  exact?: boolean;
  component?: React.FunctionComponent;
  render?: () => JSX.Element;
  privateRoute?: boolean;
}
interface RouteProps {
  routes: RouteInterface[];
}

const routeMapper = (route: RouteInterface, id: number) => {
  const { privateRoute } = route;
  return privateRoute ? <PrivateRoute key={id} {...route} /> : <Route key={id} {...route} />;
};

export const Routes = ({ routes: routeItems }: RouteProps): React.ReactElement => {
  return <Switch>{routeItems.map(routeMapper)}</Switch>;
};
