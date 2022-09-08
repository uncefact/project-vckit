const merge = require("lodash/merge");
const govTechUIConfig = require("@govtechsg/tradetrust-ui-components/build/tailwind"); //eslint-disable-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

const localConfig = {
  content: [
    `./src/**/*.{ts,tsx,js,jsx}`,
    "./node_modules/@govtechsg/tradetrust-ui-components/src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    backgroundImage: {
      welcome: "url('/static/images/home/welcome/industry.png')",
      // Ensure that welcome-mobile image fits the dimension of the section on mobile
      "welcome-mobile": "url('/static/images/home/welcome/industry-mobile.png')",
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      ubuntu: ["Ubuntu", "sans-serif"],
      "second-font-family": ["Helvetica", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#014b7e",
        "primary-dark": "#003a63",
        error: "#f44336",
        "dark-blue-color": "#014b7e",
        "light-grey-color": "#f5f5f5",
        "black-color": "#121212",
        "blue-color": "#003a63",
        "border-color": "#dadada",
      },
      inset: {
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        "-24": "-6rem",
        "-2/5": "-40%",
        "50%": "50%",
      },
      fontSize: {
        "4.5xl": [
          "2.5rem",
          {
            letterSpacing: "-0.02em",
            lineHeight: "44px",
          },
        ],
      },
      minWidth: {
        46: "11.5rem",
        135: "135px",
        200: "200px",
      },
      maxWidth: {
        12: "3rem",
        46: "11.5rem",
        220: "220px",
      },
      height: {
        140: "35rem",
      },
      minHeight: {
        400: "400px",
        600: "600px",
      },
      maxHeight: {
        0: "0",
        120: "40rem",
        1000: "1000px",
        "9/10": "90vh",
      },
      transitionProperty: {
        height: "max-height",
      },
      boxShadow: {
        default: `0 0 0 8px #f3f4f6`, // try to reuse tw colors if can
        accept: `0 0 0 8px #f5fbf7`, // try to reuse tw colors if can
        warning: `0 0 0 8px #ffe600`, // try to reuse tw colors if can
        invalid: `0 0 0 8px #ff5268`, // try to reuse tw colors if can
        dropdown: `0px 4px 20px rgba(0, 0, 0, 0.15)`, // try to reuse tw colors if can
      },
      cursor: {
        grab: "grab",
        grabbing: "grabbing",
      },
      backgroundPosition: {
        "center-right": "center right",
      },
      backgroundSize: {
        "135%": "135%",
      },
      margin: {
        "-10%": "-10%",
        "85%": "85%",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".backface-visible": {
          backfaceVisibility: "visible",
        },
        ".backface-invisible": {
          backfaceVisibility: "hidden",
        },
      });
    }),
  ],
};

const finalConfig = merge(govTechUIConfig, localConfig); // deep merge

module.exports = finalConfig;
