const { hotels } = require('./../../database/models');

async function getHotelsByVoucherController(req, res, next) {
  try {

    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid voucherId'
      });
    }

    const hotelList = await hotels.findAll({
      where: { voucherId : id },
      attributes: [
        'id',
        'hotelName',
        'confirmationNo',
        'city',
        'roomType',
        'mealPlan',
        'checkInDate',
        'checkOutDate',
        'noOfNights'
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: hotelList.length,
      data: hotelList
    });

  } catch (error) {
    next(error);
  }
}

module.exports = getHotelsByVoucherController;