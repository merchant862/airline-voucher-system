require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const { generateVoucherQr } = require('./helpers/qrCode');
const { vouchers, customers, hotels, transports, notes, agencies, foreignAgencies, voucherFormats } = require('./../../database/models');

async function updateVoucherController(req, res, next) {
    const t = await vouchers.sequelize.transaction();
    try {
        const { id } = req.params;
        const voucher = await vouchers.findByPk(id, { transaction: t });
        if (!voucher) return res.status(404).json({ error: 'Voucher not found' });

        // ==============================
        // 1️⃣ UPDATE VOUCHER FIELDS
        // ==============================
        await voucher.update({
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

        // ==============================
        // 2️⃣ CUSTOMERS
        // ==============================
        if (Array.isArray(req.body.customers)) {
            await customers.destroy({ where: { voucherId }, transaction: t });

            const validGenders = ['male', 'female', 'infant', 'children'];
            const customersData = req.body.customers.map(c => ({
                customerName: c.customerName?.trim() || 'Unknown',
                customerPassport: c.customerPassport?.trim() || null,
                customerVisa: c.customerVisa?.trim() || null,
                customerGender: validGenders.includes(c.customerGender) ? c.customerGender : 'male', // default male
                customerPNR: c.customerPNR?.trim() || null,
                voucherId
            }));
            await customers.bulkCreate(customersData, { transaction: t });
        }

        // ==============================
        // 3️⃣ HOTELS
        // ==============================
        if (Array.isArray(req.body.hotels)) {
            await hotels.destroy({ where: { voucherId }, transaction: t });
            const hotelsData = req.body.hotels.map((h, i) => ({
                hotelName: h.hotelName?.trim() || `Hotel ${i+1}`,
                city: h.city?.trim() || null,
                roomType: h.roomType?.trim() || null,
                mealPlan: h.mealPlan?.trim() || 'RO',
                //confirmationNo: h.confirmNo?.trim() || `CONF-${voucherId}-${Date.now()}-${i+1}`,
                checkInDate: h.checkInDate || null,
                checkOutDate: h.checkOutDate || null,
                noOfNights: Number(h.noOfNights) || 0,
                voucherId
            }));
            await hotels.bulkCreate(hotelsData, { transaction: t });
        }

        // ==============================
        // 4️⃣ TRANSPORTS
        // ==============================
        if (Array.isArray(req.body.transports)) {
            await transports.destroy({ where: { voucherId }, transaction: t });
            const transportsData = req.body.transports.map(tObj => ({
                route: tObj.route?.trim() || 'Unknown Route',
                type: tObj.type?.trim() || null,
                voucherId
            }));
            await transports.bulkCreate(transportsData, { transaction: t });
        }

        // ==============================
        // 5️⃣ NOTES
        // ==============================
        await notes.destroy({ where: { voucherId }, transaction: t });
        if (Array.isArray(req.body.notes)) {
            const notesData = req.body.notes.map(n => ({ content: n.content?.trim() || '', voucherId }));
            await notes.bulkCreate(notesData, { transaction: t });
        }

        await t.commit();

        // ==============================
        // 6️⃣ FETCH FULL UPDATED VOUCHER
        // ==============================
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

        // ==============================
        // 7️⃣ GENERATE PDF
        // ==============================
        const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
        const getBase64Image = async (imgPath) => {
            if (!imgPath) return null;
            try {
                const fullPath = path.join(__dirname, '../..', 'public', imgPath.replace(/^\/+/, '').replace(/^public\//, ''));
                const file = await fs.promises.readFile(fullPath);
                const ext = path.extname(fullPath).substring(1);
                return `data:image/${ext};base64,${file.toString('base64')}`;
            } catch { return null; }
        };

        const qrImage = await generateVoucherQr(voucherId);

        const ejsData = {
            voucher: { voucherNo: voucherData.voucherNo, date: formatDate(voucherData.departureFlightDate) },
            company: {
                name: voucherData.company.name,
                email: voucherData.company.email,
                address: voucherData.company.address,
                logo: await getBase64Image(voucherData.company?.image),
            },
            foreignCompany: { logo: await getBase64Image(voucherData.foreignCompany?.image) },
            transports: voucherData.transports.map(t => ({ type: t.type, route: t.route })),
            familyHead: voucherData.customers[0]?.customerName || '',
            customers: voucherData.customers.map(c => ({
                name: c.customerName, gender: c.customerGender, passport: c.customerPassport, visaNumber: c.customerVisa, pnr: c.customerPNR
            })),
            hotels: voucherData.hotels.map(h => ({
                name: h.hotelName, confirmNo: h.confirmationNo, city: h.city, roomType: h.roomType, mealPlan: h.mealPlan,
                checkIn: formatDate(h.checkInDate), checkOut: formatDate(h.checkOutDate), nights: h.noOfNights
            })),
            departureFlight: {
                flightNo: voucherData.departureFlightNo, date: formatDate(voucherData.departureFlightDate),
                fromCity: voucherData.departureFlightFromCity, toCity: voucherData.departureFlightToCity,
                takeoff: voucherData.departureFlightTakeOffTime, landing: voucherData.departureFlightLandingTime
            },
            arrivalFlight: {
                flightNo: voucherData.arrivalFlightNo, date: formatDate(voucherData.arrivalFlightDate),
                fromCity: voucherData.arrivalFlightFromCity, toCity: voucherData.arrivalFlightToCity,
                takeoff: voucherData.arrivalFlightTakeOffTime, landing: voucherData.arrivalFlightLandingTime
            },
            notes: voucherData.notes.map(n => n.content).join('\n'),
            qrImage
        };

        const html = await ejs.renderFile(path.join(__dirname, '../..', voucherData.voucherFormat.ejsPath), ejsData, { async: true });
        const browser = await puppeteer.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 1600 });
        await page.setContent(html, { waitUntil: 'networkidle2' });
        await page.evaluate(async () => { const imgs = Array.from(document.images); await Promise.all(imgs.map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; }))); await document.fonts.ready; });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top:'10mm', bottom:'10mm', left:'10mm', right:'10mm' } });
        await browser.close();

        res.set({ 'Content-Type':'application/pdf', 'Content-Disposition': `attachment; filename=voucher_${voucher.voucherNo}.pdf`, 'Content-Length': pdfBuffer.length });
        return res.end(Buffer.from(pdfBuffer), 'binary');

    } catch (err) {
        if (t.finished !== 'commit') await t.rollback();
        next(err);
    }
}

module.exports = updateVoucherController;
