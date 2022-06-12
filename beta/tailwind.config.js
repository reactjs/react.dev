/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const plugin = require('tailwindcss/plugin');

const RTLUtils = {
  '[dir="rtl"] .text-left': {
    'text-align': 'right',
  },
  '[dir="ltr"] .text-left': {
    'text-align': 'left',
  },

  '[dir="rtl"] .text-right': {
    'text-align': 'left',
  },
  '[dir="ltr"] .text-right': {
    'text-align': 'right',
  },

  '[dir="rtl"] .-rotate-90': {
    '--tw-rotate': '90deg',
  },
  '[dir="ltr"] .-rotate-90': {
    '--tw-rotate': '-90deg',
  },
  '[dir="rtl"] .rotate-90': {
    '--tw-rotate': '-90deg',
  },
  '[dir="ltr"] .rotate-90': {
    '--tw-rotate': '90deg',
  },
};

const generatePaddingUtils = (spacing) => {
  const spacingUtils = [{}, {}, {}, {}, {}];
  for (const psize in spacing) {
    let size = psize;
    if (size.includes('.')) size = psize.replace('.', `\\.`);

    if (size.toString() !== 'px') {
      spacingUtils[0][`[dir='rtl'] .pr-${size}`] = {
        'padding-left': spacing[psize],
      };
      spacingUtils[0][`[dir='rtl'] .-pr-${size}`] = {
        'padding-left': '-' + spacing[psize],
      };

      spacingUtils[0][`[dir='rtl'] .pl-${size}`] = {
        'padding-right': spacing[psize],
      };
      spacingUtils[0][`[dir='rtl'] .-pl-${size}`] = {
        'padding-right': '-' + spacing[psize],
      };

      spacingUtils[0][`[dir='ltr'] .pr-${size}`] = {
        'padding-right': spacing[psize],
      };
      spacingUtils[0][`[dir='ltr'] .-pr-${size}`] = {
        'padding-right': '-' + spacing[psize],
      };

      spacingUtils[0][`[dir='ltr'] .pl-${size}`] = {
        'padding-left': spacing[psize],
      };
      spacingUtils[0][`[dir='ltr'] .-pl-${size}`] = {
        'padding-left': '-' + spacing[psize],
      };

      spacingUtils[1][`.p-${size}`] = {padding: spacing[psize]};
      spacingUtils[1][`.-p-${size}`] = {padding: '-' + spacing[psize]};

      spacingUtils[2][`.py-${size}`] = {
        'padding-top': spacing[psize],
        'padding-bottom': spacing[psize],
      };
      spacingUtils[2][`.-py-${size}`] = {
        'padding-top': '-' + spacing[psize],
        'padding-bottom': '-' + spacing[psize],
      };
      spacingUtils[2][`.px-${size}`] = {
        'padding-right': spacing[psize],
        'padding-left': spacing[psize],
      };
      spacingUtils[2][`.-px-${size}`] = {
        'padding-right': '-' + spacing[psize],
        'padding-left': '-' + spacing[psize],
      };

      spacingUtils[3][`.pt-${size}`] = {'padding-top': spacing[psize]};
      spacingUtils[3][`.-pt-${size}`] = {'padding-top': '-' + spacing[psize]};
      spacingUtils[3][`.pb-${size}`] = {'padding-bottom': spacing[psize]};
      spacingUtils[3][`.-pb-${size}`] = {
        'padding-bottom': '-' + spacing[psize],
      };

      spacingUtils[4][`.p-auto`] = {padding: 'auto'};
      spacingUtils[4][`[dir="rtl"] .pr-auto`] = {'padding-left': 'auto'};
      spacingUtils[4][`[dir="ltr"] .pr-auto`] = {'padding-right': 'auto'};
      spacingUtils[4][`[dir="rtl"] .pl-auto`] = {'padding-right': 'auto'};
      spacingUtils[4][`[dir="ltr"] .pl-auto`] = {'padding-left': 'auto'};
      spacingUtils[4][`.pt-auto`] = {'padding-top': 'auto'};
      spacingUtils[4][`.pb-auto`] = {'padding-bottom': 'auto'};
    }
  }
  return spacingUtils;
};
const generateMarginUtils = (spacing) => {
  const spacingUtils = [{}, {}, {}, {}, {}];
  for (const psize in spacing) {
    let size = psize;
    if (size.includes('.')) size = psize.replace('.', `\\.`);

    if (size.toString() !== 'px') {
      spacingUtils[0][`[dir='rtl'] .mr-${size}`] = {
        'margin-left': spacing[psize],
      };
      spacingUtils[0][`[dir='rtl'] .-mr-${size}`] = {
        'margin-left': '-' + spacing[psize],
      };

      spacingUtils[0][`[dir='rtl'] .ml-${size}`] = {
        'margin-right': spacing[psize],
      };
      spacingUtils[0][`[dir='rtl'] .-ml-${size}`] = {
        'margin-right': '-' + spacing[psize],
      };

      spacingUtils[0][`[dir='ltr'] .mr-${size}`] = {
        'margin-right': spacing[psize],
      };
      spacingUtils[0][`[dir='ltr'] .-mr-${size}`] = {
        'margin-right': '-' + spacing[psize],
      };

      spacingUtils[0][`[dir='ltr'] .ml-${size}`] = {
        'margin-left': spacing[psize],
      };
      spacingUtils[0][`[dir='ltr'] .-ml-${size}`] = {
        'margin-left': '-' + spacing[psize],
      };

      spacingUtils[1][`.m-${size}`] = {margin: spacing[psize]};
      spacingUtils[1][`.-m-${size}`] = {margin: '-' + spacing[psize]};

      spacingUtils[2][`.my-${size}`] = {
        'margin-top': spacing[psize],
        'margin-bottom': spacing[psize],
      };
      spacingUtils[2][`.-my-${size}`] = {
        'margin-top': '-' + spacing[psize],
        'margin-bottom': '-' + spacing[psize],
      };
      spacingUtils[2][`.mx-${size}`] = {
        'margin-right': spacing[psize],
        'margin-left': spacing[psize],
      };
      spacingUtils[2][`.-mx-${size}`] = {
        'margin-right': '-' + spacing[psize],
        'margin-left': '-' + spacing[psize],
      };

      spacingUtils[3][`.mt-${size}`] = {'margin-top': spacing[psize]};
      spacingUtils[3][`.-mt-${size}`] = {'margin-top': '-' + spacing[psize]};
      spacingUtils[3][`.mb-${size}`] = {'margin-bottom': spacing[psize]};
      spacingUtils[3][`.-mb-${size}`] = {'margin-bottom': '-' + spacing[psize]};

      spacingUtils[4][`.m-auto`] = {margin: 'auto'};
      spacingUtils[4][`[dir="rtl"] .mr-auto`] = {'margin-left': 'auto'};
      spacingUtils[4][`[dir="ltr"] .mr-auto`] = {'margin-right': 'auto'};
      spacingUtils[4][`[dir="rtl"] .ml-auto`] = {'margin-right': 'auto'};
      spacingUtils[4][`[dir="ltr"] .ml-auto`] = {'margin-left': 'auto'};
      spacingUtils[4][`.mt-auto`] = {'margin-top': 'auto'};
      spacingUtils[4][`.mb-auto`] = {'margin-bottom': 'auto'};
    }
  }
  return spacingUtils;
};

const generateRadiusUtils = (radius) => {
  const utils = {};
  Object.keys(radius).forEach((size) => {
    let sizeSuffix = `-${size}`;
    if (size === 'DEFAULT') sizeSuffix = '';
    utils[`.rounded${sizeSuffix}`] = {
      'border-radius': radius[size],
    };
    utils[`.rounded-t${sizeSuffix}`] = {
      'border-top-left-radius': radius[size],
      'border-top-right-radius': radius[size],
    };
    utils[`.rounded-b${sizeSuffix}`] = {
      'border-bottom-right-radius': radius[size],
      'border-bottom-left-radius': radius[size],
    };
    utils[`[dir="rtl"] .rounded-r${sizeSuffix}`] = {
      'border-top-left-radius': radius[size],
      'border-bottom-left-radius': radius[size],
    };
    utils[`[dir="ltr"] .rounded-r${sizeSuffix}`] = {
      'border-top-right-radius': radius[size],
      'border-bottom-right-radius': radius[size],
    };

    utils[`[dir="rtl"] .rounded-l${sizeSuffix}`] = {
      'border-top-right-radius': radius[size],
      'border-bottom-right-radius': radius[size],
    };
    utils[`[dir="ltr"] .rounded-l${sizeSuffix}`] = {
      'border-top-left-radius': radius[size],
      'border-bottom-left-radius': radius[size],
    };

    utils[`[dir="rtl"] .rounded-tl${sizeSuffix}`] = {
      'border-top-right-radius': radius[size],
    };
    utils[`[dir="rtl"] .rounded-tr${sizeSuffix}`] = {
      'border-top-left-radius': radius[size],
    };

    utils[`[dir="ltr"] .rounded-tl${sizeSuffix}`] = {
      'border-top-left-radius': radius[size],
    };
    utils[`[dir="ltr"] .rounded-tr${sizeSuffix}`] = {
      'border-top-right-radius': radius[size],
    };

    utils[`[dir="rtl"] .rounded-bl${sizeSuffix}`] = {
      'border-bottom-right-radius': radius[size],
    };
    utils[`[dir="rtl"] .rounded-br${sizeSuffix}`] = {
      'border-bottom-left-radius': radius[size],
    };

    utils[`[dir="ltr"] .rounded-bl${sizeSuffix}`] = {
      'border-bottom-left-radius': radius[size],
    };
    utils[`[dir="ltr"] .rounded-br${sizeSuffix}`] = {
      'border-bottom-right-radius': radius[size],
    };
  });
  return utils;
};
const pluginFn = ({matchUtilities, addUtilities, theme, variants, e}) => {
  const spacingValues = theme('spacing');
  addUtilities(RTLUtils);
  addUtilities(generateRadiusUtils(theme('borderRadius')));
  addUtilities(generatePaddingUtils(spacingValues));
  addUtilities(generateMarginUtils(spacingValues));
};

const autoRTL = plugin(pluginFn);

const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('./colors');

module.exports = {
  corePlugins: {
    margin: false,
    padding: false,
    borderRadius: false,
  },
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
      inner: 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.05)',
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
        '6xl': '68px',
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
      colors,
    },
  },
  plugins: [autoRTL],
};
