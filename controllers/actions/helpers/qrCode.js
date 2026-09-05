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
  const origin = baseUrl ? new URL(baseUrl).origin : '';
  return `${origin}/voucher/scan/${voucherId}`;
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
