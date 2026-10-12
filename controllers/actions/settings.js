require('dotenv').config();

const { appSettings } = require('../../database/models');

const SETTING_KEY = 'voucherExpiryHoursAfterDeparture';

async function updateSettingsController(req, res, next) {
  try {
    const expiryHours = Number(req.body.expiryHours);

    if (!Number.isFinite(expiryHours) || expiryHours < 0 || expiryHours > 720) {
      return res.redirect('/dashboard?error=Enter%20hours%20between%200%20and%20720');
    }

    const [setting] = await appSettings.findOrCreate({
      where: { key: SETTING_KEY },
      defaults: { value: String(expiryHours) }
    });

    await setting.update({ value: String(expiryHours) });
    return res.redirect('/dashboard?saved=1');
  } catch (error) {
    next(error);
  }
}

module.exports = updateSettingsController;
