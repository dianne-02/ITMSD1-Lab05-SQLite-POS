// Immutable sample catalog used for selection UIs.
// Bookings/payments/wallet/products are persisted via SQLite.

export const DRIVERS = [
  { id: 'wilbert', name: 'Kuya Wilbert', seats: 5, eta: '3 min away', fare: 55, vehicle: 'Toyota Vios (white)', plate: 'DAV 4821', rating: 4.9 },
  { id: 'gabo', name: 'Gabo', seats: 5, eta: '9 min away', fare: 50, vehicle: 'Honda Brio (silver)', plate: 'DAV 4410', rating: 4.7 },
  { id: 'jungkook', name: 'Angkol Jungkook', seats: 5, eta: '7 min away', fare: 60, vehicle: 'Toyota Wigo (blue)', plate: 'DAV 9021', rating: 4.8 },
  { id: 'tanggol', name: 'Tanggol', seats: 5, eta: '9 min away', fare: 70, vehicle: 'Mitsubishi Mirage (red)', plate: 'DAV 7734', rating: 4.6 },
];

export const RIDE_TYPES = [
  { id: 'standard', name: 'BAO BAO Standard', description: 'Affordable everyday rides', multiplier: 1.0 },
  { id: 'comfort', name: 'BAO BAO Comfort', description: 'Newer cars, extra legroom', multiplier: 1.3 },
  { id: 'premium', name: 'BAO BAO Premium', description: 'Top-rated drivers, newest units', multiplier: 1.8 },
];

export const LOCATIONS = [
  { id: 'dorsu', label: 'DOrSU Main Campus', latitude: 7.1319, longitude: 126.2139 },
  { id: 'dahican', label: 'Dahican Beach', latitude: 7.0726, longitude: 126.2247 },
  { id: 'maticity', label: 'Mati City', latitude: 7.1092, longitude: 126.2163 },
  { id: 'matihall', label: 'Mati City Hall', latitude: 7.1107, longitude: 126.218 },
  { id: 'matiport', label: 'Mati Port', latitude: 7.0958, longitude: 126.2147 },
  { id: 'park', label: 'Mati Park', latitude: 7.108, longitude: 126.2145 },
  { id: 'home', label: 'Home', latitude: 7.1107, longitude: 126.218 },
  { id: 'work', label: 'Work', latitude: 7.0726, longitude: 126.2247 },
];

export const TIME_SLOTS = ['4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'];

const ROUTE_FARES = {
  'dorsu>dahican': 240,
  'dahican>dorsu': 240,
  'dorsu>matihall': 80,
  'matihall>dorsu': 80,
  'dorsu>maticity': 90,
  'maticity>dorsu': 90,
  'matihall>dahican': 150,
  'dahican>matihall': 150,
  'dorsu>park': 60,
  'park>dorsu': 60,
};

export function calculateFare(pickup, destination, rideType) {
  const key = `${pickup.id}>${destination.id}`;
  const base = ROUTE_FARES[key] != null ? ROUTE_FARES[key] : 100;
  const mult = rideType && rideType.multiplier ? rideType.multiplier : 1;
  return Math.round(base * mult);
}

export function findById(list, id) {
  return list.find((x) => x.id === id) || null;
}
