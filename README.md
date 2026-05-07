Установка зависимостей
<br>
npm init -y
<br>
npm install express sqlite3
<br>
Запуск сервера
<br>
npm start
<br>
Сервер запустится на http://localhost:3000
<br>
Настройка базы данных (PostgreSQL)
<br>
1. Создание базы данных
<br>
Откройте pgAdmin
<br>
Нажмите правой кнопкой мыши на стандартную БД
<br>
Откройте Query Tool
<br>
CREATE DATABASE названиеБД;
<br>
Нажмите Execute (F5)
<br>
Обновите список БД (правой кнопкой → Refresh)
<br>
2. Создание таблиц
<br>
Нажмите правой кнопкой на созданную БД → Query Tool
<br>
Выполните скрипт ниже
<br> <br>
Таблица пользователей
<br> <br>
CREATE TABLE IF NOT EXISTS users (<br>
    id SERIAL PRIMARY KEY, <br>
    login VARCHAR(50) UNIQUE NOT NULL, <br>
    password VARCHAR(100) NOT NULL, <br>
    fullname VARCHAR(100) NOT NULL, <br>
    phone VARCHAR(20) NOT NULL, <br>
    email VARCHAR(100) NOT NULL, <br>
    role VARCHAR(20) DEFAULT 'user' <br>
);
<br> <br>
Таблица заявок
<br> <br>
CREATE TABLE IF NOT EXISTS requests ( <br>
    id SERIAL PRIMARY KEY, <br>
    user_id INTEGER NOT NULL, <br>
    course_name VARCHAR(200) NOT NULL, <br>
    start_date VARCHAR(10) NOT NULL, <br>
    payment_method VARCHAR(20) NOT NULL, <br>
    status VARCHAR(50) DEFAULT 'Новая', <br>
    review TEXT, <br>
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE <br>
);
<br> <br>
4. Заполнение тестовыми данными <br>
Добавление пользователей
<br> <br>
INSERT INTO users (login, password, fullname, phone, email, role) VALUES <br>
('Admin', 'KorokNET', 'Администратор Системы', '8(999)123-45-67', 'admin@korochki.ru', 'admin'), <br>
('ivanov', 'pass12345', 'Иванов Иван Иванович', '8(912)345-67-89', 'ivanov@mail.ru', 'user'), <br>
('petrova', 'petrova123', 'Петрова Анна Сергеевна', '8(913)456-78-90', 'petrova@yandex.ru', 'user'), <br>
('sidorov', 'sid123456', 'Сидоров Петр Алексеевич', '8(914)567-89-01', 'sidorov@gmail.com', 'user'), <br>
('popova', 'popova777', 'Попова Елена Владимировна', '8(915)678-90-12', 'popova@bk.ru', 'user');
<br> <br>
Добавление заявок
<br> <br>
INSERT INTO requests (user_id, course_name, start_date, payment_method, status, review) VALUES <br>
(2, 'Основы алгоритмизации и программирования', '15.01.2024', 'cash', 'Обучение завершено', 'Отличный курс! Всё понятно и доступно.'), <br>
(2, 'Основы веб-дизайна', '01.03.2024', 'transfer', 'Идет обучение', NULL),
<br> <br>
(3, 'Основы проектирования баз данных', '10.02.2024', 'transfer', 'Обучение завершено', 'Очень полезный курс, рекомендую!'), <br>
(3, 'Основы алгоритмизации и программирования', '01.04.2024', 'cash', 'Новая', NULL),
<br> <br>
(4, 'Основы веб-дизайна', '20.01.2024', 'cash', 'Обучение завершено', 'Хороший курс, но хотелось бы больше практики'), <br>
(4, 'Основы проектирования баз данных', '15.03.2024', 'transfer', 'Идет обучение', NULL),
<br> <br>
(5, 'Основы алгоритмизации и программирования', '05.03.2024', 'cash', 'Новая', NULL), <br>
(5, 'Основы веб-дизайна', '25.04.2024', 'transfer', 'Новая', NULL); <br>
6. Создание ER-диаграммы
Нажмите правой кнопкой на вашу БД

Выберите Generate ERD (или ERD Viewer)

Сохраните диаграмму как er-diagram.png
