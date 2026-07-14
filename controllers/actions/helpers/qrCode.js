'use strict';

const QRCode = require('qrcode');

const QR_OPTIONS = {
  errorCorrectionLevel: 'H',
  margin: 4,
  type: 'svg',
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
};

const LINK_VOUCHER_PATH = '/crm/data/voucher/hotel/travel/c=930390289898889s9ddcc0X9d0d90nsnwxweeddd&q=1909cnkxcjdsdudd9d9sd9sd9si9sdsdd/crm/data/voucher/hotel/travel/c=930390289898889s9ddcc0X9d0d90nsnwxweeddd&q=1909cnkxcjdsdudd9d9sd9sd9si9sdsdd';

function buildVoucherQrUrl(voucherId) {
  const configuredUrl = (process.env.URL || '').trim().replace(/\/+$/, '');

  if (!configuredUrl) {
    return `${LINK_VOUCHER_PATH}/${voucherId}`;
  }

  if (configuredUrl.includes(LINK_VOUCHER_PATH)) {
    return `${configuredUrl}/${voucherId}`;
  }

  return `${configuredUrl}${LINK_VOUCHER_PATH}/${voucherId}`;
}

async function generateVoucherQr(voucherId) {
  return generateQr(buildVoucherQrUrl(voucherId));
}

async function generateQr(data) {
  const svg = await QRCode.toString(data, QR_OPTIONS);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

module.exports = {
  buildVoucherQrUrl,
  generateQr,
  generateVoucherQr
};
