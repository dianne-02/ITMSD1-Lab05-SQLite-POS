// Sample locations used across the BAO BAO prototype.
// Coordinates are approximate real-world points in Mati City / Davao Oriental.
export const MATI_CITY = { latitude: 7.1092, longitude: 126.2163 };

export const LOCATIONS = {
  DORSU_MAIN_CAMPUS: {
    id: 'dorsu',
    label: 'DOrSU Main Campus',
    latitude: 7.1319,
    longitude: 126.2139,
  },
  DAHICAN_BEACH: {
    id: 'dahican',
    label: 'Dahican Beach',
    latitude: 7.0726,
    longitude: 126.2247,
  },
  MATI_CITY_HALL: {
    id: 'matihall',
    label: 'Mati City Hall',
    latitude: 7.1107,
    longitude: 126.218,
  },
  MATI_PORT: {
    id: 'port',
    label: 'Mati Port',
    latitude: 7.0958,
    longitude: 126.2147,
  },
};

export const SAVED_PLACES = {
  Home: { label: 'Home', address: 'Gov. Pacana St, Mati City', ...LOCATIONS.MATI_CITY_HALL },
  Work: { label: 'Work', address: 'Dahican Rd, Mati City', ...LOCATIONS.DAHICAN_BEACH },
};

export const DESTINATION_SUGGESTIONS = [
  LOCATIONS.DAHICAN_BEACH,
  LOCATIONS.DORSU_MAIN_CAMPUS,
  LOCATIONS.MATI_CITY_HALL,
  LOCATIONS.MATI_PORT,
];
