require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const { generateVoucherQr } = require('./helpers/qrCode');
const { getVoucherTheme, getUrduFontData } = require('./helpers/voucherThemes');
const { buildPassengerFlightData } = require('./helpers/passengerFlights');
const { groupCustomersByFlight, findRequestedFlightGroup } = require('./helpers/passengerFlightGroups');

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

function getFamilyHeadName(customerList = []) {
  const familyHead = customerList.find(
    (customer) => customer.customerGender?.toLowerCase() === 'male'
  );

  return (familyHead || customerList[0])?.customerName || 'voucher';
}

function buildVoucherPdfFilename(customerList = []) {
  const passengerName = getFamilyHeadName(customerList)
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  return `${passengerName || 'passenger'}.pdf`;
}

function getVerifiedImagePath(ejsPath = '') {
  if (ejsPath.includes('crm2')) return 'images/verified.jpeg';
  if (ejsPath.includes('meem2')) return 'images/verified2.png';
  return null;
}

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
                    attributes: ['id', 'customerName', 'customerPassport', 'customerVisa', 'customerGender', 'customerPNR', 'departureFlightDate', 'departureFlightNo', 'departureFlightFromCity', 'departureFlightToCity', 'departureFlightTakeOffTime', 'departureFlightLandingTime', 'arrivalFlightDate', 'arrivalFlightNo', 'arrivalFlightFromCity', 'arrivalFlightToCity', 'arrivalFlightTakeOffTime', 'arrivalFlightLandingTime', 'voucherId', 'createdAt', 'updatedAt']
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

    if (!voucherData.voucherFormat?.ejsPath) {
      return res.status(400).json({ error: 'Selected download voucher format is not available' });
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

    const departureFallback = {
      flightNo: voucherData.departureFlightNo,
      date: formatDate(voucherData.departureFlightDate),
      fromCity: voucherData.departureFlightFromCity,
      toCity: voucherData.departureFlightToCity,
      takeoff: voucherData.departureFlightTakeOffTime,
      landing: voucherData.departureFlightLandingTime
    };
    const arrivalFallback = {
      flightNo: voucherData.arrivalFlightNo,
      date: formatDate(voucherData.arrivalFlightDate),
      fromCity: voucherData.arrivalFlightFromCity,
      toCity: voucherData.arrivalFlightToCity,
      takeoff: voucherData.arrivalFlightTakeOffTime,
      landing: voucherData.arrivalFlightLandingTime
    };

    const flightGroups = groupCustomersByFlight(
      voucherData.customers,
      departureFallback,
      arrivalFallback
    );
    if (!flightGroups.length) {
      flightGroups.push({ key: '', customers: [], customerIds: [] });
    }
    const requestedGroup = findRequestedFlightGroup(flightGroups, req.query.group);
    const renderGroups = requestedGroup ? [requestedGroup] : flightGroups;

    // ==============================
    // 3️⃣ PREPARE EJS DATA
    // ==============================

    const buildEjsData = async (group) => {
      const groupCustomers = group.customers;
      const passengerFlightData = buildPassengerFlightData(
        groupCustomers,
        departureFallback,
        arrivalFallback
      );
      const qrImage = await generateVoucherQr(voucherData.id, group.customerIds);

      return {

      voucher: {
        voucherNo: voucherData.voucherNo,
        date: formatDate(voucherData.departureFlightDate),
        package: voucherData.packageNumber,
        packageType: voucherData.packageName
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

      familyHead: groupCustomers[0]?.customerName || '',

      customers: groupCustomers.map(c => ({
        name: c.customerName,
        gender: c.customerGender,
        passport: c.customerPassport,
        visaNumber: c.customerVisa,
        pnr: c.customerPNR,
        departureFlight: { date: formatDate(c.departureFlightDate), flightNo: c.departureFlightNo, fromCity: c.departureFlightFromCity, toCity: c.departureFlightToCity, takeoff: c.departureFlightTakeOffTime, landing: c.departureFlightLandingTime },
        arrivalFlight: { date: formatDate(c.arrivalFlightDate), flightNo: c.arrivalFlightNo, fromCity: c.arrivalFlightFromCity, toCity: c.arrivalFlightToCity, takeoff: c.arrivalFlightTakeOffTime, landing: c.arrivalFlightLandingTime }
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

      passengerFlights: passengerFlightData.passengerFlights,
      departureFlight: passengerFlightData.departureFlight,
      arrivalFlight: passengerFlightData.arrivalFlight,

      notes: voucherData.notes.map(n => n.content).join('\n'),
      qrImage,
      theme: getVoucherTheme(voucherData.pdfTheme),
      urduFontData: getUrduFontData(),
      verifiedImage: await getBase64Image(getVerifiedImagePath(voucherData.voucherFormat.ejsPath))
      };
    };

    // ==============================
    // 4️⃣ RENDER HTML
    // ==============================

    const templatePath = path.join(__dirname, '../..', voucherData.voucherFormat.ejsPath);
    const htmlParts = [];
    for (const group of renderGroups) {
      htmlParts.push(await ejs.renderFile(templatePath, await buildEjsData(group), { async: true }));
    }
    const html = htmlParts.length === 1
      ? htmlParts[0]
      : (() => {
          const first = htmlParts[0];
          const headEnd = first.indexOf('</head>');
          const head = first.slice(0, headEnd + 7);
          const bodies = htmlParts.map(part => {
            const start = part.indexOf('>', part.indexOf('<body')) + 1;
            return part.slice(start, part.lastIndexOf('</body>'));
          });
          return `${head}<body>${bodies.join('<div style="break-before:page"></div>')}</body></html>`;
        })();

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

    const isKtp2Download = voucherData.voucherFormat.ejsPath.includes('ktp2');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: isKtp2Download ? undefined : {
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
      'Content-Disposition': `${req.query.view ? 'inline' : 'attachment'}; filename="${buildVoucherPdfFilename(voucherData.customers)}"`,
      'Content-Length': pdfBuffer.length
    });

    return res.end(Buffer.from(pdfBuffer), 'binary');

  } catch (err) {
    next(err);
  }
}

module.exports = downloadVoucherPdfController;
