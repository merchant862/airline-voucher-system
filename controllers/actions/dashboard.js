const { vouchers } = require('../../database/models');

const listVouchersController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    // total vouchers
    const totalVouchers = await vouchers.count();

    // fetch vouchers with limit and offset
    const voucherList = await vouchers.findAll({
      attributes: ['voucherNo', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset
    });

    const formatted = voucherList.map(v => ({
      voucherNo: v.voucherNo,
      voucherDate: v.createdAt.toISOString().split('T')[0] // YYYY-MM-DD
    }));

    res.json({
      success: true,
      totalVouchers,   // ✅ total vouchers count
      page,
      pageSize,
      vouchers: formatted
    });

  } catch (err) {
    next(err);
  }
};

module.exports = listVouchersController;
