const { customers } = require('./../../database/models');

async function getCustomersByVoucherController(req, res, next) {
  try {

    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid voucherId'
      });
    }

    const customerList = await customers.findAll({
      where: { voucherId : id },
      attributes: [
        'id',
        'customerName',
        'customerPassport',
        'customerVisa',
        'customerGender',
        'customerPNR'
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: customerList.length,
      data: customerList
    });

  } catch (error) {
    next(error);
  }
}

module.exports = getCustomersByVoucherController;
