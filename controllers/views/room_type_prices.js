require('dotenv').config();

const { roomTypePrices } = require('../../database/models');

async function roomTypePricesViewController(req, res, next) {
  try {
    const prices = await roomTypePrices.findAll({ order: [['roomType', 'ASC']] });
    return res.status(200).render('../views/room_type_prices.ejs', { prices });
  } catch (error) {
    next(error);
  }
}

module.exports = roomTypePricesViewController;
