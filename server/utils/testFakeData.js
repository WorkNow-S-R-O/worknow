import { assignJobsToFakeUsers } from "./attachJobsToUsers.js";

// 🔹 Тестовые вакансии (замени на парсер)
const testJobs = [
  { title: "Работа в офисе", salary: 50, description: "Работа в офисе с 9 до 18", city: "Тель-Авив", link: "https://example.com/job1" },
  { title: "Уборщик", salary: 40, description: "Работа по уборке помещений", city: "Иерусалим", link: "https://example.com/job2" },
  { title: "Официант", salary: 45, description: "Обслуживание клиентов в ресторане", city: "Хайфа", link: "https://example.com/job3" }
];

// Запускаем тест
assignJobsToFakeUsers(testJobs).then(() => {
  console.log("🎯 Тестовая загрузка завершена!");
  process.exit(0);
}).catch((err) => {
  console.error("❌ Ошибка во время тестирования:", err);
  process.exit(1);
});
