// GET /api/voucher/template/:id
const { voucherFormats } = require('./../../database/models');
const path = require('path');

async function getVoucherTemplate(req, res, next) {
    try {
        const format = await voucherFormats.findByPk(req.params.id);
        if(!format) return res.status(404).send('Format not found');

        // render ejs file and return html
        res.render(path.join(__dirname, '../../', format.ejsPath), {
            // sample data for preview
            sampleVoucher: {
                voucherNo: 'UB-123456',
                customerName: ['John Doe'],
                hotelName: ['Sample Hotel'],
                transportRoute: ['Airport Pickup'],
            }
        });
    } catch(err) { next(err); }
}

module.exports = getVoucherTemplate;