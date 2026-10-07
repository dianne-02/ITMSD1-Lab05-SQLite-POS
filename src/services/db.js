import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('bao_bao.db');

export function initDatabase() {
  db.execSync('PRAGMA journal_mode = WAL;');
  db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    );
  `);
  db.execSync(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pickup TEXT NOT NULL,
      destination TEXT NOT NULL,
      ride_type TEXT NOT NULL,
      driver_id TEXT,
      driver_name TEXT NOT NULL,
      ride_date TEXT NOT NULL,
      pickup_time TEXT NOT NULL,
      fare REAL NOT NULL,
      payment_method TEXT,
      payment_status TEXT NOT NULL,
      booking_status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  db.execSync(`
    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      balance REAL NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  db.execSync(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  db.execSync('CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);');
  db.execSync('CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(ride_date);');

  // Seed products
  const p = db.getFirstSync('SELECT COUNT(*) as count FROM products;');
  if (p.count === 0) {
    const seed = [
      ['Bao Bao Ride Pass', 'Ride', 55.0, 20],
      ['DOrSU Main Campus Ride', 'Route', 40.0, 30],
      ['Dahican Beach Ride', 'Route', 120.0, 15],
      ['Mati City Ride', 'Route', 80.0, 25],
    ];
    for (const [name, category, price, stock] of seed) {
      db.runSync('INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);', [
        name,
        category,
        price,
        stock,
      ]);
    }
  }

  // Seed wallet
  const w = db.getFirstSync('SELECT COUNT(*) as count FROM wallet;');
  if (w.count === 0) {
    db.runSync('INSERT INTO wallet (balance, updated_at) VALUES (?, ?);', [1000, new Date().toISOString()]);
  }

  // Seed a couple of completed bookings so History isn't empty
  const b = db.getFirstSync('SELECT COUNT(*) as count FROM bookings;');
  if (b.count === 0) {
    db.runSync(
      'INSERT INTO bookings (pickup, destination, ride_type, driver_id, driver_name, ride_date, pickup_time, fare, payment_method, payment_status, booking_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      ['DOrSU Main Campus', 'Dahican Beach', 'BAO BAO Standard', 'wilbert', 'Kuya Wilbert', 'Oct 9, 2026', '4:30 PM', 240, 'E-Wallet', 'PAID', 'COMPLETED', new Date().toISOString()]
    );
    db.runSync(
      'INSERT INTO bookings (pickup, destination, ride_type, driver_id, driver_name, ride_date, pickup_time, fare, payment_method, payment_status, booking_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      ['Home', 'Mati City Hall', 'BAO BAO Standard', 'gabo', 'Gabo', 'Oct 6, 2026', '9:00 AM', 80, 'Cash', 'PAID', 'COMPLETED', new Date().toISOString()]
    );
  }
  return db;
}

/* ---------- Products CRUD ---------- */

export function getProducts(search = '') {
  const q = search.trim();
  if (!q) return db.getAllSync('SELECT * FROM products ORDER BY id DESC;');
  return db.getAllSync('SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC;', [`%${q}%`]);
}

export function addProduct(name, category, price, stock) {
  return db.runSync('INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);', [
    name,
    category,
    price,
    stock,
  ]).lastInsertRowId;
}

export function deleteProduct(id) {
  db.runSync('DELETE FROM products WHERE id = ?;', [id]);
}

export function incrementStock(id) {
  db.runSync('UPDATE products SET stock = stock + 1 WHERE id = ?;', [id]);
}

export function decrementStock(id) {
  db.runSync('UPDATE products SET stock = CASE WHEN stock > 0 THEN stock - 1 ELSE 0 END WHERE id = ?;', [id]);
}

/* ---------- Bookings CRUD ---------- */

export function getBookings() {
  return db.getAllSync('SELECT * FROM bookings ORDER BY id DESC;');
}

export function getBooking(id) {
  return db.getFirstSync('SELECT * FROM bookings WHERE id = ?;', [id]);
}

export function getPendingBooking() {
  return db.getFirstSync(
    "SELECT * FROM bookings WHERE payment_status = 'PENDING' ORDER BY id DESC LIMIT 1;"
  );
}

export function addBooking(b) {
  return db.runSync(
    'INSERT INTO bookings (pickup, destination, ride_type, driver_id, driver_name, ride_date, pickup_time, fare, payment_method, payment_status, booking_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
    [
      b.pickup,
      b.destination,
      b.rideType,
      b.driverId,
      b.driverName,
      b.rideDate,
      b.pickupTime,
      b.fare,
      b.paymentMethod || null,
      b.paymentStatus || 'PENDING',
      b.bookingStatus || 'SCHEDULED',
      new Date().toISOString(),
    ]
  ).lastInsertRowId;
}

export function updateBooking(id, b) {
  db.runSync(
    'UPDATE bookings SET pickup = ?, destination = ?, ride_type = ?, driver_id = ?, driver_name = ?, ride_date = ?, pickup_time = ?, fare = ?, payment_method = ? WHERE id = ?;',
    [
      b.pickup,
      b.destination,
      b.rideType,
      b.driverId,
      b.driverName,
      b.rideDate,
      b.pickupTime,
      b.fare,
      b.paymentMethod,
      id,
    ]
  );
}

export function updateBookingPayment(id, paymentMethod, paymentStatus, bookingStatus) {
  db.runSync(
    'UPDATE bookings SET payment_method = ?, payment_status = ?, booking_status = ? WHERE id = ?;',
    [paymentMethod, paymentStatus, bookingStatus, id]
  );
}

export function deleteBooking(id) {
  db.runSync('DELETE FROM bookings WHERE id = ?;', [id]);
}

/* ---------- Wallet ---------- */

export function getWallet() {
  return db.getFirstSync('SELECT * FROM wallet ORDER BY id ASC LIMIT 1;');
}

export function setWalletBalance(balance) {
  db.runSync('UPDATE wallet SET balance = ?, updated_at = ? WHERE id = 1;', [
    balance,
    new Date().toISOString(),
  ]);
}

/* ---------- Payments ---------- */

export function addPayment(bookingId, amount, method, status) {
  return db.runSync(
    'INSERT INTO payments (booking_id, amount, method, status, created_at) VALUES (?, ?, ?, ?, ?);',
    [bookingId, amount, method, status, new Date().toISOString()]
  ).lastInsertRowId;
}

export function getPayments() {
  return db.getAllSync('SELECT * FROM payments ORDER BY id DESC;');
}
