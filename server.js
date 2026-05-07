const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ===== ФУНКЦИИ ВАЛИДАЦИИ =====
function validateLogin(login) {
    return /^[a-zA-Z0-9]{6,}$/.test(login);
}

function validatePassword(password) {
    return password && password.length >= 8;
}

function validateFullname(fullname) {
    return /^[а-яА-ЯёЁ\s]+$/.test(fullname);
}

function validatePhone(phone) {
    return /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Страница регистрации
app.get('/register-page', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

// Обработка регистрации с валидацией
app.post('/register', (req, res) => {
    const { login, password, fullname, phone, email } = req.body;
    
    // Валидация всех полей
    if (!validateLogin(login)) {
        return res.redirect('/register-page?error=' + encodeURIComponent('Логин должен содержать минимум 6 символов (латиница и цифры)'));
    }
    
    if (!validatePassword(password)) {
        return res.redirect('/register-page?error=' + encodeURIComponent('Пароль должен содержать минимум 8 символов'));
    }
    
    if (!validateFullname(fullname)) {
        return res.redirect('/register-page?error=' + encodeURIComponent('ФИО должно содержать только буквы кириллицы и пробелы'));
    }
    
    if (!validatePhone(phone)) {
        return res.redirect('/register-page?error=' + encodeURIComponent('Телефон должен быть в формате: 8(XXX)XXX-XX-XX'));
    }
    
    if (!validateEmail(email)) {
        return res.redirect('/register-page?error=' + encodeURIComponent('Неверный формат электронной почты'));
    }
    
    // Проверка на уникальность логина
    db.get(`SELECT id FROM users WHERE login = ?`, [login], (err, existingUser) => {
        if (existingUser) {
            return res.redirect('/register-page?error=' + encodeURIComponent('Пользователь с таким логином уже существует'));
        }
        
        // Сохраняем пользователя
        db.run(`INSERT INTO users (login, password, fullname, phone, email) VALUES (?, ?, ?, ?, ?)`,
            [login, password, fullname, phone, email],
            function(err) {
                if (err) {
                    return res.redirect('/register-page?error=' + encodeURIComponent('Ошибка при регистрации'));
                }
                res.redirect('/?error=' + encodeURIComponent('Регистрация успешна! Теперь войдите'));
            });
    });
});

// Обработка входа с валидацией
app.post('/login', (req, res) => {
    const { login, password } = req.body;
    
    // Проверка на пустые поля
    if (!login || !password) {
        return res.redirect('/?error=' + encodeURIComponent('Заполните все поля'));
    }
    
    // Поиск пользователя
    db.get(`SELECT * FROM users WHERE login = ? AND password = ?`, [login, password], (err, user) => {
        if (err || !user) {
            return res.redirect('/?error=' + encodeURIComponent('Неверный логин или пароль'));
        }
        
        // Перенаправление в зависимости от роли
        if (user.role === 'admin') {
            res.redirect(`/admin.html?userId=${user.id}&userName=${user.fullname}`);
        } else {
            res.redirect(`/user.html?userId=${user.id}&userName=${user.fullname}`);
        }
    });
});

// Создание заявки
app.post('/create-request', (req, res) => {
    const { userId, course_name, start_date, payment_method } = req.body;
    
    if (!course_name || !start_date || !payment_method) {
        return res.redirect(`/new-request.html?userId=${userId}&error=` + encodeURIComponent('Заполните все поля'));
    }
    
    // Конвертируем дату из YYYY-MM-DD в DD.MM.YYYY
    const formattedDate = start_date.split('-').reverse().join('.');
    
    db.run(`INSERT INTO requests (user_id, course_name, start_date, payment_method) VALUES (?, ?, ?, ?)`,
        [userId, course_name, formattedDate, payment_method],
        (err) => {
            if (err) {
                return res.redirect(`/new-request.html?userId=${userId}&error=` + encodeURIComponent('Ошибка создания заявки'));
            }
            res.redirect(`/user.html?userId=${userId}&msg=` + encodeURIComponent('Заявка создана!'));
        });
});

// Добавление отзыва
app.post('/add-review', (req, res) => {
    const { userId, requestId, review } = req.body;
    
    if (!requestId || !review) {
        return res.redirect(`/user.html?userId=${userId}&msg=` + encodeURIComponent('Выберите курс и напишите отзыв'));
    }
    
    db.get(`SELECT status FROM requests WHERE id = ?`, [requestId], (err, row) => {
        if (!row) {
            return res.redirect(`/user.html?userId=${userId}&msg=` + encodeURIComponent('Заявка не найдена'));
        }
        
        if (row.status !== 'Обучение завершено') {
            return res.redirect(`/user.html?userId=${userId}&msg=` + encodeURIComponent('Отзыв можно оставить только после завершения обучения'));
        }
        
        db.run(`UPDATE requests SET review = ? WHERE id = ?`, [review, requestId], () => {
            res.redirect(`/user.html?userId=${userId}&msg=` + encodeURIComponent('Отзыв добавлен! Спасибо!'));
        });
    });
});

// API для заявок пользователя
app.get('/requests/:userId', (req, res) => {
    db.all(`SELECT * FROM requests WHERE user_id = ? ORDER BY id DESC`, [req.params.userId], (err, rows) => {
        res.json(rows || []);
    });
});

// API для админа
app.get('/admin/requests', (req, res) => {
    db.all(`SELECT r.*, u.fullname FROM requests r JOIN users u ON r.user_id = u.id ORDER BY r.id DESC`, 
        (err, rows) => {
            res.json(rows || []);
        });
});

app.put('/admin/request/:id', (req, res) => {
    const { status } = req.body;
    db.run(`UPDATE requests SET status = ? WHERE id = ?`, [status, req.params.id], () => {
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log('Сервер на http://localhost:3000'));