/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const colors = {
  // Text colors
  primary: '#23272F', // gray-90
  'primary-dark': '#F6F7F9', // gray-5
  secondary: '#404756', // gray-70
  'secondary-dark': '#EBECF0', // gray-10
  tertiary: '#5E687E', // gray-50
  'tertiary-dark': '#99A1B3', // gray-30
  // link: '#087EA4', // blue-50
  // 'link-dark': '#149ECA', // blue-40
  syntax: '#EBECF0', // gray-10
  wash: '#FFFFFF',
  'wash-dark': '#23272F', // gray-90
  card: '#F6F7F9', // gray-05
  'card-dark': '#343A46', // gray-80
  highlight: '#E6F7FF', // blue-10
  'highlight-dark': 'rgba(88,175,223,.1)',
  border: '#EBECF0', // gray-10
  'border-dark': '#343A46', // gray-80
  'secondary-button': '#EBECF0', // gray-10
  'secondary-button-dark': '#404756', // gray-70

  // Gray
  'gray-95': '#16181D',
  'gray-90': '#23272F',
  'gray-80': '#343A46',
  'gray-70': '#404756',
  'gray-60': '#4E5769',
  'gray-50': '#5E687E',
  'gray-40': '#78839B',
  'gray-30': '#99A1B3',
  'gray-20': '#BCC1CD',
  'gray-15': '#D0D3DC',
  'gray-10': '#EBECF0',
  'gray-5': '#F6F7F9',

  // Blue
  'blue-80': '#043849', // unused
  'blue-20': '#ABE2ED', // unused
  'blue-10': '#E6F7FF', // UNUSED todo: doesn't match illustrations
  'blue-5': '#E6F6FA',

  'blue-60': '#045975',
  'blue-50': '#087EA4', // text-link
  'blue-40': '#149ECA', // Brand Blue (text-link-dark)
  'blue-30': '#58C4DC',

  // Yellow
  'yellow-60': '#B65700',
  'yellow-50': '#C76A15',
  'yellow-40': '#DB7D27', // unused
  'yellow-30': '#FABD62', // unused
  'yellow-20': '#FCDEB0', // unused
  'yellow-10': '#FDE7C7',
  'yellow-5': '#FEF5E7',
  'yellow-x': '#FFC107',

  // Purple
  'purple-60': '#2B3491', // unused
  'purple-50': '#575FB7',
  'purple-40': '#6B75DB',
  'purple-30': '#8891EC',
  'purple-20': '#C3C8F5', // unused
  'purple-10': '#E7E9FB',
  'purple-5': '#F3F4FD',

  // Green
  'green-60': '#2B6E62',
  'green-50': '#388F7F',
  'green-40': '#44AC99',
  'green-30': '#7FCCBF',
  'green-20': '#ABDED5',
  'green-10': '#E5F5F2',
  'green-5': '#F4FBF9',

  // RED
  'red-60': '#712D28',
  'red-50': '#A6423A', // unused
  'red-40': '#C1554D',
  'red-30': '#D07D77',
  'red-20': '#E5B7B3', // unused
  'red-10': '#F2DBD9', // unused
  'red-5': '#FAF1F0',

  // MISC
  'code-block': '#99a1b30f', // gray-30 @ 6%
  'gradient-blue': '#58C4DC', // Only used for the landing gradient for now.
  github: {
    highlight: '#fffbdd',
  },
};

const experiments = [
  ['#58C4DC', '#149ECA', '#087EA4', , '#045975'], // OG
  ['#2BA2B9', '#0090A7', '#007E92', '#006778'], // Dans fave
  ['#1DA1CD', '#008EB7', '#007CA0', '#006684'],
  ['#00A3C3', '#008FAA', '#007D96', '#00677C'],
  ['#58C4DC', '#0090A7', '#007E92', '#006778'],
  ['#58C4DC', '#2BA2B9', '#0090A7', '#007E92'], // 5 (nice)
  ['#58C4DC', '#3194AA', '#165873', '#1A4C5F'],
  ['#58C4DC', '#3194AA', '#1E7C8A', '#1A4C5F'],
  ['#58C4DC', '#3194AA', '#227C9D', '#1A4C5F'],
  ['#58C4DC', '#1F9CB5', '#227F96', '#1A4C5F'],
  ['#58C4DC', '#1F9CB5', '#2A6F7C', '#1A4C5F'], // 10
  ['#58C4DC', '#39A4C8', '#2A7D98', '#1A4C5F'], // fave **
  ['#58C4DC', '#3FA9CC', '#2A7D98', '#1A4C5F'], // fave *
];

const experiment = 11;

colors['blue-30'] = experiments[experiment][0];
colors['blue-40'] = experiments[experiment][1];
colors['blue-50'] = experiments[experiment][2];
colors['blue-60'] = experiments[experiment][3];

colors.link = colors['blue-40'];
colors['link-dark'] = colors['blue-40'];
colors.brand = colors['blue-40'];
colors['brand-dark'] = colors['blue-40'];

module.exports = colors;
