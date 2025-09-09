// Пример использования API рассылки сообщений
export async function broadcastMessage(title, body, userIds = null) {
	try {
		const response = await fetch(
			'http://localhost:3001/api/messages/broadcast',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'user-id': 'ADMIN_USER_ID_HERE', // Замените на ID админа
				},
				body: JSON.stringify({
					title,
					body,
					userIds, // если null - всем пользователям, если массив - выбранным
				}),
			},
		);

		const result = await response.json();

		if (response.ok) {
			console.log(`✅ Сообщение отправлено ${result.count} пользователям`);
		} else {
			console.error('❌ Ошибка:', result.error);
		}
	} catch (error) {
		console.error('❌ Ошибка запроса:', error.message);
	}
}

// Примеры использования:
// broadcastMessage('Важное уведомление', 'Обновление системы завтра в 10:00');
// broadcastMessage('Персональное предложение', 'Специальная скидка для вас!', ['user1', 'user2']);
