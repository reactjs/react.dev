// import {trackCustomEvent} from 'gatsby-plugin-google-analytics';

declare module 'gatsby-plugin-google-analytics' {
  declare module.exports: {
    trackCustomEvent: (...params: any) => void,
  };
}
