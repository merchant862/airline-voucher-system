const { vouchers } = require('../../database/models');

const listVouchersController = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    // ==============================
    // 1️⃣ COUNTS
    // ==============================

    const totalVouchers = await vouchers.count();

    const activeCount = await vouchers.count({
      where: { status: 'active' }
    });

    const inactiveCount = await vouchers.count({
      where: { status: 'inactive' }
    });

    // ==============================
    // 2️⃣ FETCH PAGINATED DATA
    // ==============================

    const voucherList = await vouchers.findAll({
      attributes: ['id', 'voucherNo', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset
    });

    const formatted = voucherList.map(v => ({
      id: v.id,
      voucherNo: v.voucherNo,
      status: v.status,
      voucherDate: v.createdAt.toISOString().split('T')[0]
    }));

    // ==============================
    // 3️⃣ RESPONSE
    // ==============================

    res.json({
      success: true,

      totalVouchers,
      activeCount,
      inactiveCount,

      page,
      pageSize,
      vouchers: formatted
    });

  } catch (err) {
    next(err);
  }
};

module.exports = listVouchersController;