/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Html, Head, Main, NextScript} from 'next/document';

const MyDocument = () => {
  //  @todo specify language in HTML?
  return (
    <Html lang="en">
      <Head />
      <body className="font-sans antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <style id="sandpack">{getSandpackCssText_PATCHED()}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function () {
                  function setTheme(newTheme) {
                    window.__theme = newTheme;
                    if (newTheme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else if (newTheme === 'light') {
                      document.documentElement.classList.remove('dark');
                    }
                  }

                  var preferredTheme;
                  try {
                    preferredTheme = localStorage.getItem('theme');
                  } catch (err) { }

                  window.__setPreferredTheme = function(newTheme) {
                    preferredTheme = newTheme;
                    setTheme(newTheme);
                    try {
                      localStorage.setItem('theme', newTheme);
                    } catch (err) { }
                  };

                  var initialTheme = preferredTheme;
                  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

                  if (!initialTheme) {
                    initialTheme = darkQuery.matches ? 'dark' : 'light';
                  }
                  setTheme(initialTheme);

                  darkQuery.addEventListener('change', function (e) {
                    if (!preferredTheme) {
                      setTheme(e.matches ? 'dark' : 'light');
                    }
                  });
                })();
              `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;

const sandpackReactVersion =
  require('@codesandbox/sandpack-react/package.json').version;
if (sandpackReactVersion !== '1.7.2') {
  throw Error('You need to manually regenerate getSandpackCssText_PATCHED.');
}

// HACK(css-in-js): We don't want to use runtime CSS-in-JS, so let's save whatever Stitches injected.
// Unfortunately, Stitches' own CSS SSR output isn't reliable and doesn't include some necessary styles.
// To update this:
//   1. Comment out the disableRuntimeCSSInJS() call in _app.js
//   2. Use the real getSandpackCssText instead of the patched version below
//   3. Open a page that contains a sandbox
//   4. Copy the output of running this in the console:
//     copy(Array.from(document.getElementById('sandpack').sheet.cssRules).map(rule => rule.cssText || "").join("\n"))
//   5. Replace the string below and undo the rest of your changes
// In longer term, we should remove the Stitches dependency somehow.
// import {getSandpackCssText} from '@codesandbox/sandpack-react';

function getSandpackCssText_PATCHED() {
  return `--sxs { --sxs:0 sp-121717251; }
@media  {
  .sp-121717251 { --sp-space-1:4px; --sp-space-2:8px; --sp-space-3:12px; --sp-space-4:16px; --sp-space-5:20px; --sp-space-6:24px; --sp-space-7:28px; --sp-space-8:32px; --sp-space-9:36px; --sp-space-10:40px; --sp-space-11:44px; --sp-border-radius:4px; --sp-layout-height:300px; --sp-layout-headerHeight:40px; --sp-transitions-default:150ms ease; --sp-zIndices-base:1; --sp-zIndices-overlay:2; --sp-zIndices-top:3; --sp-colors-surface1: inherit; --sp-colors-surface2: inherit; --sp-colors-surface3: inherit; --sp-colors-disabled: inherit; --sp-colors-base: inherit; --sp-colors-clickable: inherit; --sp-colors-hover: inherit; --sp-colors-accent: inherit; --sp-colors-error: inherit; --sp-colors-errorSurface: inherit; --sp-colors-warning: inherit; --sp-colors-warningSurface: inherit; --sp-font-body:Optimistic Display, -apple-system, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; --sp-font-mono:Source Code Pro, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace; --sp-font-size:calc(1em - 20%); --sp-font-lineHeight:24px; --sp-syntax-color-plain: inherit; --sp-syntax-color-comment: inherit; --sp-syntax-color-keyword: inherit; --sp-syntax-color-tag: inherit; --sp-syntax-color-punctuation: inherit; --sp-syntax-color-definition: inherit; --sp-syntax-color-property: inherit; --sp-syntax-color-static: inherit; --sp-syntax-color-string: inherit; }
}
--sxs { --sxs:1 sp-k-cESbVh sp-k-iOHdLQ; }
@media  {
  @keyframes sp-k-cESbVh { 
  0% { opacity: 0; transform: translateY(4px); }
  100% { opacity: 1; transform: translateY(0px); }
}
  @keyframes sp-k-iOHdLQ { 
  0% { transform: rotateX(-25.5deg) rotateY(45deg); }
  100% { transform: rotateX(-25.5deg) rotateY(405deg); }
}
}
--sxs { --sxs:2 sp-c-gMfcns sp-c-hfoyCM sp-c-fWymNx sp-c-dVXmCU sp-c-bpmgvy sp-c-kLppIp sp-c-PJLV sp-c-fVPbOs sp-c-dyHYiL sp-c-gGbYbQ sp-c-hWvPKr sp-c-ctabmA sp-c-bNbSGz sp-c-jcgexo sp-c-jkvvao; }
@media  {
  .sp-c-gMfcns svg { margin: auto; }
  .sp-c-hfoyCM { padding: 0 var(--sp-space-1) 0 var(--sp-space-1); border-radius: var(--sp-border-radius); margin-left: var(--sp-space-1); width: var(--sp-space-5); visibility: hidden; }
  .sp-c-hfoyCM svg { width: var(--sp-space-3); height: var(--sp-space-3); display: block; position: relative; top: 1px; }
  .sp-c-fWymNx { margin: 0px; display: block; font-family: var(--sp-font-mono); font-size: var(--sp-font-size); color: var(--sp-syntax-color-plain); line-height: var(--sp-font-lineHeight); }
  .sp-c-dVXmCU { appearance: none; border: 0px; outline: none; display: flex; align-items: center; font-size: inherit; font-family: inherit; background-color: transparent; transition: color var(--sp-transitions-default), background var(--sp-transitions-default); cursor: pointer; color: var(--sp-colors-clickable); }
  .sp-c-dVXmCU:disabled { color: var(--sp-colors-disabled); }
  .sp-c-dVXmCU svg { width: var(--sp-space-4); height: var(--sp-space-4); }
  .sp-c-dVXmCU.sp-c-gMfcns { padding: var(--sp-space-1); width: var(--sp-space-7); height: var(--sp-space-7); display: flex; }
  .sp-c-bpmgvy { transform: translate(-4px, 9px) scale(0.13, 0.13); }
  .sp-c-bpmgvy * { position: absolute; width: 96px; height: 96px; }
  .sp-c-kLppIp { display: flex; flex-direction: column; width: 100%; position: relative; background-color: var(--sp-colors-surface1); transition: flex var(--sp-transitions-default); gap: 1px; }
  .sp-c-kLppIp:has(.sp-stack) { background-color: var(--sp-colors-surface2); }
  .sp-c-fVPbOs { color: initial; font-family: var(--sp-font-body); font-feature-settings: initial; font-kerning: initial; font-optical-sizing: initial; font-palette: initial; font-size: var(--sp-font-size); font-stretch: initial; font-style: initial; font-synthesis: initial; font-variant: initial; font-variation-settings: initial; font-weight: initial; forced-color-adjust: initial; text-orientation: initial; text-rendering: optimizelegibility; -webkit-font-smoothing: subpixel-antialiased; -webkit-locale: initial; -webkit-text-orientation: initial; -webkit-writing-mode: initial; writing-mode: initial; zoom: initial; accent-color: initial; place-content: initial; place-items: initial; place-self: initial; alignment-baseline: initial; animation: initial; app-region: initial; appearance: initial; aspect-ratio: initial; backdrop-filter: initial; backface-visibility: initial; background: initial; background-blend-mode: initial; baseline-shift: initial; block-size: initial; border-block: initial; border: initial; border-radius: initial; border-collapse: initial; border-end-end-radius: initial; border-end-start-radius: initial; border-inline: initial; border-start-end-radius: initial; border-start-start-radius: initial; inset: initial; box-shadow: initial; box-sizing: border-box; break-after: initial; break-before: initial; break-inside: initial; buffered-rendering: initial; caption-side: initial; caret-color: initial; clear: initial; clip: initial; clip-path: initial; clip-rule: initial; color-interpolation: initial; color-interpolation-filters: initial; color-rendering: initial; color-scheme: initial; columns: initial; column-fill: initial; gap: initial; column-rule: initial; column-span: initial; contain: initial; contain-intrinsic-block-size: initial; contain-intrinsic-size: initial; contain-intrinsic-inline-size: initial; container: initial; content: initial; content-visibility: initial; counter-increment: initial; counter-reset: initial; counter-set: initial; cursor: initial; cx: initial; cy: initial; d: initial; display: block; dominant-baseline: initial; empty-cells: initial; fill: initial; fill-opacity: initial; fill-rule: initial; filter: initial; flex: initial; flex-flow: initial; float: initial; flood-color: initial; flood-opacity: initial; grid: initial; grid-area: initial; height: initial; hyphens: initial; image-orientation: initial; image-rendering: initial; inline-size: initial; inset-block: initial; inset-inline: initial; isolation: initial; letter-spacing: initial; lighting-color: initial; line-break: initial; line-height: initial; list-style: initial; margin-block: initial; margin: initial; margin-inline: initial; marker: initial; mask: initial; mask-type: initial; max-block-size: initial; max-height: initial; max-inline-size: initial; max-width: initial; min-block-size: initial; min-height: initial; min-inline-size: initial; min-width: initial; mix-blend-mode: initial; object-fit: initial; object-position: initial; object-view-box: initial; offset: initial; opacity: initial; order: initial; origin-trial-test-property: initial; orphans: initial; outline: initial; outline-offset: initial; overflow-anchor: initial; overflow-clip-margin: initial; overflow-wrap: initial; overflow: initial; overscroll-behavior-block: initial; overscroll-behavior-inline: initial; overscroll-behavior: initial; padding-block: initial; padding: initial; padding-inline: initial; page: initial; page-orientation: initial; page-transition-tag: initial; paint-order: initial; perspective: initial; perspective-origin: initial; pointer-events: initial; position: initial; quotes: initial; r: initial; resize: initial; rotate: initial; ruby-position: initial; rx: initial; ry: initial; scale: initial; scroll-behavior: initial; scroll-margin-block: initial; scroll-margin: initial; scroll-margin-inline: initial; scroll-padding-block: initial; scroll-padding: initial; scroll-padding-inline: initial; scroll-snap-align: initial; scroll-snap-stop: initial; scroll-snap-type: initial; scrollbar-gutter: initial; shape-image-threshold: initial; shape-margin: initial; shape-outside: initial; shape-rendering: initial; size: initial; speak: initial; stop-color: initial; stop-opacity: initial; stroke: initial; stroke-dasharray: initial; stroke-dashoffset: initial; stroke-linecap: initial; stroke-linejoin: initial; stroke-miterlimit: initial; stroke-opacity: initial; stroke-width: initial; tab-size: initial; table-layout: initial; text-align: initial; text-align-last: initial; text-anchor: initial; text-combine-upright: initial; text-decoration: initial; text-decoration-skip-ink: initial; text-emphasis: initial; text-emphasis-position: initial; text-indent: initial; text-overflow: initial; text-shadow: initial; text-size-adjust: initial; text-transform: initial; text-underline-offset: initial; text-underline-position: initial; touch-action: initial; transform: initial; transform-box: initial; transform-origin: initial; transform-style: initial; transition: initial; translate: initial; user-select: initial; vector-effect: initial; vertical-align: initial; visibility: initial; border-spacing: initial; -webkit-box-align: initial; -webkit-box-decoration-break: initial; -webkit-box-direction: initial; -webkit-box-flex: initial; -webkit-box-ordinal-group: initial; -webkit-box-orient: initial; -webkit-box-pack: initial; -webkit-box-reflect: initial; -webkit-highlight: initial; -webkit-hyphenate-character: initial; -webkit-line-break: initial; -webkit-line-clamp: initial; -webkit-mask-box-image: initial; -webkit-mask: initial; -webkit-mask-composite: initial; -webkit-print-color-adjust: initial; -webkit-rtl-ordering: initial; -webkit-ruby-position: initial; -webkit-tap-highlight-color: transparent; -webkit-text-combine: initial; -webkit-text-decorations-in-effect: initial; -webkit-text-fill-color: initial; -webkit-text-security: initial; -webkit-text-stroke: initial; -webkit-user-drag: initial; -webkit-user-modify: initial; white-space: initial; widows: initial; width: initial; will-change: initial; word-break: initial; word-spacing: initial; x: initial; y: initial; z-index: initial; }
  @media screen and (min-resolution: 2dppx) {
  .sp-c-fVPbOs { -webkit-font-smoothing: antialiased; }
}
  .sp-c-fVPbOs * { box-sizing: border-box; }
  .sp-c-fVPbOs .sp-wrapper:focus { outline: 0px; }
  .sp-c-dyHYiL { border-bottom: 1px solid var(--sp-colors-surface2); background: var(--sp-colors-surface1); }
  .sp-c-gGbYbQ { padding: 0 var(--sp-space-2); overflow: auto; display: flex; flex-wrap: nowrap; align-items: stretch; min-height: 40px; margin-bottom: -1px; }
  .sp-c-hWvPKr { padding: 0 var(--sp-space-2); height: var(--sp-layout-headerHeight); white-space: nowrap; }
  .sp-c-hWvPKr:focus { outline: none; }
  .sp-c-hWvPKr:focus-visible { box-shadow: inset 0 0 0 2px var(--sp-colors-accent); }
  .sp-c-ctabmA { border: 1px solid var(--sp-colors-surface2); display: flex; flex-wrap: wrap; align-items: stretch; border-radius: var(--sp-border-radius); overflow: hidden; position: relative; background-color: var(--sp-colors-surface2); gap: 1px; }
  @media print {
}
  @media screen and (max-width: 768px) {
}
  .sp-c-bNbSGz { flex: 1 1 0%; position: relative; overflow: auto; background: var(--sp-colors-surface1); }
  .sp-c-bNbSGz .cm-scroller { padding: var(--sp-space-4) 0; }
  .sp-c-bNbSGz .sp-c-fWymNx { padding: var(--sp-space-4) 0; }
  .sp-c-jcgexo { margin: 0px; outline: none; height: 100%; }
  .sp-c-jcgexo:focus-visible { box-shadow: inset 0 0 0 4px var(--sp-colors-accent); padding-left: var(--sp-space-1); padding-right: var(--sp-space-1); }
  .sp-c-jcgexo:focus-visible .cm-line { padding: 0 var(--sp-space-2); }
  .sp-c-jcgexo:focus-visible .cm-gutter.cm-lineNumbers { padding-left: 0px; padding-right: var(--sp-space-2); }
  .sp-c-jkvvao .sp-syntax-string { color: var(--sp-syntax-color-string); font-style: var(--sp-syntax-fontStyle-string); }
  .sp-c-jkvvao .sp-syntax-plain { color: var(--sp-syntax-color-plain); font-style: var(--sp-syntax-fontStyle-plain); }
  .sp-c-jkvvao .sp-syntax-comment { color: var(--sp-syntax-color-comment); font-style: var(--sp-syntax-fontStyle-comment); }
  .sp-c-jkvvao .sp-syntax-keyword { color: var(--sp-syntax-color-keyword); font-style: var(--sp-syntax-fontStyle-keyword); }
  .sp-c-jkvvao .sp-syntax-definition { color: var(--sp-syntax-color-definition); font-style: var(--sp-syntax-fontStyle-definition); }
  .sp-c-jkvvao .sp-syntax-punctuation { color: var(--sp-syntax-color-punctuation); font-style: var(--sp-syntax-fontStyle-punctuation); }
  .sp-c-jkvvao .sp-syntax-property { color: var(--sp-syntax-color-property); font-style: var(--sp-syntax-fontStyle-property); }
  .sp-c-jkvvao .sp-syntax-tag { color: var(--sp-syntax-color-tag); font-style: var(--sp-syntax-fontStyle-tag); }
  .sp-c-jkvvao .sp-syntax-static { color: var(--sp-syntax-color-static); font-style: var(--sp-syntax-fontStyle-static); }
  .sp-c-kKzdnH { position: absolute; inset: 0px; margin: 0px; overflow: auto; height: 100%; z-index: var(--sp-zIndices-top); }
  .sp-c-flHYPS { background-color: var(--sp-colors-surface1); }
  .sp-c-kkdexE { position: absolute; right: var(--sp-space-2); bottom: var(--sp-space-2); z-index: var(--sp-zIndices-top); width: 32px; height: 32px; border-radius: var(--sp-border-radius); }
  .sp-c-kkdexE .sp-c-bpmgvy { display: block; }
  .sp-c-kkdexE .sp-c-dVXmCU { display: none; }
  .sp-c-kkdexE:hover .sp-c-dVXmCU { display: block; }
  .sp-c-kkdexE:hover .sp-c-bpmgvy { display: none; }
  .sp-c-hPyEbM { animation: 1s linear 0s infinite normal forwards running sp-k-iOHdLQ; transform-style: preserve-3d; transform: rotateX(-25.5deg) rotateY(45deg); }
  .sp-c-hPyEbM * { border: 10px solid var(--sp-colors-clickable); border-radius: 8px; background: var(--sp-colors-surface1); }
  .sp-c-hPyEbM .top { transform: rotateX(90deg) translateZ(44px); transform-origin: 50% 50%; }
  .sp-c-hPyEbM .bottom { transform: rotateX(-90deg) translateZ(44px); transform-origin: 50% 50%; }
  .sp-c-hPyEbM .front { transform: rotateY(0deg) translateZ(44px); transform-origin: 50% 50%; }
  .sp-c-hPyEbM .back { transform: rotateY(-180deg) translateZ(44px); transform-origin: 50% 50%; }
  .sp-c-hPyEbM .left { transform: rotateY(-90deg) translateZ(44px); transform-origin: 50% 50%; }
  .sp-c-hPyEbM .right { transform: rotateY(90deg) translateZ(44px); transform-origin: 50% 50%; }
  .sp-c-eXsQzS { background-color: var(--sp-colors-surface2); border-radius: 99999px; }
  .sp-c-eXsQzS[data-active="true"] { color: var(--sp-colors-surface1); background: var(--sp-colors-accent); }
  .sp-c-eXsQzS:hover:not(:disabled, [data-active="true"]) { background-color: var(--sp-colors-surface3); }
}
--sxs { --sxs:3 sp-c-PJLV-kCOVwI-status-pass sp-c-PJLV-kEzYsr-status-fail sp-c-PJLV-gHAhSA-status-skip sp-c-PJLV-jgnHyR-status-title sp-c-PJLV-iCgxLS-status-run sp-c-PJLV-bnDZSy-status-pass sp-c-PJLV-eYuGwt-status-fail sp-c-fVPbOs-LrWkf-variant-dark; }
@media  {
  .sp-c-PJLV-kCOVwI-status-pass { color: var(--test-pass); }
  .sp-c-PJLV-kEzYsr-status-fail { color: var(--test-fail); }
  .sp-c-PJLV-gHAhSA-status-skip { color: var(--test-skip); }
  .sp-c-PJLV-jgnHyR-status-title { color: var(--test-title); }
  .sp-c-PJLV-iCgxLS-status-run { background: var(--test-run); color: var(--sp-colors-surface1); }
  .sp-c-PJLV-bnDZSy-status-pass { background: var(--test-pass); color: var(--sp-colors-surface1); }
  .sp-c-PJLV-eYuGwt-status-fail { background: var(--test-fail); color: var(--sp-colors-surface1); }
  .sp-c-fVPbOs-LrWkf-variant-dark { color-scheme: dark; }
}
--sxs { --sxs:4; }
@media  {
}
--sxs { --sxs:5; }
@media  {
}
--sxs { --sxs:6; }
@media  {
}
`;
}
