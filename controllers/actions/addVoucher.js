require('dotenv').config();

const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const fetch = require('isomorphic-fetch'); 

const { vouchers, 
    customers, 
    hotels, 
    transports, 
    notes, 
    agencies, 
    foreignAgencies, 
    voucherFormats  } = require('./../../database/models');

async function addVoucherController(req, res, next) 
{

const t = await vouchers.sequelize.transaction();

try 
{

    // ==============================
    // 1️⃣ CREATE VOUCHER
    // ==============================

    const voucher = await vouchers.create(
    {
        linkVoucherFormatsId: req.body.linkVoucherFormatsId,
        voucherFormatsId: req.body.voucherFormatsId,
        companyId: req.body.companyId,
        foreignCompanyId: req.body.foreignCompanyId,
        voucherNo: `UB-${Math.floor(100000 + Math.random() * 900000)}`,
        departureFlightDate: req.body.departureFlightDate,
        departureFlightNo: req.body.departureFlightNo,
        departureFlightFromCity: req.body.departureFlightFromCity,
        departureFlightToCity: req.body.departureFlightToCity,
        departureFlightTakeOffTime: req.body.departureFlightTakeOffTime,
        departureFlightLandingTime: req.body.departureFlightLandingTime,
        arrivalFlightDate: req.body.arrivalFlightDate,
        arrivalFlightNo: req.body.arrivalFlightNo,
        arrivalFlightFromCity: req.body.arrivalFlightFromCity,
        arrivalFlightToCity: req.body.arrivalFlightToCity,
        arrivalFlightTakeOffTime: req.body.arrivalFlightTakeOffTime,
        arrivalFlightLandingTime: req.body.arrivalFlightLandingTime
    }, { transaction: t });

    const voucherId = voucher.id;

    console.log(`voucherId: ${voucherId}`)

    // ==============================
    // 2️⃣ CUSTOMERS
    // ==============================

    if (Array.isArray(req.body.customerName)) 
    {

        const customersData = req.body.customerName.map((name, i) => 
        {

            const gender = req.body.customerGender?.[i];

            if (!['male', 'female', 'infant', 'children'].includes(gender)) 
            {
                throw new Error(`Invalid gender at index ${i}`);
            }

            return {
                customerName: name?.trim(),
                customerPassport: req.body.customerPassport?.[i]?.trim() || null,
                customerVisa: req.body.customerVisa?.[i]?.trim() || null,
                customerGender: gender,
                customerPNR: req.body.customerPNR?.[i]?.trim() || null,
                voucherId
            };
        });

        await customers.bulkCreate(customersData, { transaction: t });
    }

    // ==============================
    // 3️⃣ HOTELS
    // ==============================

    if (Array.isArray(req.body.hotelName)) 
    {

        const hotelsData = req.body.hotelName.map((name, i) => (
        {
            hotelName: name?.trim(),
            confirmationNo: `CONF-${voucherId}-${Date.now()}-${i+1}`,
            city: req.body.hotelCity?.[i]?.trim() || null,
            roomType: req.body.hotelRoomType?.[i]?.trim() || null,
            mealPlan: req.body.hotelMealPlan?.[i] || 'RO',
            checkInDate: req.body.hotelCheckin?.[i] || null,
            checkOutDate: req.body.hotelCheckout?.[i] || null,
            noOfNights: req.body.hotelNoOfNights?.[i] || 0, // 👈 frontend se direct
            voucherId
        }));

        await hotels.bulkCreate(hotelsData, { transaction: t });
    }

    // ==============================
    // 4️⃣ TRANSPORTS
    // ==============================

    if (Array.isArray(req.body.transportRoute)) 
    {

        const transportData = req.body.transportRoute.map((route, i) => (
        {
            route: route?.trim(),
            type: req.body.transportType?.[i]?.trim() || null,
            voucherId
        }));

        await transports.bulkCreate(transportData, { transaction: t });
    }

    // ==============================
    // 5️⃣ NOTES
    // ==============================

    if (req.body.vouchernotes?.trim()) 
    {
        await notes.create(
        {
            content: req.body.vouchernotes.trim(),
            voucherId
        }, { transaction: t });
    }

    // ==============================
    // COMMIT
    // ==============================

    await t.commit();

    // 1️⃣ Fetch voucher data from existing API
    const voucherData = await vouchers.findOne({
    where: { id: voucherId },

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

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

    const qrData = process.env.URL;
    
    // Base64 QR generate
    const qrImage = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'L',   // 👈 Low = zyada data = zyada dense
        version: 8,                 // 👈 Higher version = zyada modules
        margin: 1,                   // 👈 Kam white border
        scale: 4                     // 👈 Image clarity control
    });

    const ejsData = {
    voucher: {
        voucherNo: voucherData.voucherNo,
        date: formatDate(voucherData.departureFlightDate),
    },
    company: {
        name: voucherData.company.name,
        logo: voucherData.company.image
    },
    foreignCompany: {
        logo: voucherData.foreignCompany.image
    },
    transports: voucherData.transports.map(t => ({
        type: t.type,
        route: t.route,
    })),
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
    qrImage: qrImage
};
    // Render EJS
    const ejsFilePath = path.join(__dirname, '../..', voucherData.voucherFormat.ejsPath);
    const html = await ejs.renderFile(ejsFilePath, ejsData, { async: true });

    // Generate PDF
    const browser = await puppeteer.launch({
        executablePath: process.env.CHROMIUM_PATH,
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // Send PDF only
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=voucher_${voucherId}.pdf`,
        'Content-Length': pdfBuffer.length
    });

    return res.send(pdfBuffer);

} 

catch (error) {
    // Only rollback if transaction is still active
    if (t.finished !== 'commit') {
        await t.rollback();
    }
    next(error);
}
}
module.exports = addVoucherController

