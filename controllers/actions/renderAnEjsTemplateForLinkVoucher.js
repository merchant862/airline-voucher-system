require('dotenv').config();

const path = require('path');
const { generateVoucherQr } = require('./helpers/qrCode');
const { getVoucherTheme } = require('./helpers/voucherThemes');

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

function getVerifiedImagePath(ejsPath = '') {
    if (ejsPath.includes('crm2')) return '/images/verified.jpeg';
    if (ejsPath.includes('meem2')) return '/images/verified2.png';
    return '';
}

async function getVoucherTemplate(req, res, next) {
    try {

        const voucher = await vouchers.findOne({
            where: { id: req.params.id },

            include: [
                {
                    model: customers,
                    as: 'customers',
                    attributes: [
                        'id',
                        'customerName',
                        'customerPassport',
                        'customerVisa',
                        'customerGender',
                        'customerPNR'
                    ]
                },
                {
                    model: hotels,
                    as: 'hotels',
                    attributes: [
                        'hotelName',
                        'confirmationNo',
                        'city',
                        'roomType',
                        'mealPlan',
                        'checkInDate',
                        'checkOutDate',
                        'noOfNights'
                    ]
                },
                {
                    model: transports,
                    as: 'transports',
                    attributes: ['type', 'route']
                },
                {
                    model: notes,
                    as: 'notes',
                    attributes: ['content']
                },
                {
                    model: agencies,
                    as: 'company',
                    attributes: ['name', 'image', 'address', 'phone', 'email']
                },
                {
                    model: foreignAgencies,
                    as: 'foreignCompany',
                    attributes: ['name', 'image', 'address', 'phone', 'email']
                },
                {
                    model: voucherFormats,
                    as: 'voucherFormat',
                    attributes: ['ejsPath']
                },
                {
                    model: voucherFormats,
                    as: 'linkVoucherFormat',
                    attributes: ['ejsPath']
                }
            ]
        });

        if (!voucher) {
            return res.status(404).send("Voucher not found");
        }

        console.log(voucher.status)

        if (voucher.status == 'inactive') {
            return next();
        }

        if (!voucher.linkVoucherFormat?.ejsPath) {
            return res.status(400).send('Selected link voucher format is not available');
        }

        // ================= Flight Data =================

        const departureFlight = {
            flightNo: voucher.departureFlightNo,
            date: voucher.departureFlightDate?.toISOString().split("T")[0],
            fromCity: voucher.departureFlightFromCity,
            toCity: voucher.departureFlightToCity,
            takeoff: voucher.departureFlightTakeOffTime,
            landing: voucher.departureFlightLandingTime
        };

        const arrivalFlight = {
            flightNo: voucher.arrivalFlightNo,
            date: voucher.arrivalFlightDate?.toISOString().split("T")[0],
            fromCity: voucher.arrivalFlightFromCity,
            toCity: voucher.arrivalFlightToCity,
            takeoff: voucher.arrivalFlightTakeOffTime,
            landing: voucher.arrivalFlightLandingTime
        };

        // ================= Customers =================

        const formattedCustomers = voucher.customers.map(c => {

            let paxType;

            const gender = c.customerGender?.toLowerCase();

            if (gender === "male" || gender === "female") {
                paxType = "Adult";
            } else if (gender === "children") {
                paxType = "Children";
            } else {
                paxType = "Infant";
            }

            return {
                name: c.customerName,
                gender: c.customerGender,
                passport: c.customerPassport,
                paxType,
                beds: "Yes",
                visaNumber: c.customerVisa,
                pnr: c.customerPNR
            };
        });

        // ================= Family Head =================

        const maleCustomer = voucher.customers.find(
            c => c.customerGender?.toLowerCase() === "male"
        );

        const familyHead = maleCustomer
            ? maleCustomer.customerName
            : voucher.customers[0]?.customerName || "";

        // ================= Hotels =================

        const formattedHotels = voucher.hotels.map(h => ({
            name: h.hotelName,
            confirmNo: h.confirmationNo,
            city: h.city,
            roomType: h.roomType,
            mealPlan: h.mealPlan,
            checkIn: h.checkInDate?.toISOString().split("T")[0],
            checkOut: h.checkOutDate?.toISOString().split("T")[0],
            nights: h.noOfNights
        }));

        // ================= Transport =================

        const formattedTransports = voucher.transports.map(t => ({
            route: t.route,
            type: t.type
        }));

        // ================= Notes =================

        const formattedNotes = voucher.notes
            .map(n => n.content)
            .join("\n");

        // ================= QR Code =================

        const qrImage = await generateVoucherQr(voucher.id);

        // ================= Template Path =================

        const ejsPath = path.join(
            __dirname,
            '../../',
            voucher.linkVoucherFormat?.ejsPath
        );

        // ================= Render =================

        res.render(ejsPath, {

            company: {
                name: voucher.company?.name,
                address: voucher.company?.address,
                phone: voucher.company?.phone,
                email: voucher.company?.email,
                logo: voucher.company?.image
                    ? '/' + voucher.company.image.replace('public/', '')
                    : ''
            },

            foreignCompany: {
                name: voucher.foreignCompany?.name,
                address: voucher.foreignCompany?.address,
                phone: voucher.foreignCompany?.phone,
                email: voucher.foreignCompany?.email,
                logo: voucher.foreignCompany?.image
                    ? '/' + voucher.foreignCompany.image.replace('public/', '')
                    : ''
            },

            familyHead,

            voucher: {
                voucherNo: voucher.voucherNo,
                date: voucher.departureFlightDate?.toISOString().split('T')[0] || voucher.createdAt?.toISOString().split('T')[0]
            },

            customers: formattedCustomers,
            hotels: formattedHotels,
            transports: formattedTransports,
            notes: formattedNotes,
            theme: getVoucherTheme(voucher.linkTheme),
            departureFlight,
            arrivalFlight,
            qrImage,
            verifiedImage: getVerifiedImagePath(voucher.linkVoucherFormat?.ejsPath)
        });

    } catch (err) {
        next(err);
    }
}

module.exports = getVoucherTemplate;
