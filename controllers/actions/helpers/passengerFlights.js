'use strict';

function hasPassengerFlight(customer = {}) {
  return [
    'departureFlightDate', 'departureFlightNo', 'departureFlightFromCity',
    'departureFlightToCity', 'departureFlightTakeOffTime', 'departureFlightLandingTime',
    'arrivalFlightDate', 'arrivalFlightNo', 'arrivalFlightFromCity',
    'arrivalFlightToCity', 'arrivalFlightTakeOffTime', 'arrivalFlightLandingTime'
  ].some(field => customer[field] !== null && customer[field] !== undefined && customer[field] !== '');
}

function normalizeFlightValue(field, value) {
  if (value === null || value === undefined || value === '') return '';

  if (field.endsWith('Date')) {
    if (value instanceof Date) return value.toISOString().split('T')[0];
    return String(value).split('T')[0];
  }

  if (field.endsWith('Time')) {
    return String(value).slice(0, 5);
  }

  return value;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function valuesFor(customers, field, fallback) {
  const values = customers
    .filter(hasPassengerFlight)
    .map(customer => normalizeFlightValue(field, customer[field]))
    .filter(value => value !== null && value !== undefined && value !== '');

  return values.length ? values.join(' / ') : fallback || '';
}

function buildPassengerFlightData(customers = [], departureFallback = {}, arrivalFallback = {}) {
  const passengerRows = customers.map(customer => ({
    passengerName: customer.customerName,
    departureFlight: {
      date: normalizeFlightValue('departureFlightDate', customer.departureFlightDate) || departureFallback.date || '',
      flightNo: normalizeFlightValue('departureFlightNo', customer.departureFlightNo) || departureFallback.flightNo || '',
      fromCity: normalizeFlightValue('departureFlightFromCity', customer.departureFlightFromCity) || departureFallback.fromCity || '',
      toCity: normalizeFlightValue('departureFlightToCity', customer.departureFlightToCity) || departureFallback.toCity || '',
      takeoff: normalizeFlightValue('departureFlightTakeOffTime', customer.departureFlightTakeOffTime) || departureFallback.takeoff || '',
      landing: normalizeFlightValue('departureFlightLandingTime', customer.departureFlightLandingTime) || departureFallback.landing || ''
    },
    arrivalFlight: {
      date: normalizeFlightValue('arrivalFlightDate', customer.arrivalFlightDate) || arrivalFallback.date || '',
      flightNo: normalizeFlightValue('arrivalFlightNo', customer.arrivalFlightNo) || arrivalFallback.flightNo || '',
      fromCity: normalizeFlightValue('arrivalFlightFromCity', customer.arrivalFlightFromCity) || arrivalFallback.fromCity || '',
      toCity: normalizeFlightValue('arrivalFlightToCity', customer.arrivalFlightToCity) || arrivalFallback.toCity || '',
      takeoff: normalizeFlightValue('arrivalFlightTakeOffTime', customer.arrivalFlightTakeOffTime) || arrivalFallback.takeoff || '',
      landing: normalizeFlightValue('arrivalFlightLandingTime', customer.arrivalFlightLandingTime) || arrivalFallback.landing || ''
    }
  }));

  if (!passengerRows.length) {
    return {
      passengerFlights: [],
      passengerFlightDisplay: {
        departureFlight: buildDisplayFlight([], 'departureFlight', departureFallback),
        arrivalFlight: buildDisplayFlight([], 'arrivalFlight', arrivalFallback)
      },
      departureFlight: departureFallback,
      arrivalFlight: arrivalFallback
    };
  }

  return {
    passengerFlights: passengerRows,
    passengerFlightDisplay: {
      departureFlight: buildDisplayFlight(passengerRows, 'departureFlight', departureFallback),
      arrivalFlight: buildDisplayFlight(passengerRows, 'arrivalFlight', arrivalFallback)
    },
    departureFlight: {
      flightNo: valuesFor(customers, 'departureFlightNo', departureFallback.flightNo),
      date: valuesFor(customers, 'departureFlightDate', departureFallback.date),
      fromCity: valuesFor(customers, 'departureFlightFromCity', departureFallback.fromCity),
      toCity: valuesFor(customers, 'departureFlightToCity', departureFallback.toCity),
      takeoff: valuesFor(customers, 'departureFlightTakeOffTime', departureFallback.takeoff),
      landing: valuesFor(customers, 'departureFlightLandingTime', departureFallback.landing)
    },
    arrivalFlight: {
      flightNo: valuesFor(customers, 'arrivalFlightNo', arrivalFallback.flightNo),
      date: valuesFor(customers, 'arrivalFlightDate', arrivalFallback.date),
      fromCity: valuesFor(customers, 'arrivalFlightFromCity', arrivalFallback.fromCity),
      toCity: valuesFor(customers, 'arrivalFlightToCity', arrivalFallback.toCity),
      takeoff: valuesFor(customers, 'arrivalFlightTakeOffTime', arrivalFallback.takeoff),
      landing: valuesFor(customers, 'arrivalFlightLandingTime', arrivalFallback.landing)
    }
  };
}

function buildDisplayFlight(rows, direction, fallback) {
  const fields = ['flightNo', 'date', 'fromCity', 'toCity', 'takeoff', 'landing'];
  const display = {};

  for (const field of fields) {
    const lines = rows.map(row => {
      const flight = row[direction] || {};
      const value = flight[field] || '';
      const label = escapeHtml(row.passengerName || 'Passenger');
      return `${label}: ${escapeHtml(value)}`.trim();
    });
    display[field] = (lines.length ? lines : [escapeHtml(fallback[field] || '')]).join('<br>');
  }

  const sectorLines = rows.map(row => {
    const flight = row[direction] || {};
    const label = escapeHtml(row.passengerName || 'Passenger');
    return `${label}: ${escapeHtml(flight.fromCity || '')} - ${escapeHtml(flight.toCity || '')}`;
  });
  display.sector = (sectorLines.length ? sectorLines : [escapeHtml(`${fallback.fromCity || ''} - ${fallback.toCity || ''}`)]).join('<br>');

  return display;
}

module.exports = { buildPassengerFlightData };
