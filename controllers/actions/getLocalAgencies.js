const fs = require('fs').promises;
const path = require('path');
const { agencies, foreignAgencies } = require('./../../database/models');

async function getAgenciesController(req, res, next) {
  try {

    const type = req.params.type; // local | foreign

    let Model;

    if (type === 'local') {
      Model = agencies;
    } 
    else if (type === 'foreign') {
      Model = foreignAgencies;
    } 
    else {
      return res.status(400).json({
        success: false,
        message: 'Invalid agency type. Use "local" or "foreign".'
      });
    }

    const agencyList = await Model.findAll({
      attributes: ['id', 'name', 'image'],
      order: [['name', 'ASC']]
    });

    const formatted = await Promise.all(
      agencyList.map(async (agency) => {

        let base64Image = null;

        if (agency.image) {
          try {
            const imagePath = path.join(process.cwd(), agency.image);
            const file = await fs.readFile(imagePath);
            const ext = path.extname(imagePath).replace('.', '');

            base64Image = `data:image/${ext};base64,${file.toString('base64')}`;

          } catch (err) {
            console.error(`Image read error for agency ${agency.id}:`, err.message);
          }
        }

        return {
          id: agency.id,
          name: agency.name,
          image: base64Image
        };
      })
    );

    return res.status(200).json({
      success: true,
      type,
      count: formatted.length,
      data: formatted
    });

  } catch (error) {
    next(error);
  }
}

module.exports = getAgenciesController;
