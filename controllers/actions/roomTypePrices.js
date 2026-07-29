require('dotenv').config();

const { roomTypePrices } = require('../../database/models');

async function upsertRoomTypePriceController(req, res, next) {
  try {
    const roomType = req.body.roomType?.trim();
    const price = Number(req.body.price);

    if (!roomType || Number.isNaN(price) || price < 0) {
      return res.status(400).send('Invalid room type or price');
    }

    await roomTypePrices.upsert({ roomType, price: Math.round(price) });
    return res.redirect('/room-type-prices');
  } catch (error) {
    next(error);
  }
}

async function deleteRoomTypePriceController(req, res, next) {
  try {
    await roomTypePrices.destroy({ where: { id: req.params.id } });
    return res.redirect('/room-type-prices');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  deleteRoomTypePriceController,
  upsertRoomTypePriceController
};
