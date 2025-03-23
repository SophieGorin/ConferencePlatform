const pool = require('../db/pool');

const createOrder = async (req, res) => {
    const { service, address, dateTime } = req.body;
    const userId = req.user.id;
    try {
        await pool.query(
            'INSERT INTO orders (user_id, service, address, date_time, status) VALUES ($1, $2, $3, $4, $5)',
            [userId, service, address, dateTime, 'Pending']
        );
        res.status(201).json({ message: 'Заявка создана.' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка создания заявки: ' + error.message });
    }
};

const getOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения заявок: ' + error.message });
    }
};

module.exports = { createOrder, getOrders };
