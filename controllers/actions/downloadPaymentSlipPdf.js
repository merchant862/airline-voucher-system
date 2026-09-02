require('dotenv').config();

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');

const {
  vouchers,
  customers,
  hotels,
  transports,
  notes,
  agencies,
  foreignAgencies,
  voucherFormats,
  roomTypePrices
} = require('../../database/models');
const { getVoucherTheme, getVoucherThemeKey } = require('./helpers/voucherThemes');

const titleCase = (value) =>
  String(value || '')
    .replace(/[-_]+/g, ' ')
    .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';

function singlePassengerName(value) {
  return String(value || '')
    .split(/[\n,;|]+/)
    .map(name => name.trim())
    .filter(Boolean)[0] || '';
}

function receiptNo(voucherNo) {
  const input = String(voucherNo || '');
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 1000000;
  }
  return `PR-${String(hash).padStart(6, '0')}`;
}

function paymentSlipTheme(ejsPath = '') {
  if (ejsPath.includes('meem')) return 'meem';
  if (ejsPath.includes('sudais')) return 'sudais';
  if (ejsPath.includes('crm')) return 'crm';
  return 'irfan';
}

async function getBase64Image(imgPath) {
  if (!imgPath) return null;
  try {
    const fullPath = path.join(__dirname, '../..', 'public', imgPath.replace(/^\/+/, '').replace(/^public\//, ''));
    const file = await fs.promises.readFile(fullPath);
    const ext = path.extname(fullPath).substring(1).replace('jpg', 'jpeg');
    return `data:image/${ext};base64,${file.toString('base64')}`;
  } catch {
    return null;
  }
}

async function downloadPaymentSlipPdfController(req, res, next) {
  try {
    const voucherData = await vouchers.findOne({
      where: { id: req.params.id },
      include: [
        { model: customers, as: 'customers', attributes: ['id', 'customerName', 'customerGender'] },
        { model: hotels, as: 'hotels', attributes: ['hotelName', 'city', 'roomType', 'noOfNights'] },
        { model: transports, as: 'transports', attributes: ['type', 'route', 'rate'] },
        { model: notes, as: 'notes', attributes: ['content'] },
        { model: agencies, as: 'company', attributes: ['name', 'image', 'address', 'phone', 'email'] },
        { model: foreignAgencies, as: 'foreignCompany', attributes: ['name', 'image', 'address', 'phone', 'email'] },
        { model: voucherFormats, as: 'voucherFormat', attributes: ['ejsPath'] },
        { model: voucherFormats, as: 'linkVoucherFormat', attributes: ['ejsPath'] }
      ],
      order: [[{ model: customers, as: 'customers' }, 'id', 'ASC']]
    });

    if (!voucherData) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    const prices = await roomTypePrices.findAll();
    const priceMap = new Map(prices.map(price => [price.roomType, Number(price.price || 0)]));

    const maleCustomer = voucherData.customers.find(customer => customer.customerGender?.toLowerCase() === 'male');
    const passengerName = singlePassengerName(maleCustomer?.customerName || voucherData.customers[0]?.customerName);

    const hotelItems = voucherData.hotels.map(hotel => {
      const nights = Number(hotel.noOfNights || 0);
      const rate = priceMap.get(hotel.roomType) || 0;
      return {
        category: 'Hotel',
        description: `${hotel.city || ''} - ${hotel.hotelName || ''} - ${titleCase(hotel.roomType)}`.replace(/^ - | - $/g, ''),
        quantity: nights,
        quantityLabel: 'Nights',
        rate,
        amount: nights * rate
      };
    });

    const transportItems = voucherData.transports
      .filter(transport => ['private car', 'economy bus'].includes((transport.type || '').trim().toLowerCase()))
      .map(transport => ({
        category: 'Transport',
        description: `${transport.type || 'Transport'} - ${transport.route || ''}`.replace(/ - $/, ''),
        quantity: 1,
        quantityLabel: 'Trip',
        rate: Number(transport.rate || 0),
        amount: Number(transport.rate || 0)
      }));

    const items = [...hotelItems, ...transportItems];
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const themeKey = getVoucherThemeKey(voucherData.pdfTheme);

    const html = await ejs.renderFile(
      path.join(__dirname, '../..', 'views/payment_slip.ejs'),
      {
        company: {
          name: voucherData.company?.name,
          address: voucherData.company?.address,
          phone: voucherData.company?.phone,
          email: voucherData.company?.email,
          logo: await getBase64Image(voucherData.company?.image)
        },
        foreignCompany: {
          name: voucherData.foreignCompany?.name
        },
        slip: {
          receiptNo: receiptNo(voucherData.voucherNo),
          date: formatDate(new Date()),
          voucherNo: voucherData.voucherNo,
          passengerName,
          currency: 'PKR',
          items,
          totalAmount,
          themeKey,
          theme: getVoucherTheme(themeKey)
        }
      },
      { async: true }
    );

    const browser = await puppeteer.launch({
      executablePath: process.env.CHROMIUM_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });
    await page.setContent(html, { waitUntil: 'networkidle2' });
    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(imgs.map(img => img.complete ? null : new Promise(resolve => { img.onload = img.onerror = resolve; })));
      await document.fonts.ready;
    });

    const pdfBuffer = await page.pdf({
    format: 'A4',
      printBackground: true,
      margin: { top: '5mm', bottom: '5mm', left: '5mm', right: '5mm' }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=payment_slip_${voucherData.voucherNo}.pdf`,
      'Content-Length': pdfBuffer.length
    });

    return res.end(Buffer.from(pdfBuffer), 'binary');
  } catch (error) {
    next(error);
  }
}

module.exports = downloadPaymentSlipPdfController;
