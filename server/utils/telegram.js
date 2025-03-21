import fetch from 'node-fetch';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_MAX_LENGTH = 4000; // Учитываем запас для Markdown-разметки

/**
 * Функция отправки уведомления о новом премиум-пользователе в Telegram
 * @param {Object} user - Объект пользователя
 * @param {Array} jobs - Список вакансий пользователя
 */
export const sendTelegramNotification = async (user, jobs) => {
  try {
    const messages = generateMessages(user, jobs, "🔥 *Новый премиум-пользователь!* 🔥");
    await sendTelegramMessages(messages);
  } catch (error) {
    console.error('❌ Ошибка отправки в Telegram:', error);
  }
};

/**
 * Отправляет обновленный список вакансий пользователя в Telegram при редактировании/удалении
 * @param {Object} user - Объект пользователя
 * @param {Array} jobs - Список вакансий пользователя
 */
export const sendUpdatedJobListToTelegram = async (user, jobs) => {
  try {
    const messages = generateMessages(user, jobs, "⚡ *Обновление у премиум-пользователя!* ⚡");

    if (jobs.length === 0) {
      // 🔴 Уведомляем, если у пользователя больше нет вакансий
      messages.push(`⚠️ *Премиум-пользователь больше не имеет ни одной вакансии!* ⚠️\n\n` +
                    `👤 *Имя:* ${user.firstName || 'Не указано'} ${user.lastName || ''}\n` +
                    `📧 *Email:* ${user.email}\n` +
                    `❌ Все вакансии удалены.`);
    }

    await sendTelegramMessages(messages);
  } catch (error) {
    console.error(`❌ [Telegram] Ошибка при отправке уведомления:`, error);
  }
};

/**
 * Отправляет уведомление в Telegram о создании новой вакансии
 * @param {Object} user - Объект пользователя
 * @param {Object} job - Созданная вакансия
 */
export const sendNewJobNotificationToTelegram = async (user, job) => {
  try {
    console.log("📢 Вызов sendNewJobNotificationToTelegram для вакансии:", job);
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("❌ Ошибка: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не установлены.");
      return;
    }

    const message = `🆕 *Новая вакансия от премиум-пользователя!* 🆕\n\n` +
                    `👤 *Имя:* ${user.firstName || 'Не указано'} ${user.lastName || ''}\n` +
                    `📧 *Email:* ${user.email}\n` +
                    `💎 *Статус:* Премиум активирован!\n\n` +
                    `📌 *Вакансия:*\n` +
                    `🔹 *${job.title}* \n` +
                    `📍 *Город:* ${job.city?.name || 'Не указан'}\n` +
                    `💰 *Зарплата:* ${job.salary}\n` +
                    `📞 *Телефон:* ${job.phone}\n` +
                    `📅 *Дата:* ${new Date(job.createdAt).toLocaleDateString()}\n` +
                    `📝 *Описание:* ${job.description || 'Нет описания'}\n` +
                    `---`;
                    

    console.log(`📤 Отправляем сообщение в Telegram:\n${message}`);

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
        }),
    });

    const data = await response.json();
    console.log("📩 Ответ от Telegram API:", data);

    if (!data.ok) {
        console.error("❌ Ошибка Telegram:", data.description);
    } else {
        console.log(`✅ [Telegram] Уведомление о новой вакансии отправлено!`);
    }

  } catch (error) {
    console.error(`❌ Ошибка при отправке уведомления в Telegram:`, error);
  }
};



/**
 * Генерирует список сообщений для отправки в Telegram
 * @param {Object} user - Объект пользователя
 * @param {Array} jobs - Список вакансий пользователя
 * @param {string} header - Заголовок уведомления
 * @returns {Array} messages - Разбитый список сообщений
 */
const generateMessages = (user, jobs, header) => {
  let messages = [];
  let currentMessage = `${header}\n\n` +
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

      if (currentMessage.length + jobMessage.length > TELEGRAM_MAX_LENGTH) {
        messages.push(currentMessage);
        currentMessage = ''; // Очищаем и создаем новый блок
      }

      currentMessage += jobMessage;
    });

    if (currentMessage.length > 0) {
      messages.push(currentMessage);
    }
  }

  return messages;
};

/**
 * Отправляет массив сообщений в Telegram
 * @param {Array} messages - Список сообщений для отправки
 */
const sendTelegramMessages = async (messages) => {
  for (const msg of messages) {
    console.log(`📤 Отправляем сообщение в Telegram:\n${msg}`);

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();
      console.log("📩 Ответ от Telegram API:", data);

      if (!data.ok) {
        console.error("❌ Ошибка Telegram:", data.description);
      }
    } catch (error) {
      console.error("❌ Ошибка сети при отправке:", error);
    }
  }
};