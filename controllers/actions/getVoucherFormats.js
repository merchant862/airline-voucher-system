const { voucherFormats } = require('./../../database/models');

async function getVoucherFormatsByVoucherController(req, res, next) {
  try {

    const where = req.params.name === 'LINK_FORMAT'
      ? undefined
      : { name: 'DOWNLOAD_FORMAT' };

    const voucherFormatList = await voucherFormats.findAll({
      where,
      attributes: [
        'id',
        'ejsPath',
        'name'
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
