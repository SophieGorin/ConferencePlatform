document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login.html';
    }

    document.getElementById('userName').value = user.full_name;

    try {
        const response = await fetch('/services');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке услуг');
        }
        const services = await response.json();
        const serviceSelect = document.getElementById('serviceName');
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка при загрузке услуг:', error);
        alert('Не удалось загрузить услуги. Пожалуйста, попробуйте позже.');
    }

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const orderData = {
            user_id: user.id,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            service_name: document.getElementById('serviceName').value,
            custom_service: document.getElementById('customService').value,
            date_time: document.getElementById('dateTime').value,
            payment_type: document.getElementById('paymentType').value
        };

        try {
            const response = await fetch('/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании заявки');
            }

            const result = await response.json();
            document.getElementById('responseMessage').textContent = result.message;
        } catch (error) {
            console.error('Ошибка при создании заявки:', error);
            document.getElementById('responseMessage').textContent = 'Ошибка при создании заявки. Пожалуйста, попробуйте позже.';
        }
    });
});