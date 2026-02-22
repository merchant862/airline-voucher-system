require('dotenv').config();

const path = require('path');
const QRCode = require('qrcode');

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
                    attributes: ['name', 'image', 'address']
                },
                {
                    model: foreignAgencies,
                    as: 'foreignCompany',
                    attributes: ['name', 'image', 'address']
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

        if(voucher.status == 'inactive'){
            next();
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

        const qrData = `${process.env.URL}${voucher.id}`;
        const qrImage = await QRCode.toDataURL(qrData, {
            width: 120,
            margin: 1
        });

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
                logo: voucher.company?.image
                    ? '/' + voucher.company.image.replace('public/', '')
                    : ''
            },

            foreignCompany: {
                name: voucher.foreignCompany?.name,
                address: voucher.foreignCompany?.address,
                logo: voucher.foreignCompany?.image
                    ? '/' + voucher.foreignCompany.image.replace('public/', '')
                    : ''
            },

            familyHead,

            voucher: {
                voucherNo: voucher.voucherNo,
                date: voucher.createdAt?.toISOString().split('T')[0]
            },

            customers: formattedCustomers,
            hotels: formattedHotels,
            transports: formattedTransports,
            notes: formattedNotes,
            departureFlight,
            arrivalFlight,
            qrImage
        });

    } catch (err) {
        next(err);
    }
}

module.exports = getVoucherTemplate;