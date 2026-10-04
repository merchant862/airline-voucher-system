require('dotenv').config();

const path = require('path');
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
                        'customerPNR',
                        'departureFlightDate', 'departureFlightNo', 'departureFlightFromCity', 'departureFlightToCity',
                        'departureFlightTakeOffTime', 'departureFlightLandingTime', 'arrivalFlightDate', 'arrivalFlightNo',
                        'arrivalFlightFromCity', 'arrivalFlightToCity', 'arrivalFlightTakeOffTime', 'arrivalFlightLandingTime'
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

        const flightGroups = groupCustomersByFlight(voucher.customers, departureFlight, arrivalFlight);
        const requestedGroup = findRequestedFlightGroup(flightGroups, req.query.group);
        const customersForRender = requestedGroup?.customers || voucher.customers;

        const passengerFlightData = buildPassengerFlightData(
            customersForRender,
            departureFlight,
            arrivalFlight
        );

        // ================= Customers =================

        const formattedCustomers = customersForRender.map(c => {

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
                pnr: c.customerPNR,
                departureFlight: { date: c.departureFlightDate?.toISOString().split('T')[0], flightNo: c.departureFlightNo, fromCity: c.departureFlightFromCity, toCity: c.departureFlightToCity, takeoff: c.departureFlightTakeOffTime, landing: c.departureFlightLandingTime },
                arrivalFlight: { date: c.arrivalFlightDate?.toISOString().split('T')[0], flightNo: c.arrivalFlightNo, fromCity: c.arrivalFlightFromCity, toCity: c.arrivalFlightToCity, takeoff: c.arrivalFlightTakeOffTime, landing: c.arrivalFlightLandingTime }
            };
        });

        // ================= Family Head =================

        const maleCustomer = customersForRender.find(
            c => c.customerGender?.toLowerCase() === "male"
        );

        const familyHead = maleCustomer
            ? maleCustomer.customerName
            : customersForRender[0]?.customerName || "";

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

        const qrImage = await generateVoucherQr(
            voucher.id,
            requestedGroup?.customerIds || []
        );

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
                date: voucher.departureFlightDate?.toISOString().split('T')[0] || voucher.createdAt?.toISOString().split('T')[0],
                package: voucher.packageNumber,
                packageType: voucher.packageName
            },

            customers: formattedCustomers,
            hotels: formattedHotels,
            transports: formattedTransports,
            notes: formattedNotes,
            theme: getVoucherTheme(voucher.linkTheme),
            urduFontData: getUrduFontData(),
            passengerFlights: passengerFlightData.passengerFlights,
            departureFlight: passengerFlightData.departureFlight,
            arrivalFlight: passengerFlightData.arrivalFlight,
            qrImage,
            pdfUrl: `/voucher/download/${voucher.id}?view=1${requestedGroup ? `&group=${encodeURIComponent(requestedGroup.customerIds.join(','))}` : ''}`,
            verifiedImage: getVerifiedImagePath(voucher.linkVoucherFormat?.ejsPath)
        });

    } catch (err) {
        next(err);
    }
}

module.exports = getVoucherTemplate;
