const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres', // Замените на вашего пользователя БД
  host: 'localhost',
  database: 'cleaning_portal', // Замените на имя вашей БД
  password: 'postgres', // Замените на ваш пароль
  port: 5432,
});

// Middleware для обработки JSON и URL-encoded данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Обработка статических файлов (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Перенаправление с корневого маршрута на login.html
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const { login, password, full_name, phone, email } = req.body;

    try {
        // Проверка на уникальность логина
        const checkLoginQuery = 'SELECT * FROM users WHERE login = $1';
        const checkLoginResult = await pool.query(checkLoginQuery, [login]);

        if (checkLoginResult.rows.length > 0) {
            return res.status(400).json({ error: 'Логин уже существует' });
        }

        // Валидация пароля
        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
        }

        // Добавление пользователя в базу данных
        const insertUserQuery = `
            INSERT INTO users (login, password, full_name, phone, email)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(insertUserQuery, [login, password, full_name, phone, email]);

        res.status(200).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Авторизация пользователя
app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const checkUserQuery = 'SELECT * FROM users WHERE login = $1 AND password = $2';
        const checkUserResult = await pool.query(checkUserQuery, [login, password]);

        if (checkUserResult.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный логин или пароль' });
        }

        const user = checkUserResult.rows[0];
        res.status(200).json({ message: 'Авторизация успешна', user });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение списка услуг
app.get('/services', async (req, res) => {
    try {
        const getServicesQuery = 'SELECT * FROM services'; // Предположим, что у вас есть таблица services
        const getServicesResult = await pool.query(getServicesQuery);

        res.status(200).json(getServicesResult.rows);
    } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Создание заявки
app.post('/create-order', async (req, res) => {
    const { user_id, address, phone, service_name, custom_service, date_time, payment_type } = req.body;

    // Проверка, что payment_type равен 'card' или 'cash'
    if (payment_type !== 'card' && payment_type !== 'cash') {
        return res.status(400).json({ error: 'Недопустимый тип оплаты' });
    }

    try {
        const insertOrderQuery = `
            INSERT INTO orders (user_id, address, phone, service_name, custom_service, date_time, payment_type, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        await pool.query(insertOrderQuery, [user_id, address, phone, service_name, custom_service, date_time, payment_type, 'новая заявка']);

        res.status(200).json({ message: 'Заявка успешно создана' });
    } catch (error) {
        console.error('Ошибка при создании заявки:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение истории заявок пользователя
app.get('/order-history/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const getOrdersQuery = 'SELECT * FROM orders WHERE user_id = $1';
        const getOrdersResult = await pool.query(getOrdersQuery, [user_id]);

        res.status(200).json({ orders: getOrdersResult.rows });
    } catch (error) {
        console.error('Ошибка при получении истории заявок:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Панель администратора: получение всех заявок
app.get('/admin/orders', async (req, res) => {
    try {
        const getOrdersQuery = 'SELECT * FROM orders';
        const getOrdersResult = await pool.query(getOrdersQuery);

        res.status(200).json({ orders: getOrdersResult.rows });
    } catch (error) {
        console.error('Ошибка при получении заявок:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Панель администратора: обновление статуса заявки
app.post('/admin/update-order-status', async (req, res) => {
    const { order_id, status, cancel_reason } = req.body;

    try {
        const updateOrderQuery = `
            UPDATE orders
            SET status = $1, cancel_reason = $2
            WHERE id = $3
        `;
        await pool.query(updateOrderQuery, [status, cancel_reason, order_id]);

        res.status(200).json({ message: 'Статус заявки успешно обновлен' });
    } catch (error) {
        console.error('Ошибка при обновлении статуса заявки:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});