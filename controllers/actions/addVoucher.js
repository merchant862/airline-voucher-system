const { vouchers, customers, hotels, transports, notes } = require('./../../database/models');

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
        voucherFormatsId:1,
        companyId: 64,
        foreignCompanyId:7,
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

    return res.status(201).json(
    {
        success: true,
        message: 'Voucher created successfully',
        voucherId
    });

} 

catch (error) 
{
    await t.rollback();
    next(error);
}
}
module.exports = addVoucherController

