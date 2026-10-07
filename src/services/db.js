import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('pos_inventory.db');

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    );
  `);

  const countRow = db.getFirstSync(
    'SELECT COUNT(*) as count FROM products;'
  );

  if (countRow.count === 0) {
    db.runSync(
      `INSERT INTO products
        (name, category, price, stock)
       VALUES
        (?, ?, ?, ?),
        (?, ?, ?, ?),
        (?, ?, ?, ?),
        (?, ?, ?, ?);`,
      [
        'Home Cleaning Service',
        'Home',
        140,
        10,

        'Car Cleaning Service',
        'Car',
        95,
        8,

        'Laundry Service',
        'Laundry',
        80,
        15,

        'Painting Service',
        'Painting',
        200,
        5,
      ]
    );
  }
}