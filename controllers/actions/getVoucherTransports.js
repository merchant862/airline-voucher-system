const { transports } = require('./../../database/models');

async function getTransportsByVoucherController(req, res, next) {
  try {

    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid voucherId'
      });
    }

    const transportList = await transports.findAll({
      where: { voucherId : id },
      attributes: [
        'id',
        'type',
        'route'
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: transportList.length,
      data: transportList
    });

  } catch (error) {
    next(error);
  }
}

module.exports = getTransportsByVoucherController;