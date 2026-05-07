const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));

db.serialize(() => {
  // Таблица пользователей
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT UNIQUE,
    password TEXT,
    fullname TEXT,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'user'
  )`);

  // Таблица заявок
  db.run(`CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_name TEXT,
    start_date TEXT,
    payment_method TEXT,
    status TEXT DEFAULT 'Новая',
    review TEXT
  )`);

  // Создаём админа
  db.get(`SELECT id FROM users WHERE login = 'Admin'`, (err, row) => {
    if (!row) {
      db.run(`INSERT INTO users (login, password, fullname, phone, email, role) 
               VALUES ('Admin', 'KorokNET', 'Администратор', '80000000000', 'admin@k.ru', 'admin')`);
    }
  });
});

module.exports = db;