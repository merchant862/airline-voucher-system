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

function valuesFor(customers, field, fallback) {
  const values = customers
    .filter(hasPassengerFlight)
    .map(customer => normalizeFlightValue(field, customer[field]))
    .filter(value => value !== null && value !== undefined && value !== '');

  return values.length ? values.join(' / ') : fallback || '';
}

function buildPassengerFlightData(customers = [], departureFallback = {}, arrivalFallback = {}) {
  const passengerRows = customers.filter(hasPassengerFlight).map(customer => ({
    passengerName: customer.customerName,
    departureFlight: {
      date: normalizeFlightValue('departureFlightDate', customer.departureFlightDate),
      flightNo: normalizeFlightValue('departureFlightNo', customer.departureFlightNo),
      fromCity: normalizeFlightValue('departureFlightFromCity', customer.departureFlightFromCity),
      toCity: normalizeFlightValue('departureFlightToCity', customer.departureFlightToCity),
      takeoff: normalizeFlightValue('departureFlightTakeOffTime', customer.departureFlightTakeOffTime),
      landing: normalizeFlightValue('departureFlightLandingTime', customer.departureFlightLandingTime)
    },
    arrivalFlight: {
      date: normalizeFlightValue('arrivalFlightDate', customer.arrivalFlightDate),
      flightNo: normalizeFlightValue('arrivalFlightNo', customer.arrivalFlightNo),
      fromCity: normalizeFlightValue('arrivalFlightFromCity', customer.arrivalFlightFromCity),
      toCity: normalizeFlightValue('arrivalFlightToCity', customer.arrivalFlightToCity),
      takeoff: normalizeFlightValue('arrivalFlightTakeOffTime', customer.arrivalFlightTakeOffTime),
      landing: normalizeFlightValue('arrivalFlightLandingTime', customer.arrivalFlightLandingTime)
    }
  }));

  if (!passengerRows.length) {
    return {
      passengerFlights: [],
      departureFlight: departureFallback,
      arrivalFlight: arrivalFallback
    };
  }

  return {
    passengerFlights: passengerRows,
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

module.exports = { buildPassengerFlightData };
