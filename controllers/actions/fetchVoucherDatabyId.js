const { 
    vouchers, 
    customers, 
    hotels, 
    transports, 
    notes, 
    agencies, 
    foreignAgencies, 
    voucherFormats 
} = require('../../database/models');

async function getVoucherWithFullRelations(req, res, next) {
    const voucherId = req.params.id;

    try {
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

        if (!voucherData) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        res.json(voucherData);

    } catch (err) {
        next(err);
    }
}

module.exports = getVoucherWithFullRelations;