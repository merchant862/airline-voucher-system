'use strict';

const QRCode = require('qrcode');

const QR_OPTIONS = {
  errorCorrectionLevel: 'H',
  margin: 4,
  scale: 8,
  type: 'image/png',
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
  return QRCode.toDataURL(buildVoucherQrUrl(voucherId), QR_OPTIONS);
}

async function generateQr(data) {
  return QRCode.toDataURL(data, QR_OPTIONS);
}

module.exports = {
  generateQr,
  generateVoucherQr
};
