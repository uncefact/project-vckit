import { configure, addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";

configure(require.context("../src", true, /\.stories\.(js|mdx)$/), module);
configure(require.context("../examples", true, /\.stories\.(js|mdx)$/), module);
addDecorator(withKnobs);
