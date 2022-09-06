import { Overlay } from "@govtechsg/tradetrust-ui-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Footer, NavigationBar } from "./components/Layout";

import { Routes, routes } from "./routes";

const AppContainer = (): React.ReactElement => {
  const location = useLocation();
  const [toggleNavBar, setToggleNavBar] = useState(false);

  useEffect(() => {
    setToggleNavBar(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="flex flex-col min-h-full" data-location={location.pathname}>
      <NavigationBar toggleNavBar={toggleNavBar} setToggleNavBar={setToggleNavBar} leftItems={[]} rightItems={[]} />
      <main>
        <Routes routes={routes} />
      </main>
      <Footer />
      <Overlay />
    </div>
  );
};

export default AppContainer;
