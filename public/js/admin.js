document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/admin/orders');
        const result = await response.json();

        const adminPanel = document.getElementById('adminPanel').getElementsByTagName('tbody')[0];

        // Очищаем таблицу перед добавлением новых данных
        adminPanel.innerHTML = '';

        // Заполняем таблицу данными
        result.orders.forEach(order => {
            const row = adminPanel.insertRow();
            row.insertCell().textContent = order.id; // Номер заявки
            row.insertCell().textContent = new Date(order.date_time).toLocaleString(); // Дата и время
            row.insertCell().textContent = order.service_name; // Вид услуги
            row.insertCell().textContent = order.custom_service || '—'; // Описание услуги (если есть)
            row.insertCell().textContent = order.status; // Статус
            row.insertCell().textContent = order.cancel_reason || '—'; // Причина отмены (если есть)

            // Добавляем выпадающий список для изменения статуса
            const statusCell = row.insertCell();
            const statusSelect = document.createElement('select');
            statusSelect.innerHTML = `
                <option value="в работе">В работе</option>
                <option value="выполнено">Выполнено</option>
                <option value="отменено">Отменено</option>
            `;
            statusSelect.value = order.status;
            statusSelect.style.width = '100px';
            statusSelect.style.fontSize = '15px';
            statusCell.appendChild(statusSelect);

            // Добавляем поле для ввода причины отмены
            const reasonCell = row.insertCell();
            const reasonInput = document.createElement('input');
            reasonInput.type = 'text';
            reasonInput.placeholder = 'Причина отмены';
            reasonInput.style.width = '100px';
            reasonInput.style.fontSize = '15px';
            reasonCell.appendChild(reasonInput);

            // Добавляем кнопку для обновления статуса
            const actionCell = row.insertCell();
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Обновить статус';
            updateButton.addEventListener('click', () => updateOrderStatus(order.id, statusSelect.value, reasonInput.value));
            updateButton.style.width = '100px';
            updateButton.style.fontSize = '15px';
            actionCell.appendChild(updateButton);
        });
    } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
    }
});

async function updateOrderStatus(orderId, status, cancelReason) {
    try {
        const response = await fetch('/admin/update-order-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order_id: orderId, status, cancel_reason: cancelReason }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.reload(); // Перезагружаем страницу для обновления данных
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Ошибка при обновлении статуса заявки:', error);
        alert('Ошибка сервера');
    }
}