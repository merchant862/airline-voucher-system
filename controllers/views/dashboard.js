require('dotenv').config();

const { appSettings } = require('../../database/models');

const SETTING_KEY = 'voucherExpiryHoursAfterDeparture';

async function dashboardViewController(req, res, next) 
{
    try {
        const [setting] = await appSettings.findOrCreate({
            where: { key: SETTING_KEY },
            defaults: { value: '24' }
        });

        return res.status(200).render(`../views/dashboard.ejs`, {
            admin: req.user,
            expiryHours: Number(setting.value) || 24,
            saved: req.query.saved === '1',
            settingsError: req.query.error || ''
        });
    }
    catch(error){ next(error) }
}

module.exports = dashboardViewController
