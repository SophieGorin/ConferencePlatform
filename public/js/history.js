document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login.html';
    }

    try {
        const response = await fetch(`/order-history/${user.id}`);
        const result = await response.json();

        const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];

        // Очищаем таблицу перед добавлением новых данных
        ordersTable.innerHTML = '';

        // Заполняем таблицу данными
        result.orders.forEach(order => {
            const row = ordersTable.insertRow();
            row.insertCell().textContent = order.id; // Номер заявки
            row.insertCell().textContent = new Date(order.date_time).toLocaleString(); // Дата и время
            row.insertCell().textContent = order.service_name; // Вид услуги
            row.insertCell().textContent = order.status; // Статус
            row.insertCell().textContent = order.cancel_reason || '—'; // Причина отмены (если есть)
        });
    } catch (error) {
        console.error('Ошибка при получении истории заявок:', error);
        alert('Не удалось загрузить историю заявок. Пожалуйста, попробуйте позже.');
    }
});