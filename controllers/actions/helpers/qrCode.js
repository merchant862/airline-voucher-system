'use strict';

const QRCode = require('qrcode');

const QR_OPTIONS = {
  errorCorrectionLevel: 'M',
  margin: 4,
  type: 'svg',
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
};

function buildVoucherQrUrl(voucherId) {
  const baseUrl = process.env.URL || '';
  return `${baseUrl}${voucherId}`;
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
