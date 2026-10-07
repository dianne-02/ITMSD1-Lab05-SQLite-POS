import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  onboardingCompleted: '@baobao/onboardingCompleted',
  profile: '@baobao/profile',
  rides: '@baobao/rides',
  paymentMethods: '@baobao/paymentMethods',
  settings: '@baobao/settings',
  promo: '@baobao/promo',
  recents: '@baobao/recents',
};

async function getJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function setJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — non-fatal for prototype */
  }
}

export const DEFAULT_PROFILE = { name: 'Aira Mae Tabudlong', phone: '+63 912 345 6789' };
export const DEFAULT_SETTINGS = { notifications: true, location: true, appearance: 'Light', about: 'BAO BAO v1.0.0' };
export const DEFAULT_PAYMENT_METHODS = [{ id: '1', brand: 'BAO PAY', last4: '4821', label: 'Primary' }];

export async function loadOnboarding() {
  return (await AsyncStorage.getItem(KEYS.onboardingCompleted)) === 'true';
}
export async function saveOnboarding(done) {
  await AsyncStorage.setItem(KEYS.onboardingCompleted, done ? 'true' : 'false');
}

export const loadProfile = () => getJSON(KEYS.profile, DEFAULT_PROFILE);
export const saveProfile = (p) => setJSON(KEYS.profile, p);

export const loadRides = () =>
  getJSON(KEYS.rides, [
    { id: 'seed1', date: 'Oct 9, 2026', route: 'DOrSU — Dahican Beach', fare: 240, status: 'Completed' },
    { id: 'seed2', date: 'Oct 6, 2026', route: 'Home — Mati City Hall', fare: 180, status: 'Completed' },
  ]);
export const saveRides = (rides) => setJSON(KEYS.rides, rides);

export const loadPaymentMethods = () => getJSON(KEYS.paymentMethods, DEFAULT_PAYMENT_METHODS);
export const savePaymentMethods = (m) => setJSON(KEYS.paymentMethods, m);

export const loadSettings = () => getJSON(KEYS.settings, DEFAULT_SETTINGS);
export const saveSettings = (s) => setJSON(KEYS.settings, s);

export const loadPromo = () => getJSON(KEYS.promo, { code: '', applied: false });
export const savePromo = (p) => setJSON(KEYS.promo, p);

export const loadRecents = () => getJSON(KEYS.recents, []);
export const saveRecents = (r) => setJSON(KEYS.recents, r);
