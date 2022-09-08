const IS_LOCAL = process.env.IS_LOCAL || process.env.NODE_ENV === "test";

if ((!IS_LOCAL && !process.env.VCKIT_DOMAIN) || (!IS_LOCAL && !process.env.VCKIT_API_DOMAIN)) {
  throw Error(`Missing one or more of the required environment variables: VCKIT_DOMAIN, VCKIT_API_DOMAIN"`);
}

if (!process.env.CONFIG_FILE_ID) {
  throw Error(`Missing required environment variable: CONFIG_FILE_ID"`);
}

const PROTOCOL = IS_LOCAL ? "http" : "https";

const VCKIT_DOMAIN = IS_LOCAL ? "localhost:3000" : process.env.VCKIT_DOMAIN;

const VCKIT_WEBSITE = `${PROTOCOL}://${VCKIT_DOMAIN}`;

const VCKIT_API_DOMAIN = IS_LOCAL ? "localhost:5010/dev" : process.env.VCKIT_API_DOMAIN;

const VCKIT_API = `${PROTOCOL}://${VCKIT_API_DOMAIN}`;

const CONFIG_FILE_ROUTE = "config-file";

const CONFIG_FILE_ID = process.env.CONFIG_FILE_ID;

const APP_NAME = "";

const SHORT_APP_NAME = "";

const DEFAULT_RENDERER = "";

const FAVICON_PATH = "/static/images/favicon/favicon.png";

const COPYRIGHT_TEXT = "";

const COPYRIGHT_YEAR = "";

const FOOTER_LINKS = [
  {
    text: "Who we are",
    href: "#",
  },
  {
    text: "Contact us",
    href: "#",
  },
];

module.exports = {
  PROTOCOL,
  VCKIT_DOMAIN,
  VCKIT_WEBSITE,
  VCKIT_API,
  CONFIG_FILE_ROUTE,
  CONFIG_FILE_ID,
  APP_NAME,
  SHORT_APP_NAME,
  DEFAULT_RENDERER,
  FAVICON_PATH,
  COPYRIGHT_TEXT,
  COPYRIGHT_YEAR,
  FOOTER_LINKS,
};
