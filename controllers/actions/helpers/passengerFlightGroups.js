'use strict';

const FLIGHT_FIELDS = [
  'departureFlightDate', 'departureFlightNo', 'departureFlightFromCity',
  'departureFlightToCity', 'departureFlightTakeOffTime', 'departureFlightLandingTime',
  'arrivalFlightDate', 'arrivalFlightNo', 'arrivalFlightFromCity',
  'arrivalFlightToCity', 'arrivalFlightTakeOffTime', 'arrivalFlightLandingTime'
];

function normalize(value, field) {
  if (value === null || value === undefined || value === '') return '';
  const text = String(value);
  if (field.endsWith('Date')) return text.split('T')[0];
  if (field.endsWith('Time')) return text.slice(0, 5);
  return text.trim().toUpperCase();
}

function flightGroupKey(customer, departureFallback = {}, arrivalFallback = {}) {
  const fallback = {
    departureFlightDate: departureFallback.date,
    departureFlightNo: departureFallback.flightNo,
    departureFlightFromCity: departureFallback.fromCity,
    departureFlightToCity: departureFallback.toCity,
    departureFlightTakeOffTime: departureFallback.takeoff,
    departureFlightLandingTime: departureFallback.landing,
    arrivalFlightDate: arrivalFallback.date,
    arrivalFlightNo: arrivalFallback.flightNo,
    arrivalFlightFromCity: arrivalFallback.fromCity,
    arrivalFlightToCity: arrivalFallback.toCity,
    arrivalFlightTakeOffTime: arrivalFallback.takeoff,
    arrivalFlightLandingTime: arrivalFallback.landing
  };

  return FLIGHT_FIELDS
    .map(field => normalize(customer[field] || fallback[field], field))
    .join('|');
}

function groupCustomersByFlight(customers = [], departureFallback = {}, arrivalFallback = {}) {
  const groups = new Map();

  for (const customer of customers) {
    const key = flightGroupKey(customer, departureFallback, arrivalFallback);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(customer);
  }

  return [...groups.entries()].map(([key, groupCustomers]) => ({
    key,
    customers: groupCustomers,
    customerIds: groupCustomers.map(customer => String(customer.id)).sort()
  }));
}

function findRequestedFlightGroup(groups, rawGroup) {
  if (!rawGroup) return null;
  const requestedIds = String(rawGroup)
    .split(',')
    .map(id => id.trim())
    .filter(id => /^\d+$/.test(id))
    .sort();

  if (!requestedIds.length) return null;
  return groups.find(group => group.customerIds.join(',') === requestedIds.join(',')) || null;
}

module.exports = { groupCustomersByFlight, findRequestedFlightGroup };
