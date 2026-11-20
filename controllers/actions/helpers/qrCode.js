'use strict';

const QRCode = require('qrcode');

const QR_OPTIONS = {
  errorCorrectionLevel: 'L',
  // Keep the rendered QR dimensions unchanged while giving the modules more
  // usable area for reliable scanning in the PDF rasterization.
  margin: 0,
  type: 'svg',
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
};

function buildVoucherQrUrl(voucherId, customerIds = [], options = {}) {
  let baseUrl = String(process.env.URL || '').trim();
  baseUrl = baseUrl.replace(/^(https?):(?!\/\/)/i, '$1://');
  const groupQuery = Array.isArray(customerIds) && customerIds.length
    ? `?group=${encodeURIComponent(customerIds.join(','))}`
    : '';
  if (!baseUrl) return `/voucher/scan/${encodeURIComponent(voucherId)}${groupQuery}`;

  const url = new URL(baseUrl);

  // KTP QR codes use the short redirect route so long public paths do not
  // turn the QR into an unnecessarily dense, hard-to-scan symbol. KTP
  // vouchers show one shared flight, so customer-group IDs are unnecessary;
  // the redirect still resolves the selected link-voucher format by voucher ID.
  if (options.shortUrl) {
    return `${url.origin}/voucher/scan/${encodeURIComponent(voucherId)}`;
  }

  const publicPath = url.pathname.replace(/\/+$/, '');

  // URL is configured as the public voucher path in production. Keep that
  // exact path in the QR so scanners open the same public voucher route.
  if (publicPath && publicPath !== '/') {
    return `${url.origin}${publicPath}/${encodeURIComponent(voucherId)}${groupQuery}`;
  }

  return `${url.origin}/voucher/scan/${encodeURIComponent(voucherId)}${groupQuery}`;
}

async function generateVoucherQr(voucherId, customerIds = [], options = {}) {
  return generateQr(buildVoucherQrUrl(voucherId, customerIds, options));
}

async function generateQr(data) {
  const svg = await QRCode.toString(data, QR_OPTIONS);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

module.exports = {
  generateQr,
  generateVoucherQr
};
