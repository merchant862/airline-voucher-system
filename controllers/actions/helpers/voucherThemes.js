const fs = require('fs');
const path = require('path');

const VOUCHER_THEMES = {
  blue: { label: 'Ocean Blue', primary: '#bfdbfe', dark: '#1d4ed8', soft: '#eff6ff', accent: '#0f766e' },
  teal: { label: 'Professional Teal', primary: '#99f6e4', dark: '#0f766e', soft: '#f0fdfa', accent: '#2563eb' },
  green: { label: 'Fresh Green', primary: '#bbf7d0', dark: '#15803d', soft: '#f0fdf4', accent: '#0f766e' },
  rose: { label: 'Soft Rose', primary: '#fecdd3', dark: '#be123c', soft: '#fff1f2', accent: '#c2410c' },
  amber: { label: 'Warm Amber', primary: '#fde68a', dark: '#b45309', soft: '#fffbeb', accent: '#0f766e' },
  violet: { label: 'Elegant Violet', primary: '#ddd6fe', dark: '#6d28d9', soft: '#f5f3ff', accent: '#0f766e' },
  bw: { label: 'No Color, Black & White', primary: '#111111', dark: '#000000', soft: '#ffffff', accent: '#000000' },
  'light-grey': { label: 'Light Grey', primary: '#9ca3af', dark: '#4b5563', soft: '#f3f4f6', accent: '#6b7280' },
  'dark-grey': { label: 'Dark Grey', primary: '#d1d5db', dark: '#4b5563', soft: '#f3f4f6', accent: '#6b7280' }
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
