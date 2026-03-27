// controllers/voucherController.js

const { voucherFormats } = require('../../database/models');

const path = require('path');
const QRCode = require('qrcode');

async function getVoucherTemplate(req, res, next) {
    try {

        let format = await voucherFormats.findAll({where: { id : req.params.id }});
        if(!format) return res.status(404).send('Format not found');

        format = JSON.parse(JSON.stringify(format));

        // ======= Static Data =======
        const departureFlight = {
            flightNo: "SV-701",
            date: "2026-01-20",
            fromCity: "KHI",
            toCity: "JED",
            takeoff: "10:10",
            landing: "12:45"
        };

        const arrivalFlight = {
            flightNo: "SV-700",
            date: "2026-01-30",
            fromCity: "JED",
            toCity: "KHI",
            takeoff: "02:45",
            landing: "08:30"
        };

        const customers = [
            { name: "SAIF ALI", gender: "male", passport: "KT9826272", paxType: "Adult", beds: "Yes", visaNumber: "VISA12345", pnr: "PNR001" },
            { name: "AYESHA KHAN", gender: "female", passport: "RN4167421", paxType: "Adult", beds: "Yes", visaNumber: "VISA67890", pnr: "PNR002" },
            { name: "ALI SAIF", gender: "male", passport: "JV9820162", paxType: "Adult", beds: "No", visaNumber: "VISA99999", pnr: "PNR003" }
        ];

        const hotels = [
            { name: "Saif Al Majad", confirmNo: "1170058", city: "Makkah", roomType: "Triple Room", mealPlan: "RO", checkIn: "26/12/25", checkOut: "30/12/25", nights: 4 },
            { name: "Diyar Al Safa", confirmNo: "1170059", city: "Medinah", roomType: "Quad Room", mealPlan: "BB", checkIn: "30/12/25", checkOut: "03/01/26", nights: 4 },
            { name: "Saif Al Majd", confirmNo: "1170060", city: "Makkah", roomType: "Triple Room", mealPlan: "RO", checkIn: "03/01/26", checkOut: "06/01/26", nights: 3 }
        ];

        const transports = [
            { route: "JED-MAK-MED-MAK", type: "Economy Bus" },
            { route: "MAK-JED", type: "Private Car" }
        ];

        const notes = ``;

        const qrData = `Voucher: ${Date.now()}`;

        // Base64 QR generate
        const qrImage = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'L',   // 👈 Low = zyada data = zyada dense
            version: 8,                 // 👈 Higher version = zyada modules
            margin: 1,                   // 👈 Kam white border
            scale: 4                     // 👈 Image clarity control
        });

        // ======= Render EJS =======
        res.render(path.join(__dirname, '../../', format[0].ejsPath), {
            company: {
                name: "MEEM TRAVELS",
                email: "Meemtravels110@gmail.com",
                address:"Suite 210, 2nd Floor, Business Arcade, Street 12, Block 5, Gulshan-e-Iqbal, Karachi, Sindh, Pakistan",
                logo: "/images/meem_travels.png"
            },
            foreignCompany:{
                name: "Daleel Alzowar",
                address:'',
                logo: "/images/daleel-alzowar.png"
            },
            familyHead: "SAIF ALI",
            voucher: {
                voucherNo: "UB-90125",
                date: "2026-01-15"
            },
            customers,
            hotels,
            transports,
            notes,
            departureFlight,
            arrivalFlight,
            qrImage
        });

    } catch (err) {
        next(err);
    }
}

module.exports = getVoucherTemplate;