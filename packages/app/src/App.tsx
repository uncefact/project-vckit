import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedTitleV2
} from "@refinedev/mui";

import { CssBaseline, GlobalStyles } from "@mui/material";
import { liveProvider } from "@refinedev/appwrite";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";

import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { appwriteClient } from "utility";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";

import {
  ChatBubbleOutline,
  PeopleAltOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";

import {  
  // CredentialCreate,
  // CredentialEdit,
  CredentialList,
  // CredentialShow,
  Home,
  // IdentifierCreate,
  // IdentifierEdit,
  IdentifierList, 
  // IdentifierShow,
} from "pages";

import { MuiInferencer } from "@refinedev/inferencer/mui";
import { DemoBanner } from "./components/demo-banner"

import { dataProvider as veramoDataProvider } from "veramoDataProvider";

const vckitLogo = `
      <svg
        width="512"
        height="512"
        viewBox="0 0 135.46667 135.46667"
        version="1.1"
        id="svg9164"
        xmlns="http://www.w3.org/2000/svg">
        <defs
          id="defs9161" />
        <g
          id="layer1">
        <circle
            style="fill:#4389c8;fill-opacity:1;stroke:#4389c8;stroke-width:0.176883;stroke-opacity:1"
            id="path5282"
            cx="29.495333"
            cy="31.966539"
            r="7.4134717" />
        <circle
            style="fill:#4389c8;fill-opacity:1;stroke:#4389c8;stroke-width:0.176883;stroke-opacity:1"
            id="path5282-3"
            cx="80.86937"
            cy="25.723619"
            r="7.4134717" />
        <circle
            style="fill:#4389c8;fill-opacity:1;stroke:#4389c8;stroke-width:0.176883;stroke-opacity:1"
            id="path5282-3-2"
            cx="95.046005"
            cy="96.086563"
            r="7.4134717" />
        <circle
            style="fill:#4389c8;fill-opacity:1;stroke:#4389c8;stroke-width:0.176883;stroke-opacity:1"
            id="path5282-2"
            cx="30.145647"
            cy="97.127029"
            r="7.4134717" />
        <circle
            style="fill:#4389c8;fill-opacity:1;stroke:#4389c8;stroke-width:0.176883;stroke-opacity:1"
            id="path5282-6"
            cx="109.74287"
            cy="110.39323"
            r="7.4134717" />
        <circle
            style="fill:none;fill-opacity:1;stroke:#4389c8;stroke-width:5.29167;stroke-dasharray:none;stroke-opacity:1"
            id="path5322"
            cx="67.733231"
            cy="67.733276"
            r="25.255697" />
        <path
            style="fill:none;fill-opacity:1;stroke:#4389c8;stroke-width:2.67413;stroke-dasharray:none;stroke-opacity:1"
            d="m 32.876922,35.478176 16.2576,14.56682"
            id="path6126" />
        <path
            style="fill:none;fill-opacity:1;stroke:#4389c8;stroke-width:2.67413;stroke-dasharray:none;stroke-opacity:1"
            d="m 78.398232,32.096596 -3.51164,10.92512"
            id="path6128" />
        <path
            style="fill:none;fill-opacity:1;stroke:#4389c8;stroke-width:2.67413;stroke-dasharray:none;stroke-opacity:1"
            d="m 34.391292,92.090446 11.92826,-9.69607"
            id="path6130" />
        <path
            style="fill:none;fill-opacity:1;stroke:#4389c8;stroke-width:2.67413;stroke-dasharray:none;stroke-opacity:1"
            d="M 110.3932,111.17362 85.031332,86.592106 v 0"
            id="path6132" />
        <path
            style="fill:none;fill-opacity:1;stroke:#4389c8;stroke-width:6.68533;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1"
            d="m 55.242192,70.292876 9.23432,8.19384 v 0"
            id="path6134" />
        <path
            style="fill:none;fill-opacity:1;stroke:#4389c8;stroke-width:6.68533;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1"
            d="m 64.721022,78.153756 17.2981,-19.24901"
            id="path6136" />
        <circle
            style="fill:#4389c8;fill-opacity:1;stroke:#4389c8;stroke-width:0.176883;stroke-opacity:1"
            id="path5282-5"
            cx="26.633991"
            cy="73.325912"
            r="7.4134717" />
        <path
            style="fill:none;fill-opacity:1;stroke:#4389c8;stroke-width:2.67413;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1"
            d="m 26.373872,73.195836 4.16195,24.19133"
            id="path6160" />
        </g>
        </svg>
        `
function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <DemoBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={{
                agent: veramoDataProvider(),
                default: veramoDataProvider(),
              }}
              liveProvider={liveProvider(appwriteClient, {
                databaseId: "database",
              })}
              authProvider={authProvider}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: "identifiers",
                  list: '/identifiers',
                  show: '/identifiers/show/:id',
                  create: '/identifiers/create',
                  edit: '/identifiers/edit/:id',
                  icon: <PeopleAltOutlined />,
                  meta: {
                    dataProviderName: "agent",
                  },
                },
                {
                  name: "credentials",
                  list: '/credentials',
                  show: '/credentials/show/:id',
                  create: '/credentials/create',
                  edit: '/credentials/edit/:id',
                  icon: <VerifiedUserOutlined />,
                  meta: {
                    dataProviderName: "agent",
                  },
                },
                {
                  name: "messages",
                  list: '/messages',
                  show: '/messages/show/:id',
                  create: '/messages/create',
                  edit: '/messages/edit/:id',
                  icon: <ChatBubbleOutline />,
                  meta: {
                    dataProviderName: "agent",
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2 Title={({ collapsed }) => (
                        <ThemedTitleV2
                          collapsed={collapsed}
                          text="vc-kit"
                          icon={vckitLogo}
                        />
                      )} Header={() => <Header isSticky={true} />}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="blog_posts" />}
                  />
                  <Route
                    index
                    element={<Home/>}
                  />
                  <Route path="/identifiers">
                    <Route index element={<IdentifierList />} />
                    {/* <Route path="create" element={<IdentifierCreate />} /> */}
                    {/* <Route path="edit/:id" element={<MuiInferencer />} /> */}
                    <Route path="show/:id" element={<MuiInferencer />} />
                  </Route>
                  <Route path="/credentials">
                    <Route index element={<CredentialList />} />
                    {/* <Route path="create" element={<CredentialCreate />} /> */}
                    {/* <Route path="edit/:id" element={<MuiInferencer />} /> */}
                    <Route path="show/:id" element={<MuiInferencer />} />
                  </Route>
                  {/* <Route path="/activity">
                    <Route index element={<Activity />} />
                    <Route path="create" element={<CategoryCreate />} />
                    <Route path="edit/:id" element={<CategoryEdit />} />
                    <Route path="show/:id" element={<CategoryShow />} />
                  </Route> */}
                  {/* <Route path="/requests">
                    <Route index element={<Requests />} />
                    <Route path="create" element={<CategoryCreate />} />
                    <Route path="edit/:id" element={<CategoryEdit />} />
                    <Route path="show/:id" element={<CategoryShow />} />
                  </Route> */}
                  <Route path="/messages">
                    <Route index element={<MuiInferencer />} />
                    {/* <Route path="create" element={<MuiInferencer />} /> */}
                    {/* <Route path="edit/:id" element={<MuiInferencer />} /> */}
                    <Route path="show/:id" element={<MuiInferencer />} />
                  </Route>
                  {/* <Route path="/profile">
                    <Route index element={<MyProfile />} />
                    <Route path="create" element={<CategoryCreate />} />
                    <Route path="edit/:id" element={<CategoryEdit />} />
                    <Route path="show/:id" element={<CategoryShow />} />
                  </Route> */}
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        formProps={{
                          defaultValues: {
                            email: "demo@refine.dev",
                            password: "demodemo",
                          },
                        }}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={<AuthPage type="register" />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<AuthPage type="forgotPassword" />}
                  />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
