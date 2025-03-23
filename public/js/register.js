document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value,
        full_name: document.getElementById('full_name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = '/login.html';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Ошибка сервера');
    }
});