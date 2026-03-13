const { Op } = require('sequelize');
const { vouchers } = require('../../database/models');

const listVouchersController = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const search = String(req.query.search || '').trim();

    const where = {};

    if (search) {
      where.voucherNo = {
        [Op.like]: `%${search}%`
      };
    }

    // ==============================
    // 1️⃣ COUNTS
    // ==============================
    const totalVouchers = await vouchers.count({ where });

    const activeCount = await vouchers.count({
      where: {
        ...where,
        status: 'active'
      }
    });

    const inactiveCount = await vouchers.count({
      where: {
        ...where,
        status: 'inactive'
      }
    });

    // ==============================
    // 2️⃣ FETCH PAGINATED DATA
    // ==============================
    const voucherList = await vouchers.findAll({
      attributes: ['id', 'voucherNo', 'status', 'createdAt'],
      where,
      order: [
        ['status', 'ASC'],
        ['createdAt', 'DESC']
      ],
      limit: pageSize,
      offset
    });

    const formatted = voucherList.map((v) => ({
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