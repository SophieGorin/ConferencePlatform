const pool = require('../db/pool');

const getAllOrders = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещен.' });
    }
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения заявок: ' + error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status, reason } = req.body;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещен.' });
    }
    try {
        await pool.query(
            'UPDATE orders SET status = $1, cancellation_reason = $2 WHERE id = $3',
            [status, reason || null, orderId]
        );
        res.json({ message: 'Статус заявки обновлен.' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления статуса: ' + error.message });
    }
};

module.exports = { getAllOrders, updateOrderStatus };
