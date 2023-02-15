/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('./colors');

module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    // Override base screen sizes
    screens: {
      ...defaultTheme.screens,
      betterhover: {raw: '(hover: hover)'},
      xs: '374px',
      '3xl': '1919px',
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0px 0.8px 2px rgba(0, 0, 0, 0.032), 0px 2.7px 6.7px rgba(0, 0, 0, 0.048), 0px 12px 30px rgba(0, 0, 0, 0.08)',
      'lg-dark':
        '0 0 0 1px rgba(255,255,255,.15), 0px 0.8px 2px rgba(0, 0, 0, 0.032), 0px 2.7px 6.7px rgba(0, 0, 0, 0.048), 0px 12px 30px rgba(0, 0, 0, 0.08)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      nav: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,.05)',
      'nav-dark':
        '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255,255,255,.05)',
      inner: 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.05)',
      'inner-border': 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
      none: 'none',
    },
    extend: {
      maxWidth: {
        xs: '21rem',
      },
      outline: {
        blue: ['1px auto ' + colors.link, '3px'],
      },
      opacity: {
        8: '0.08',
      },
      fontFamily: {
        sans: [
          'Optimistic Display',
          '-apple-system',
          ...defaultTheme.fontFamily.sans,
        ],
        mono: ['"Source Code Pro"', ...defaultTheme.fontFamily.mono],
      },
      lineHeight: {
        base: '30px',
        large: '38px',
      },
      fontSize: {
        '6xl': '52px',
        '5xl': '40px',
        '4xl': '32px',
        '3xl': '28px',
        '2xl': '24px',
        xl: '20px',
        lg: '17px',
        base: '15px',
        sm: '13px',
        xs: '11px',
        code: 'calc(1em - 20%)',
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        marquee2: 'marquee2 60s linear infinite',
        'large-marquee': 'marquee 120s linear infinite',
        'large-marquee2': 'marquee2 120s linear infinite',
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        scale: {
          from: {transform: 'scale(0.8)', opacity: '0'},
          '90%': {transform: 'scale(1.05)', opacity: '1'},
          to: {transform: 'scale(1)', opacity: '1'},
        },
        circle: {
          from: {transform: 'scale(0)', strokeWidth: '16px', opacity: '.8'},
          '50%': {transform: 'scale(0.5)', strokeWidth: '16px', opacity: '.8'},
          to: {transform: 'scale(1)', strokeWidth: '0px', opacity: '.25'},
        },
        marquee: {
          '0%': {transform: 'translateX(0%)'},
          '100%': {transform: 'translateX(-200%)'},
        },
        marquee2: {
          '0%': {transform: 'translateX(200%)'},
          '100%': {transform: 'translateX(0%)'},
        },
      },
      colors,
      gridTemplateColumns: {
        'only-content': 'auto',
        'sidebar-content': '20rem auto',
        'sidebar-content-toc': '20rem auto 20rem',
      },
    },
  },
  plugins: [],
};
