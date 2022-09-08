import React, { useState } from "react";

import { NavigationBar } from "./NavigationBar";

export default {
  title: "Layout/NavigationBar",
  component: NavigationBar,
};

export const DefaultNavigationBar = (): React.ReactNode => {
  const [toggleNavBar, setToggleNavBar] = useState(false);

  const handleToggleNavNar = () => setToggleNavBar(!toggleNavBar);

  return (
    <NavigationBar toggleNavBar={toggleNavBar} setToggleNavBar={handleToggleNavNar} leftItems={[]} rightItems={[]} />
  );
};
