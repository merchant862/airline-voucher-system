const { transportsList, hotelsList } = require('./../../database/models');

async function getTransportsandHotels(req, res, next) {
  try {

    const type = req.params.type; // local | foreign

    let Model;

    if (type === 'hotels') {
      Model = hotelsList;
    } 
    else if (type === 'transports') {
      Model = transportsList;
    } 
    else {
      return res.status(400).json({
        success: false,
        message: 'Invalid service type. Use "transports" or "hotels".'
      });
    }

    const agencyList = await Model.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    return res.status(200).json({
      success: true,
      type,
      count: agencyList.length,
      data: agencyList
    });

  } catch (error) {
    next(error);
  }
}

module.exports = getTransportsandHotels;
