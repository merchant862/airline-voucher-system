'use strict';

const { vouchers, customers, appSettings } = require('../database/models');

const SETTING_KEY = 'voucherExpiryHoursAfterDeparture';
const DEFAULT_EXPIRY_HOURS = 24;
const CHECK_INTERVAL_MS = 60 * 1000;

function dateParts(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) };
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return { year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() };
}

function departureDate(dateValue, timeValue) {
  const parts = dateParts(dateValue);
  if (!parts) return null;

  const time = String(timeValue || '00:00:00').split(':');
  const hour = Number(time[0]) || 0;
  const minute = Number(time[1]) || 0;
  const second = Number.parseInt(time[2], 10) || 0;
  const result = new Date(parts.year, parts.month, parts.day, hour, minute, second, 0);
  return Number.isNaN(result.getTime()) ? null : result;
}

async function getExpiryHours() {
  const setting = await appSettings.findOne({ where: { key: SETTING_KEY } });
  const value = Number(setting?.value);
  return Number.isFinite(value) && value >= 0 ? value : DEFAULT_EXPIRY_HOURS;
}

function getVoucherDeparture(voucher) {
  const firstPassengerDeparture = (voucher.customers || [])
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((customer) => departureDate(customer.departureFlightDate, customer.departureFlightTakeOffTime))
    .find(Boolean);

  return firstPassengerDeparture || departureDate(voucher.departureFlightDate, voucher.departureFlightTakeOffTime);
}

async function expireVouchers() {
  const hours = await getExpiryHours();
  const now = new Date();
  const activeVouchers = await vouchers.findAll({
    where: { status: 'active' },
    attributes: ['id', 'voucherNo', 'departureFlightDate', 'departureFlightTakeOffTime'],
    include: [{
      model: customers,
      as: 'customers',
      attributes: ['id', 'departureFlightDate', 'departureFlightTakeOffTime'],
      required: false
    }]
  });

  for (const voucher of activeVouchers) {
    const departure = getVoucherDeparture(voucher);
    if (!departure) continue;

    const expiresAt = new Date(departure.getTime() + (hours * 60 * 60 * 1000));
    if (expiresAt <= now) {
      await voucher.update({ status: 'inactive' });
      console.log(`Voucher ${voucher.voucherNo || voucher.id} expired automatically after departure.`);
    }
  }
}

module.exports = { expireVouchers, CHECK_INTERVAL_MS };
