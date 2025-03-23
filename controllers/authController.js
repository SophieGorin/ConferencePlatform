const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
    const { fullName, phone, login, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (full_name, phone, login, password) VALUES ($1, $2, $3, $4)',
            [fullName, phone, login, hashedPassword]
        );
        res.status(201).json({ message: 'Пользователь зарегистрирован!' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка регистрации: ' + error.message });
    }
};

const login = async (req, res) => {
    const { login, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден.' });

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Неверный пароль.' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка авторизации: ' + error.message });
    }
};

module.exports = { register, login };
