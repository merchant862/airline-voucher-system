// controllers/voucherController.js
const { vouchers, customers, hotels, transports, notes } = require('../../database/models');

// Render the Edit Voucher page
async function renderEditVoucher(req, res, next) {
    const voucherId = req.params.id;

    try {
        const voucherData = await vouchers.findOne({
            where: { id: voucherId },
            include: [
                { model: customers, as: 'customers' },
                { model: hotels, as: 'hotels' },
                { model: transports, as: 'transports' },
                { model: notes, as: 'notes' }
            ]
        });

        if (!voucherData) {
            return res.status(404).send('Voucher not found');
        }

        // Render the EJS and send voucherData
        res.render('../views/voucher_update.ejs', { voucherData }); 
    } catch (err) {
        next(err);
    }
}

module.exports = renderEditVoucher ;