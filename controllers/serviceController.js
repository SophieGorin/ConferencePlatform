const pool = require('../db/pool');

const getServices = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения услуг: ' + error.message });
    }
};

module.exports = { getServices };
