const { Op } = require('sequelize');
const { vouchers, customers } = require('../../database/models');

function getPassengerName(customerList = []) {
  if (!customerList.length) return '';

  const familyHead = customerList.find(
    (customer) => customer.customerGender?.toLowerCase() === 'male'
  );

  return (familyHead || customerList[0]).customerName || '';
}

const listVouchersController = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const search = String(req.query.search || '').trim();

    const where = {};

    if (search) {
      const matchingCustomers = await customers.findAll({
        attributes: ['voucherId'],
        where: {
          customerName: {
            [Op.like]: `%${search}%`
          }
        },
        raw: true
      });

      const matchingVoucherIds = [
        ...new Set(matchingCustomers.map((customer) => customer.voucherId).filter(Boolean))
      ];

      where[Op.or] = [
        {
          voucherNo: {
            [Op.like]: `%${search}%`
          }
        },
        {
          id: {
            [Op.in]: matchingVoucherIds.length ? matchingVoucherIds : [0]
          }
        }
      ];
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
      include: [
        {
          model: customers,
          as: 'customers',
          attributes: ['id', 'customerName', 'customerGender'],
          required: false,
          separate: true,
          order: [['id', 'ASC']]
        }
      ],
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
      passengerName: getPassengerName(v.customers),
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
