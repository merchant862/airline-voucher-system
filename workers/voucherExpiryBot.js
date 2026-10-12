'use strict';

require('dotenv').config();

const { expireVouchers, CHECK_INTERVAL_MS } = require('../services/voucherExpiryScheduler');

let running = false;

async function tick() {
  if (running) return;
  running = true;

  try {
    await expireVouchers();
  } catch (error) {
    console.error('Voucher expiry bot error:', error);
  } finally {
    running = false;
  }
}

void tick();
const timer = setInterval(tick, CHECK_INTERVAL_MS);

function shutdown(signal) {
  clearInterval(timer);
  console.log(`Voucher expiry bot stopped (${signal}).`);
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

console.log(`Voucher expiry bot started; checking every ${CHECK_INTERVAL_MS / 1000} seconds.`);
