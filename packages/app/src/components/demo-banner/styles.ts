export const CSSRules = [
  `
  .banner {
      display: flex;
      @media (max-width: 1000px) {
          display: none;
      }
  }`,
  `
  .banner::before,
  .banner::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
  }
  `,
  `
  @keyframes bgpos {
      0% {
          background-position: 0 0;
      }

      100% {
          background-position: -200% 0;
      }
  }
  `,
  `
  .gh-link, .gh-link:hover, .gh-link:active, .gh-link:visited, .gh-link:focus {
      text-decoration: none;
      z-index: 9;
  }
  `,
];