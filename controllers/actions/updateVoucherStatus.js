const { vouchers } = require('../../database/models');

async function updateVoucherStatusController(req, res, next) {
  try {
    const { id, status } = req.params;

    // ✅ Validate status
    const allowedStatus = ['active', 'inactive'];

    if (!allowedStatus.includes(status)) {
      return res.redirect('/dashboard');
    }

    // ✅ Find voucher
    const voucher = await vouchers.findByPk(id);

    if (!voucher) {
      return res.redirect('/dashboard');
    }

    // ✅ Update status
    await voucher.update({ status });

    return res.redirect('/dashboard');

  } catch (err) {
    next(err);
  }
}

module.exports = updateVoucherStatusController;