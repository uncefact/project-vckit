declare module "tailwindcss/resolveConfig";

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.md";

declare global {
  interface Window {
    ethereum: Ethereum;
    web3: {
      currentProvider: providers.Web3Provider;
    };
  }
}

declare module "*.svg" {
  export const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  const src: string;
  export default src;
}

declare module "*.png" {
  const value: any;
  export = value;
}
