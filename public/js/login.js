document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password }),
        });

        const result = await response.json();
        if (response.ok) {
            // Сохраняем данные пользователя в localStorage
            localStorage.setItem('user', JSON.stringify(result.user));

            // Проверяем логин пользователя
            if (login === 'adminka') {
                window.location.href = '/admin.html'; // Перенаправляем на страницу администратора
            } else {
                window.location.href = '/create_order.html'; // Перенаправляем на страницу создания заказа
            }
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        alert('Ошибка сервера');
    }
});