import React from "react";
import { addDecorator } from "@storybook/react";
import "./../src/index.css";

addDecorator((storyFn) => <div className="p-3">{storyFn()}</div>);
