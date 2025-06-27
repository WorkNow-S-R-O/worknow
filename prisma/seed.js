import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Массив городов с переводами
const cities = [
  { ru: "Весь Израиль", he: "כל ישראל", en: "All Israel" },
  { ru: "Центр страны", he: "מרכז הארץ", en: "Center" },
  { ru: "Юг страны", he: "דרום הארץ", en: "South" },
  { ru: "Север страны", he: "צפון הארץ", en: "North" },
  { ru: "Акко", he: "עכו", en: "Akko" },
  { ru: "Азур", he: "אזור", en: "Azor" },
  { ru: "Арад", he: "ערד", en: "Arad" },
  { ru: "Ариэль", he: "אריאל", en: "Ariel" },
  { ru: "Аррабе", he: "עראבה", en: "Arraba" },
  { ru: "Афула", he: "עפולה", en: "Afula" },
  { ru: "Ашдод", he: "אשדוד", en: "Ashdod" },
  { ru: "Ашкелон", he: "אשקלון", en: "Ashkelon" },
  { ru: "Бака эль Гарбия", he: "באקה אל-גרביה", en: "Baqa al-Gharbiyye" },
  { ru: "Бат Ям", he: "בת ים", en: "Bat Yam" },
  { ru: "Бейт Шеан", he: "בית שאן", en: "Beit She'an" },
  { ru: "Бейт Шемеш", he: "בית שמש", en: "Beit Shemesh" },
  { ru: "Бейтар Илит", he: "ביתר עילית", en: "Beitar Illit" },
  { ru: "Беэр Шева", he: "באר שבע", en: "Be'er Sheva" },
  { ru: "Беэр Яаков", he: "באר יעקב", en: "Be'er Ya'akov" },
  { ru: "Бней Брак", he: "בני ברק", en: "Bnei Brak" },
  { ru: "Бней Аиш", he: "בני עיש", en: "Bnei Ayish" },
  { ru: "Ганей Тиква", he: "גני תקווה", en: "Ganei Tikva" },
  { ru: "Герцлия", he: "הרצליה", en: "Herzliya" },
  { ru: "Гиватаим", he: "גבעתיים", en: "Giv'atayim" },
  { ru: "Гиват Шмуэль", he: "גבעת שמואל", en: "Giv'at Shmuel" },
  { ru: "Димона", he: "דימונה", en: "Dimona" },
  { ru: "Иерусалим", he: "ירושלים", en: "Jerusalem" },
  { ru: "Йехуд Моноссон", he: "יהוד מונוסון", en: "Yehud Monosson" },
  { ru: "Йокнеам", he: "יקנעם", en: "Yokneam" },
  { ru: "Калансуа", he: "קלנסווה", en: "Kalansuwa" },
  { ru: "Кармиэль", he: "כרמיאל", en: "Karmiel" },
  { ru: "Кафр Кара", he: "כפר קרע", en: "Kafr Qara" },
  { ru: "Кафр Касем", he: "כפר קאסם", en: "Kafr Qasim" },
  { ru: "Кирьят Ата", he: "קריית אתא", en: "Kiryat Ata" },
  { ru: "Кирьят Бялик", he: "קריית ביאליק", en: "Kiryat Bialik" },
  { ru: "Кирьят Хаим", he: "קריית חיים", en: "Kiryat Haim" },
  { ru: "Кирьят Гат", he: "קריית גת", en: "Kiryat Gat" },
  { ru: "Кирьят Малахи", he: "קריית מלאכי", en: "Kiryat Malakhi" },
  { ru: "Кирьят Моцкин", he: "קריית מוצקין", en: "Kiryat Motzkin" },
  { ru: "Кирьят Оно", he: "קריית אונו", en: "Kiryat Ono" },
  { ru: "Кирьят Шмона", he: "קריית שמונה", en: "Kiryat Shmona" },
  { ru: "Кирьят Ям", he: "קריית ים", en: "Kiryat Yam" },
  { ru: "Кфар Саба", he: "כפר סבא", en: "Kfar Saba" },
  { ru: "Кфар Йона", he: "כפר יונה", en: "Kfar Yona" },
  { ru: "Лод", he: "לוד", en: "Lod" },
  { ru: "Маале Адумим", he: "מעלה אדומים", en: "Ma'ale Adumim" },
  { ru: "Маалот Таршиха", he: "מעלות תרשיחא", en: "Ma'alot-Tarshiha" },
  { ru: "Магар", he: "מגאר", en: "Maghar" },
  { ru: "Модиин", he: "מודיעין", en: "Modiin" },
  { ru: "Мигдаль ха Эмек", he: "מגדל העמק", en: "Migdal HaEmek" },
  { ru: "Модиин Илит", he: "מודיעין עילית", en: "Modiin Illit" },
  { ru: "Маалот", he: "מעלות", en: "Ma'alot" },
  { ru: "Модиин Маккабим Реут", he: "מודיעין מכבים רעות", en: "Modiin Maccabim Reut" },
  { ru: "Нагария", he: "נהריה", en: "Nahariya" },
  { ru: "Назарет", he: "נצרת", en: "Nazareth" },
  { ru: "Ноф ха Галиль", he: "נוף הגליל", en: "Nof HaGalil" },
  { ru: "Нес Циона", he: "נס ציונה", en: "Ness Ziona" },
  { ru: "Натания", he: "נתניה", en: "Netanya" },
  { ru: "Нетивот", he: "נתיבות", en: "Netivot" },
  { ru: "Наария", he: "נהריה", en: "Nahariya" },
  { ru: "Нацрат Илит", he: "נצרת עילית", en: "Nazareth Illit" },
  { ru: "Нешер", he: "נשר", en: "Nesher" },
  { ru: "Ор Акива", he: "אור עקיבא", en: "Or Akiva" },
  { ru: "Ор Йехуда", he: "אור יהודה", en: "Or Yehuda" },
  { ru: "Офаким", he: "אופקים", en: "Ofakim" },
  { ru: "Петах Тиква", he: "פתח תקווה", en: "Petah Tikva" },
  { ru: "Раанана", he: "רעננה", en: "Ra'anana" },
  { ru: "Рамат Ган", he: "רמת גן", en: "Ramat Gan" },
  { ru: "Рамла", he: "רמלה", en: "Ramla" },
  { ru: "Рахат", he: "רהט", en: "Rahat" },
  { ru: "Реховот", he: "רחובות", en: "Rehovot" },
  { ru: "Ришон ле Цион", he: "ראשון לציון", en: "Rishon LeZion" },
  { ru: "Рош Аин", he: "ראש העין", en: "Rosh HaAyin" },
  { ru: "Сахнин", he: "סח'נין", en: "Sakhnin" },
  { ru: "Сдерот", he: "שדרות", en: "Sderot" },
  { ru: "Тайбе", he: "טייבה", en: "Tayibe" },
  { ru: "Тамра", he: "טמרה", en: "Tamra" },
  { ru: "Тверия", he: "טבריה", en: "Tiberias" },
  { ru: "Тель Авив", he: "תל אביב", en: "Tel Aviv" },
  { ru: "Тира", he: "טירה", en: "Tira" },
  { ru: "Тират Кармель", he: "טירת כרמל", en: "Tirat Carmel" },
  { ru: "Умм-эль Фахм", he: "אום אל-פחם", en: "Umm al-Fahm" },
  { ru: "Хадера", he: "חדרה", en: "Hadera" },
  { ru: "Хайфа", he: "חיפה", en: "Haifa" },
  { ru: "Хедера", he: "חדרה", en: "Hadera" },
  { ru: "Ход Ха Шарон", he: "הוד השרון", en: "Hod HaSharon" },
  { ru: "Хариш", he: "חריש", en: "Harish" },
  { ru: "Холон", he: "חולון", en: "Holon" },
  { ru: "Цфат", he: "צפת", en: "Safed" },
  { ru: "Цомет Канот", he: "צומת קנות", en: "Tzomet Kanot" },
  { ru: "Шефарам", he: "שפרעם", en: "Shefa-'Amr" },
  { ru: "Эйлат", he: "אילת", en: "Eilat" },
  { ru: "Эльад", he: "אלעד", en: "El'ad" },
  { ru: "Явне", he: "יבנה", en: "Yavne" },
  { ru: "Рамат Ха Шарон", he: "רמת השרון", en: "Ramat HaSharon" },
  { ru: "Кфар Авив", he: "כפר אביב", en: "Kfar Aviv" },
  { ru: "Кирьят Бял", he: "קריית ביאליק", en: "Kiryat Bialik" },
  { ru: "Кейсария", he: "קיסריה", en: "Caesarea" },
  { ru: "Мицпе Рамон", he: "מצפה רמון", en: "Mitzpe Ramon" },
  { ru: "Маалот-Таршиха", he: "מעלות תרשיחא", en: "Ma'alot-Tarshiha" },
  { ru: "Пардес Хана", he: "פרדס חנה", en: "Pardes Hanna" },
];

async function main() {
  console.log("🗑 Удаляем все вакансии...");
  await prisma.job.deleteMany({});
  console.log("✅ Все вакансии удалены!");

  console.log("🗑 Удаляем всех фейковых пользователей...");
  await prisma.user.deleteMany({
    where: { clerkUserId: { startsWith: "user_" } }
  });
  console.log("✅ Все фейковые пользователи удалены!");

  console.log("🗑 Удаляем все города...");
  await prisma.cityTranslation.deleteMany({});
  await prisma.city.deleteMany({});
  console.log("✅ Все города удалены!");

  console.log("🗑 Удаляем всех соискателей...");
  await prisma.seeker.deleteMany({});
  console.log("✅ Все соискатели удалены!");

  console.log("🗑 Удаляем все категории...");
  await prisma.category.deleteMany({});
  console.log("✅ Все категории удалены!");
  
  console.log("📌 Добавляем города с переводами...");
  for (const city of cities) {
    await prisma.city.create({
      data: {
        name: city.ru, // для уникальности
        translations: {
          create: [
            { lang: 'ru', name: city.ru },
            { lang: 'he', name: city.he },
            { lang: 'en', name: city.en },
          ]
        }
      }
    });
  }
  console.log("✅ Все города с переводами успешно добавлены!");

  const categories = [
    { ru: 'Стройка', he: 'בנייה', en: 'Construction' },
    { ru: 'Уборка', he: 'ניקיון', en: 'Cleaning' },
    { ru: 'Бьюти-индустрия', he: 'תעשיית היופי', en: 'Beauty industry' },
    { ru: 'Гостиницы', he: 'מלונאות', en: 'Hotels' },
    { ru: 'Доставка', he: 'שליחויות', en: 'Delivery' },
    { ru: 'Перевозка', he: 'הובלות', en: 'Transportation' },
    { ru: 'Автосервис', he: 'מוסך', en: 'Auto service' },
    { ru: 'Завод', he: 'מפעל', en: 'Factory' },
    { ru: 'Здоровье', he: 'בריאות', en: 'Health' },
    { ru: 'Инженеры', he: 'מהנדסים', en: 'Engineers' },
    { ru: 'Няни', he: 'מטפלות', en: 'Nannies' },
    { ru: 'Охрана', he: 'אבטחה', en: 'Security' },
    { ru: 'Офис', he: 'משרד', en: 'Office' },
    { ru: 'Общепит', he: 'הסעדה', en: 'Catering' },
    { ru: 'Плотник', he: 'נגר', en: 'Carpenter' },
    { ru: 'Ремонт', he: 'שיפוצים', en: 'Repair' },
    { ru: 'Образование', he: 'חינוך', en: 'Education' },
    { ru: 'Медицина', he: 'רפואה', en: 'Medicine' },
    { ru: 'Склад', he: 'מחסן', en: 'Warehouse' },
    { ru: 'Сварщик', he: 'רתך', en: 'Welder' },
    { ru: 'Связь-телекоммуникации', he: 'תקשורת', en: 'Telecommunications' },
    { ru: 'Сельское хозяйство', he: 'חקלאות', en: 'Agriculture' },
    { ru: 'Уход за пожилыми', he: 'טיפול בקשישים', en: 'Elderly care' },
    { ru: 'Транспорт', he: 'תחבורה', en: 'Transport' },
    { ru: 'Торговля', he: 'מסחר', en: 'Trade' },
    { ru: 'Производство', he: 'ייצור', en: 'Production' },
    { ru: 'Швеи', he: 'תופרות', en: 'Sewing' },
    { ru: 'Электрик', he: 'חשמלאי', en: 'Electrician' },
    { ru: 'Разное', he: 'שונות', en: 'Other' },
  ];
  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.ru, // для уникальности
        translations: {
          create: [
            { lang: 'ru', name: category.ru },
            { lang: 'he', name: category.he },
            { lang: 'en', name: category.en },
          ]
        }
      }
    });
  }

  // Добавляем тестовых соискателей
  const testSeekers = [
    {
      name: "Илона",
      contact: "050-123-45-67, facebook.com/ilona",
      city: "Ашдод",
      description: "няни\nמחפשת לעבוד כמטפלת",
    },
    {
      name: "Софья",
      contact: "050-234-56-78",
      city: "Нагария",
      description: "разное уборка уход-за-пожилыми\nИщу подработку - уборка, няня и так далее.",
    },
    {
      name: "Виктория",
      contact: "050-345-67-89",
      city: "*Центр",
      description: "уход-за-пожилыми\nИщу работу 24/7",
    },
    {
      name: "Константин",
      contact: "050-456-78-90",
      city: "Хайфа",
      description: "транспорт\nИщу работу водителем, права 12 тонн",
    },
  ];

  console.log("📌 Добавляем тестовых соискателей...");
  function generateSlug(name, description) {
    // Простой slug: имя + первая строка описания, латиницей, в нижнем регистре, без пробелов
    return (
      (name + '-' + description.split('\n')[0])
        .toLowerCase()
        .replace(/[^a-zа-я0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
    );
  }
  for (const seeker of testSeekers) {
    await prisma.seeker.create({ data: { ...seeker, slug: generateSlug(seeker.name, seeker.description) } });
  }
  console.log("✅ Тестовые соискатели добавлены!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при выполнении скрипта:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
