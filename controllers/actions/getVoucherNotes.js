const { notes } = require('./../../database/models');

async function getNotesByVoucherController(req, res, next) {
  try {

    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid voucherId'
      });
    }

    const noteList = await notes.findAll({
      where: { voucherId : id },
      attributes: [
        'id',
        'content',
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: noteList.length,
      data: noteList
    });

  } catch (error) {
    next(error);
  }
}

module.exports = getNotesByVoucherController;