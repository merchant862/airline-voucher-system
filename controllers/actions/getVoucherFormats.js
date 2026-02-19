const { voucherFormats } = require('./../../database/models');

async function getVoucherFormatsByVoucherController(req, res, next) {
  try {

    const voucherFormatList = await voucherFormats.findAll({
      attributes: [
        'id',
        'ejsPath'
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: voucherFormatList.length,
      data: voucherFormatList
    });

  } catch (error) {
    next(error);
  }
}

module.exports = getVoucherFormatsByVoucherController;