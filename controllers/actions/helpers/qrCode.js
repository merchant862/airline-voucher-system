'use strict';

const QRCode = require('qrcode');

const QR_OPTIONS = {
  errorCorrectionLevel: 'L',
  margin: 2,
  type: 'svg',
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
};

function buildVoucherQrUrl(voucherId) {
  let baseUrl = String(process.env.URL || '').trim();
  baseUrl = baseUrl.replace(/^(https?):(?!\/\/)/i, '$1://');
  if (!baseUrl) return `/voucher/scan/${encodeURIComponent(voucherId)}`;

  const url = new URL(baseUrl);
  const publicPath = url.pathname.replace(/\/+$/, '');

  // URL is configured as the public voucher path in production. Keep that
  // exact path in the QR so scanners open the same public voucher route.
  if (publicPath && publicPath !== '/') {
    return `${url.origin}${publicPath}/${encodeURIComponent(voucherId)}`;
  }

  return `${url.origin}/voucher/scan/${encodeURIComponent(voucherId)}`;
}

async function generateVoucherQr(voucherId) {
  return generateQr(buildVoucherQrUrl(voucherId));
}

async function generateQr(data) {
  const svg = await QRCode.toString(data, QR_OPTIONS);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

module.exports = {
  generateQr,
  generateVoucherQr
};
