const THEME_STORAGE_KEY = "theme";
const COLOR_SCHEME_KEY = "colorScheme";
const DIM_THEME = "dim";
const DIM_STYLE_ID = "x-dim-theme-style";
const DIM_STYLE_CSS = `
  :root {
    --color-bg-primary: #15202b;
    --color-bg-secondary: #192734;
    --color-bg-tertiary: #22303c;
    --color-text-primary: #e7e9ea;
    --color-text-secondary: #8b98a5;
    --color-border-default: #2f3336;
    --color-link-primary: #1d9bf0;
  }

  html, body {
    background-color: #15202b !important;
    color: #e7e9ea !important;
  }

  a {
    color: #1d9bf0 !important;
  }

  [role="navigation"],
  [role="banner"],
  [role="region"],
  [role="main"],
  header, nav, main, section, aside {
    background-color: #15202b !important;
    color: #e7e9ea !important;
  }

  .css-175oi2r.r-kemksi.r-184en5c,
  .css-175oi2r.r-1awozwy.r-aqfbo4.r-kemksi.r-18u37iz.r-1h3ijdo.r-6gpygo.r-15ysp7h.r-1xcajam.r-ipm5af.r-136ojw6.r-1hycxz,
  .css-175oi2r.r-kemksi.r-1kqtdi0.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x {
    background-color: #15202b !important;
    color: #e7e9ea !important;
  }

  .css-175oi2r.r-1awozwy.r-aqfbo4.r-kemksi.r-18u37iz.r-1h3ijdo.r-6gpygo.r-15ysp7h.r-1xcajam.r-ipm5af.r-136ojw6.r-1hycxz,
  .css-175oi2r.r-1wbh5a2,
  .css-175oi2r.r-1wbh5a2 input,
  .css-175oi2r.r-1wbh5a2 textarea {
    background-color: #15202b !important;
    color: #e7e9ea !important;
  }

  .css-175oi2r.r-aqfbo4.r-gtdqiz.r-1gn8etr.r-4zbufd.r-1g40b8q {
    background-color: #15202b !important;
    color: #e7e9ea !important;
  }

  #react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-kemksi.r-1kqtdi0.r-1ua6aaf.r-th6na.r-1phboty.r-16y2uox.r-184en5c.r-1abdc3e.r-1lg4w6u.r-f8sm7e.r-13qz1uu.r-1ye8kvj > div > div.css-175oi2r.r-aqfbo4.r-gtdqiz.r-1gn8etr.r-4zbufd.r-1g40b8q > div:nth-child(1) > div > div > div > div > div > div.css-175oi2r.r-1pz39u2.r-1777fci.r-15ysp7h.r-obd0qt.r-s8bhmr,
  #react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-kemksi.r-1kqtdi0.r-1ua6aaf.r-th6na.r-1phboty.r-16y2uox.r-184en5c.r-1abdc3e.r-1lg4w6u.r-f8sm7e.r-13qz1uu.r-1ye8kvj > div > div.css-175oi2r.r-aqfbo4.r-gtdqiz.r-1gn8etr.r-4zbufd.r-1g40b8q > div:nth-child(1) > div > div > div > div > div > div.css-175oi2r.r-1pz39u2.r-1777fci.r-15ysp7h.r-1habvwh.r-s8bhmr {
    background-color: #15202b !important;
    color: #e7e9ea !important;
  }

  article, [data-testid="tweet"], [data-testid="cellInnerDiv"] {
    background-color: #15202b !important;
  }

  [data-testid="primaryColumn"],
  [data-testid="sidebarColumn"] {
    background-color: #15202b !important;
  }

  * {
    border-color: #2f3336 !important;
  }
`;

const isXHost = () =>
  location.hostname.endsWith("x.com") || location.hostname.endsWith("twitter.com");

const ensureDimStyles = () => {
  if (document.getElementById(DIM_STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = DIM_STYLE_ID;
  style.textContent = DIM_STYLE_CSS;
  document.documentElement.appendChild(style);
};

const forceDimTheme = () => {
  if (!isXHost()) {
    return;
  }

  const root = document.documentElement;
  if (!root) {
    return;
  }

  ensureDimStyles();

  const needsThemeUpdate = root.getAttribute("data-theme") !== DIM_THEME;
  const needsColorModeUpdate = root.getAttribute("data-color-mode") !== "dark";
  const needsSchemeUpdate = root.style.colorScheme !== "dark";
  const needsUpdate = needsThemeUpdate || needsColorModeUpdate || needsSchemeUpdate;
  if (!needsUpdate) {
    return;
  }

  try {
    if (localStorage.getItem(THEME_STORAGE_KEY) !== DIM_THEME) {
      localStorage.setItem(THEME_STORAGE_KEY, DIM_THEME);
    }
    if (localStorage.getItem(COLOR_SCHEME_KEY) !== DIM_THEME) {
      localStorage.setItem(COLOR_SCHEME_KEY, DIM_THEME);
    }
  } catch {
    // No hace nada
  }

  if (needsThemeUpdate) {
    root.setAttribute("data-theme", DIM_THEME);
  }
  if (needsColorModeUpdate) {
    root.setAttribute("data-color-mode", "dark");
  }
  if (needsSchemeUpdate) {
    root.style.colorScheme = "dark";
  }
};

const observeThemeChanges = () => {
  const observer = new MutationObserver(() => {
    forceDimTheme();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-color-mode"]
  });
};

forceDimTheme();

if (document.documentElement) {
  observeThemeChanges();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    forceDimTheme();
    observeThemeChanges();
  });
}
