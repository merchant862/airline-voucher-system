// controllers/voucherController.js

const { voucherFormats } = require('../../database/models');

const path = require('path');
const { generateQr } = require('./helpers/qrCode');
const { getVoucherTheme, getUrduFontData } = require('./helpers/voucherThemes');
const { buildPassengerFlightData } = require('./helpers/passengerFlights');

function getVerifiedImagePath(ejsPath = '') {
    if (ejsPath.includes('crm2')) return '/images/verified.jpeg';
    if (ejsPath.includes('meem2')) return '/images/verified2.png';
    return '';
}

async function getVoucherTemplate(req, res, next) {
    try {

        const format = await voucherFormats.findOne({ where: { id: req.params.id } });
        if (!format) return res.status(404).send('Format not found');
        const isKtp2 = format.ejsPath.includes('ktp2') || format.ejsPath.includes('ktp-2');
        const isKtp2Link = format.ejsPath.includes('ktp-2-link');

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

        // Keep the KTP-2 demo close to the supplied reference while real vouchers remain dynamic.
        if (isKtp2Link) {
            customers.splice(0, customers.length,
                { name: "MUHAMMAD AQIB", gender: "male", passport: "CH1359551", paxType: "Adult", beds: "Yes", visaNumber: "", pnr: "45002344" },
                { name: "SHER MUHAMMAD", gender: "male", passport: "VE0169331", paxType: "Adult", beds: "Yes", visaNumber: "", pnr: "45002344" }
            );
            hotels.splice(0, hotels.length,
                { name: "Land Premium-1000 Meter", confirmNo: "", city: "Makkah", roomType: "Sharing", mealPlan: "RO", checkIn: "30-09-26", checkOut: "07-10-26", nights: 7 },
                { name: "SHAZA AL MANWARA-750 Meter", confirmNo: "", city: "Medinah", roomType: "Sharing", mealPlan: "RO", checkIn: "07-10-26", checkOut: "14-10-26", nights: 7 },
                { name: "Land Premium-1000 Meter", confirmNo: "", city: "Makkah", roomType: "Sharing", mealPlan: "RO", checkIn: "14-10-26", checkOut: "20-10-26", nights: 6 }
            );
            transports.splice(0, transports.length, { route: "Round Trip (Jed-Mak-Med-Mak-Jed)", type: "Economy By Bus" });
            Object.assign(departureFlight, { flightNo: "EY-295", date: "30-Sep", fromCity: "KHI", toCity: "RUH", takeoff: "21:35", landing: "02:55" });
            Object.assign(arrivalFlight, { flightNo: "EY-602", date: "20-Oct", fromCity: "JED", toCity: "KHI", takeoff: "03:10", landing: "11:00" });
        }

        const notes = ``;
        const passengerFlightData = buildPassengerFlightData(customers, departureFlight, arrivalFlight);

        const qrData = `Voucher: ${Date.now()}`;

        // Base64 QR generate
        const qrImage = await generateQr(qrData);
        // ======= Render EJS =======
        res.render(path.join(__dirname, '../../', format.ejsPath), {
            company: {
                name: isKtp2 ? "KTP TRAVELS" : "MEEM TRAVELS",
                email: isKtp2 ? "" : "Meemtravels110@gmail.com",
                address: isKtp2 ? "" : "Suite 210, 2nd Floor, Business Arcade, Street 12, Block 5, Gulshan-e-Iqbal, Karachi, Sindh, Pakistan",
                logo: isKtp2 ? "/images/ktp.png" : "/images/meem_travels.png"
            },
            foreignCompany:{
                name: "ARKAN AL BAIT FOR UMRAH SERVICES",
                address:'',
                logo: "/images/daleel-alzowar.png"
            },
            familyHead: isKtp2Link ? "MUHAMMAD AQIB" : "SAIF ALI",
            voucher: {
                voucherNo: isKtp2Link ? "UB-100363" : "UB-90125",
                date: isKtp2Link ? "29/09/26" : "2026-01-15",
                package: "20",
                packageType: "Standard",
                beds: 3
            },
            customers,
            hotels,
            transports,
            notes,
            departureFlight,
            arrivalFlight,
            passengerFlights: passengerFlightData.passengerFlights,
            passengerFlightRows: passengerFlightData.passengerFlightRows,
            passengerFlightDisplay: passengerFlightData.passengerFlightDisplay,
            qrImage,
            pdfUrl: '#',
            theme: getVoucherTheme(req.query.theme),
            urduFontData: getUrduFontData(),
            verifiedImage: getVerifiedImagePath(format.ejsPath)
        });

    } catch (err) {
        next(err);
    }
}

module.exports = getVoucherTemplate;
