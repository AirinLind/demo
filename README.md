# Установка зависимостей
npm init -y
npm install express sqlite3

# Запуск сервера
npm start
Сервер запустится на http://localhost:3000

для бд
Создаем бд через pgAdmin. Пкм на стандартную бд, create, Query Tool.
В Query TooL вводим: create database название; и запускаем.
Чтобы увидеть новую бд - пкм на бд, refresh. Пкм на созданную бд, Query Tool.
Пишем скрипт таблицы, заполняем и запускаем. Потом пкм по нашей бд и создаем erd-диаграмму. 
Настройка базы данных (PostgreSQL)
1. Создание базы данных
Откройте pgAdmin

Нажмите правой кнопкой мыши на стандартную БД
Откройте Query Tool
CREATE DATABASE названиеБД;
Нажмите Execute (F5)

Обновите список БД (правой кнопкой → Refresh)

2. Создание таблиц
Нажмите правой кнопкой на созданную БД → Query Tool

Выполните скрипт ниже

Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);
Таблица заявок
CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    start_date VARCHAR(10) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'Новая',
    review TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
3. Заполнение тестовыми данными
Добавление пользователей
sql
INSERT INTO users (login, password, fullname, phone, email, role) VALUES
('Admin', 'KorokNET', 'Администратор Системы', '8(999)123-45-67', 'admin@korochki.ru', 'admin'),
('ivanov', 'pass12345', 'Иванов Иван Иванович', '8(912)345-67-89', 'ivanov@mail.ru', 'user'),
('petrova', 'petrova123', 'Петрова Анна Сергеевна', '8(913)456-78-90', 'petrova@yandex.ru', 'user'),
('sidorov', 'sid123456', 'Сидоров Петр Алексеевич', '8(914)567-89-01', 'sidorov@gmail.com', 'user'),
('popova', 'popova777', 'Попова Елена Владимировна', '8(915)678-90-12', 'popova@bk.ru', 'user');
Добавление заявок
sql
INSERT INTO requests (user_id, course_name, start_date, payment_method, status, review) VALUES
(2, 'Основы алгоритмизации и программирования', '15.01.2024', 'cash', 'Обучение завершено', 'Отличный курс! Всё понятно и доступно.'),
(2, 'Основы веб-дизайна', '01.03.2024', 'transfer', 'Идет обучение', NULL),
(3, 'Основы проектирования баз данных', '10.02.2024', 'transfer', 'Обучение завершено', 'Очень полезный курс, рекомендую!'),
(3, 'Основы алгоритмизации и программирования', '01.04.2024', 'cash', 'Новая', NULL),
(4, 'Основы веб-дизайна', '20.01.2024', 'cash', 'Обучение завершено', 'Хороший курс, но хотелось бы больше практики'),
(4, 'Основы проектирования баз данных', '15.03.2024', 'transfer', 'Идет обучение', NULL),
(5, 'Основы алгоритмизации и программирования', '05.03.2024', 'cash', 'Новая', NULL),
(5, 'Основы веб-дизайна', '25.04.2024', 'transfer', 'Новая', NULL);
4. Создание ER-диаграммы
Нажмите правой кнопкой на вашу БД

Выберите Generate ERD (или ERD Viewer)

Сохраните диаграмму как er-diagram.png
