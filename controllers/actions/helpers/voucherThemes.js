const fs = require('fs');
const path = require('path');

const VOUCHER_THEMES = {
  blue: { label: 'Ocean Blue', primary: '#2563eb', dark: '#1d4ed8', soft: '#eff6ff', accent: '#0f766e' },
  teal: { label: 'Professional Teal', primary: '#0f766e', dark: '#115e59', soft: '#f0fdfa', accent: '#2563eb' },
  green: { label: 'Fresh Green', primary: '#15803d', dark: '#166534', soft: '#f0fdf4', accent: '#0f766e' },
  rose: { label: 'Soft Rose', primary: '#be123c', dark: '#9f1239', soft: '#fff1f2', accent: '#c2410c' },
  amber: { label: 'Warm Amber', primary: '#b45309', dark: '#92400e', soft: '#fffbeb', accent: '#0f766e' },
  violet: { label: 'Elegant Violet', primary: '#6d28d9', dark: '#5b21b6', soft: '#f5f3ff', accent: '#0f766e' },
  bw: { label: 'No Color, Black & White', primary: '#111111', dark: '#000000', soft: '#ffffff', accent: '#000000' },
  'light-grey': { label: 'Light Grey', primary: '#9ca3af', dark: '#4b5563', soft: '#f3f4f6', accent: '#6b7280' },
  'dark-grey': { label: 'Dark Grey', primary: '#374151', dark: '#111827', soft: '#e5e7eb', accent: '#6b7280' }
};

const DEFAULT_VOUCHER_THEME = 'blue';

function getVoucherTheme(themeKey) {
  return VOUCHER_THEMES[themeKey] || VOUCHER_THEMES[DEFAULT_VOUCHER_THEME];
}

function getVoucherThemeKey(themeKey) {
  return VOUCHER_THEMES[themeKey] ? themeKey : DEFAULT_VOUCHER_THEME;
}

function getUrduFontData() {
  const fontPath = path.join(__dirname, '../../../public/fonts/NotoNastaliqUrdu-Regular.ttf');
  return `data:font/ttf;base64,${fs.readFileSync(fontPath).toString('base64')}`;
}

module.exports = {
  VOUCHER_THEMES,
  DEFAULT_VOUCHER_THEME,
  getVoucherTheme,
  getVoucherThemeKey,
  getUrduFontData
};
