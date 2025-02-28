import fetch from 'node-fetch';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_MAX_LENGTH = 4000; // Учитываем запас для Markdown-разметки

/**
 * Функция отправки уведомления в Telegram
 * @param {Object} user - Объект пользователя
 * @param {Array} jobs - Список вакансий пользователя
 */
export const sendTelegramNotification = async (user, jobs) => {
  try {
    let messages = [];
    let currentMessage = `🔥 *Новый премиум-пользователь!* 🔥\n\n` +
                         `👤 *Имя:* ${user.firstName || 'Не указано'} ${user.lastName || ''}\n` +
                         `📧 *Email:* ${user.email}\n` +
                         `💎 *Статус:* Премиум активирован!\n\n` +
                         `📌 *Вакансии пользователя:*`;

    if (jobs.length === 0) {
      currentMessage += `\n❌ У пользователя пока нет вакансий.`;
      messages.push(currentMessage);
    } else {
      jobs.forEach((job, index) => {
        let jobMessage = `\n\n🔹 *${index + 1}. ${job.title}* \n` +
                         `📍 *Город:* ${job.city?.name || 'Не указан'}\n` +
                         `💰 *Зарплата:* ${job.salary}\n` +
                         `📞 *Телефон:* ${job.phone}\n` +
                         `📅 *Дата:* ${new Date(job.createdAt).toLocaleDateString()}\n` +
                         `📝 *Описание:* ${job.description || 'Нет описания'}\n` +
                         `---`;

        // Если текущее сообщение станет слишком длинным, сохраняем его и начинаем новое
        if (currentMessage.length + jobMessage.length > TELEGRAM_MAX_LENGTH) {
          messages.push(currentMessage);
          currentMessage = ''; // Очищаем и создаем новый блок
        }

        currentMessage += jobMessage;
      });

      // Добавляем последнее сообщение в массив
      if (currentMessage.length > 0) {
        messages.push(currentMessage);
      }
    }

    // 🔥 Отправляем каждое сообщение отдельно
    for (const msg of messages) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: 'Markdown',
        }),
      });
    }

    console.log('✅ Все сообщения успешно отправлены в Telegram!');

  } catch (error) {
    console.error('❌ Ошибка отправки в Telegram:', error);
  }
};
