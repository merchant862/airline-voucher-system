require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const { generateVoucherQr } = require('./helpers/qrCode');

const {
  vouchers,
  customers,
  hotels,
  transports,
  notes,
  agencies,
  foreignAgencies,
  voucherFormats
} = require('./../../database/models');

async function downloadVoucherPdfController(req, res, next) {
  try {

    const { id } = req.params;

    // ==============================
    // 1️⃣ FETCH COMPLETE VOUCHER
    // ==============================

    const voucherData = await vouchers.findOne({
            where: { id: id },

            // ====================== Include related tables ======================
            include: [
                // HasMany relations
                { 
                    model: customers, 
                    as: 'customers',
                    attributes: ['id', 'customerName', 'customerPassport', 'customerVisa', 'customerGender', 'customerPNR', 'voucherId', 'createdAt', 'updatedAt']
                },
                { 
                    model: hotels, 
                    as: 'hotels',
                    attributes: ['id', 'voucherId', 'hotelName', 'confirmationNo', 'city', 'roomType', 'mealPlan', 'checkInDate', 'checkOutDate', 'noOfNights', 'createdAt', 'updatedAt']
                },
                { 
                    model: transports, 
                    as: 'transports',
                    attributes: ['id', 'type', 'route', 'voucherId', 'createdAt', 'updatedAt']
                },
                { 
                    model: notes, 
                    as: 'notes',
                    attributes: ['id', 'content', 'voucherId', 'createdAt', 'updatedAt']
                },

                // BelongsTo relations
                { 
                    model: agencies, 
                    as: 'company',       // companyId
                    attributes: ['id', 'name', 'image', 'address', 'phone', 'email', 'createdAt', 'updatedAt']
                },
                { 
                    model: foreignAgencies, 
                    as: 'foreignCompany', // foreignCompanyId
                    attributes: ['id', 'name', 'image', 'address', 'phone', 'email', 'createdAt', 'updatedAt']
                },
                { 
                    model: voucherFormats, 
                    as: 'voucherFormat', // voucherFormatsId
                    attributes: ['id', 'name', 'ejsPath', 'createdAt', 'updatedAt']
                },
                { 
                    model: voucherFormats, 
                    as: 'linkVoucherFormat', // linkVoucherFormatsId
                    attributes: ['id', 'name', 'ejsPath', 'createdAt', 'updatedAt']
                }
            ]
        });

    if (!voucherData) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    // ==============================
    // 2️⃣ HELPER FUNCTIONS
    // ==============================

    const formatDate = (date) =>
      date ? new Date(date).toISOString().split('T')[0] : '';

    const getBase64Image = async (imgPath) => {
      if (!imgPath) return null;
      try {
        const fullPath = path.join(
          __dirname,
          '../..',
          'public',
          imgPath.replace(/^\/+/, '').replace(/^public\//, '')
        );
        const file = await fs.promises.readFile(fullPath);
        const ext = path.extname(fullPath).substring(1);
        return `data:image/${ext};base64,${file.toString('base64')}`;
      } catch {
        return null;
      }
    };

    const qrImage = await generateVoucherQr(voucherData.id);

    // ==============================
    // 3️⃣ PREPARE EJS DATA
    // ==============================

    const ejsData = {

      voucher: {
        voucherNo: voucherData.voucherNo,
        date: formatDate(voucherData.departureFlightDate)
      },

      company: {
        name: voucherData.company?.name,
        email: voucherData.company?.email,
        phone: voucherData.company?.phone,
        address: voucherData.company?.address,
        logo: await getBase64Image(voucherData.company?.image)
      },

      foreignCompany: {
        name: voucherData.foreignCompany?.name,
        email: voucherData.foreignCompany?.email,
        phone: voucherData.foreignCompany?.phone,
        address: voucherData.foreignCompany?.address,
        logo: await getBase64Image(voucherData.foreignCompany?.image)
      },

      familyHead: voucherData.customers[0]?.customerName || '',

      customers: voucherData.customers.map(c => ({
        name: c.customerName,
        gender: c.customerGender,
        passport: c.customerPassport,
        visaNumber: c.customerVisa,
        pnr: c.customerPNR
      })),

      hotels: voucherData.hotels.map(h => ({
        name: h.hotelName,
        confirmNo: h.confirmationNo,
        city: h.city,
        roomType: h.roomType,
        mealPlan: h.mealPlan,
        checkIn: formatDate(h.checkInDate),
        checkOut: formatDate(h.checkOutDate),
        nights: h.noOfNights
      })),

      transports: voucherData.transports.map(t => ({
        type: t.type,
        route: t.route
      })),

      departureFlight: {
        flightNo: voucherData.departureFlightNo,
        date: formatDate(voucherData.departureFlightDate),
        fromCity: voucherData.departureFlightFromCity,
        toCity: voucherData.departureFlightToCity,
        takeoff: voucherData.departureFlightTakeOffTime,
        landing: voucherData.departureFlightLandingTime
      },

      arrivalFlight: {
        flightNo: voucherData.arrivalFlightNo,
        date: formatDate(voucherData.arrivalFlightDate),
        fromCity: voucherData.arrivalFlightFromCity,
        toCity: voucherData.arrivalFlightToCity,
        takeoff: voucherData.arrivalFlightTakeOffTime,
        landing: voucherData.arrivalFlightLandingTime
      },

      notes: voucherData.notes.map(n => n.content).join('\n'),
      qrImage
    };

    // ==============================
    // 4️⃣ RENDER HTML
    // ==============================

    const html = await ejs.renderFile(
      path.join(__dirname, '../..', voucherData.voucherFormat.ejsPath),
      ejsData,
      { async: true }
    );

    // ==============================
    // 5️⃣ GENERATE PDF
    // ==============================

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
      await Promise.all(
        imgs.map(img =>
          img.complete
            ? null
            : new Promise(resolve => {
                img.onload = img.onerror = resolve;
              })
        )
      );
      await document.fonts.ready;
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '5mm',
        bottom: '5mm',
        left: '5mm',
        right: '5mm'
      }
    });

    await browser.close();

    // ==============================
    // 6️⃣ SEND DOWNLOAD
    // ==============================

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=voucher_${voucherData.voucherNo}.pdf`,
      'Content-Length': pdfBuffer.length
    });

    return res.end(Buffer.from(pdfBuffer), 'binary');

  } catch (err) {
    next(err);
  }
}

module.exports = downloadVoucherPdfController;
