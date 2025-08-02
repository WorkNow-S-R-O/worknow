import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();


const cities = [
  { ru: "Центр страны", he: "מרכז הארץ", en: "Center", ar: "وسط البلاد" },
  { ru: "Юг страны", he: "דרום הארץ", en: "South", ar: "جنوب البلاد" },
  { ru: "Север страны", he: "צפון הארץ", en: "North", ar: "شمال البلاد" },
  { ru: "Акко", he: "עכו", en: "Akko", ar: "عكا" },
  { ru: "Азур", he: "אזור", en: "Azor", ar: "أزور" },
  { ru: "Арад", he: "ערד", en: "Arad", ar: "عراد" },
  { ru: "Ариэль", he: "אריאל", en: "Ariel", ar: "أريئيل" },
  { ru: "Аррабе", he: "עראבה", en: "Arraba", ar: "عرابة" },
  { ru: "Афула", he: "עפולה", en: "Afula", ar: "العفولة" },
  { ru: "Ашдод", he: "אשדוד", en: "Ashdod", ar: "أشدود" },
  { ru: "Ашкелон", he: "אשקלון", en: "Ashkelon", ar: "أشكلون" },
  { ru: "Бака эль Гарбия", he: "באקה אל-גרביה", en: "Baqa al-Gharbiyye", ar: "باقة الغربية" },
  { ru: "Бат Ям", he: "בת ים", en: "Bat Yam", ar: "بات يام" },
  { ru: "Бейт Шеан", he: "בית שאן", en: "Beit She'an", ar: "بيت شان" },
  { ru: "Бейт Шемеш", he: "בית שמש", en: "Beit Shemesh", ar: "بيت شيمش" },
  { ru: "Бейтар Илит", he: "ביתר עילית", en: "Beitar Illit", ar: "بيتر عيليت" },
  { ru: "Беэр Шева", he: "באר שבע", en: "Be'er Sheva", ar: "بئر السبع" },
  { ru: "Беэр Яаков", he: "באר יעקב", en: "Be'er Ya'akov", ar: "بئر يعقوب" },
  { ru: "Бней Брак", he: "בני ברק", en: "Bnei Brak", ar: "بني براك" },
  { ru: "Бней Аиш", he: "בני עיש", en: "Bnei Ayish", ar: "بني عايش" },
  { ru: "Ганей Тиква", he: "גני תקווה", en: "Ganei Tikva", ar: "جاني تيكفا" },
  { ru: "Герцлия", he: "הרצליה", en: "Herzliya", ar: "هرتسليا" },
  { ru: "Ган Явне", he: "גן יבנה", en: "Gan Yavne", ar: "جان يفنه" },
  { ru: "Гиватаим", he: "גבעתיים", en: "Giv'atayim", ar: "جفعاتايم" },
  { ru: "Гиват Шмуэль", he: "גבעת שמואל", en: "Giv'at Shmuel", ar: "جفعات شموئيل" },
  { ru: "Димона", he: "דימונה", en: "Dimona", ar: "ديمونا" },
  { ru: "Иерусалим", he: "ירושלים", en: "Jerusalem", ar: "القدس" },
  { ru: "Йехуд Моноссон", he: "יהוד מונוסון", en: "Yehud Monosson", ar: "يهود مونوسون" },
  { ru: "Йокнеам", he: "יקנעם", en: "Yokneam", ar: "يوكنعام" },
  { ru: "Калансуа", he: "קלנסווה", en: "Kalansuwa", ar: "قلنسوة" },
  { ru: "Кармиэль", he: "כרמיאל", en: "Karmiel", ar: "كرميئيل" },
  { ru: "Кафр Кара", he: "כפר קרע", en: "Kafr Qara", ar: "كفر قرع" },
  { ru: "Кафр Касем", he: "כפר קאסם", en: "Kafr Qasim", ar: "كفر قاسم" },
  { ru: "Кирьят Ата", he: "קריית אתא", en: "Kiryat Ata", ar: "كريات آتا" },
  { ru: "Кирьят Бялик", he: "קריית ביאליק", en: "Kiryat Bialik", ar: "كريات بياليك" },
  { ru: "Кирьят Хаим", he: "קריית חיים", en: "Kiryat Haim", ar: "كريات حاييم" },
  { ru: "Кирьят Гат", he: "קריית גת", en: "Kiryat Gat", ar: "كريات جات" },
  { ru: "Кирьят Малахи", he: "קריית מלאכי", en: "Kiryat Malakhi", ar: "كريات ملاخي" },
  { ru: "Кирьят Моцкин", he: "קריית מוצקין", en: "Kiryat Motzkin", ar: "كريات موتسكين" },
  { ru: "Кирьят Оно", he: "קריית אונו", en: "Kiryat Ono", ar: "كريات أونو" },
  { ru: "Кирьят Шмона", he: "קריית שמונה", en: "Kiryat Shmona", ar: "كريات شمونة" },
  { ru: "Кирьят Ям", he: "קריית ים", en: "Kiryat Yam", ar: "كريات يام" },
  { ru: "Кфар Саба", he: "כפר סבא", en: "Kfar Saba", ar: "كفار سابا" },
  { ru: "Кфар Йона", he: "כפר יונה", en: "Kfar Yona", ar: "كفار يونا" },
  { ru: "Лод", he: "לוד", en: "Lod", ar: "اللد" },
  { ru: "Маале Адумим", he: "מעלה אדומים", en: "Ma'ale Adumim", ar: "معاليه أدوميم" },
  { ru: "Маалот Таршиха", he: "מעלות תרשיחא", en: "Ma'alot-Tarshiha", ar: "معالوت ترشيحا" },
  { ru: "Магар", he: "מגאר", en: "Maghar", ar: "مغار" },
  { ru: "Модиин", he: "מודיעין", en: "Modiin", ar: "موديعين" },
  { ru: "Мигдаль ха Эмек", he: "מגדל העמק", en: "Migdal HaEmek", ar: "مجدال هعيمك" },
  { ru: "Модиин Илит", he: "מודיעין עילית", en: "Modiin Illit", ar: "موديعين عيليت" },
  { ru: "Маалот", he: "מעלות", en: "Ma'alot", ar: "معالوت" },
  { ru: "Модиин Маккабим Реут", he: "מודיעין מכבים רעות", en: "Modiin Maccabim Reut", ar: "موديعين مكابيم رعوت" },
  { ru: "Мигдаль Ха-Эмек", he: "מגדל העמק", en: "Migdal HaEmek", ar: "مجدال هعيمك" },
  { ru: "Нагария", he: "נהריה", en: "Nahariya", ar: "نهاريا" },
  { ru: "Назарет", he: "נצרת", en: "Nazareth", ar: "الناصرة" },
  { ru: "Ноф ха Галиль", he: "נוף הגליל", en: "Nof HaGalil", ar: "نوف هجليل" },
  { ru: "Нес Циона", he: "נס ציונה", en: "Ness Ziona", ar: "نس تسيونا" },
  { ru: "Натания", he: "נתניה", en: "Netanya", ar: "نتانيا" },
  { ru: "Нетивот", he: "נתיבות", en: "Netivot", ar: "نتيفوت" },
  { ru: "Наария", he: "נהריה", en: "Nahariya", ar: "نهاريا" },
  { ru: "Нацрат Илит", he: "נצרת עילית", en: "Nazareth Illit", ar: "الناصرة العليا" },
  { ru: "Нешер", he: "נשר", en: "Nesher", ar: "نيشر" },
  { ru: "Ор Акива", he: "אור עקיבא", en: "Or Akiva", ar: "أور عكيفا" },
  { ru: "Ор Йехуда", he: "אור יהודה", en: "Or Yehuda", ar: "أور يهودا" },
  { ru: "Офаким", he: "אופקים", en: "Ofakim", ar: "أوفاكيم" },
  { ru: "Петах Тиква", he: "פתח תקווה", en: "Petah Tikva", ar: "بيتاح تكفا" },
  { ru: "Раанана", he: "רעננה", en: "Ra'anana", ar: "رعنانا" },
  { ru: "Рамат Ган", he: "רמת גן", en: "Ramat Gan", ar: "رمات جان" },
  { ru: "Рамла", he: "רמלה", en: "Ramla", ar: "الرملة" },
  { ru: "Рахат", he: "רהט", en: "Rahat", ar: "رهط" },
  { ru: "Реховот", he: "רחובות", en: "Rehovot", ar: "رحوفوت" },
  { ru: "Ришон ле Цион", he: "ראשון לציון", en: "Rishon LeZion", ar: "ريشون لتسيون" },
  { ru: "Рош Аин", he: "ראש העין", en: "Rosh HaAyin", ar: "روش هاعين" },
  { ru: "Сахнин", he: "סח'נין", en: "Sakhnin", ar: "سخنين" },
  { ru: "Сдерот", he: "שדרות", en: "Sderot", ar: "سديروت" },
  { ru: "Тайбе", he: "טייבה", en: "Tayibe", ar: "الطيبة" },
  { ru: "Тамра", he: "טמרה", en: "Tamra", ar: "طمرة" },
  { ru: "Тверия", he: "טבריה", en: "Tiberias", ar: "طبريا" },
  { ru: "Тель Авив", he: "תל אביב", en: "Tel Aviv", ar: "تل أبيب" },
  { ru: "Тира", he: "טירה", en: "Tira", ar: "الطيرة" },
  { ru: "Тират Кармель", he: "טירת כרמל", en: "Tirat Carmel", ar: "طيرة الكرمل" },
  { ru: "Умм-эль Фахм", he: "אום אל-פחם", en: "Umm al-Fahm", ar: "أم الفحم" },
  { ru: "Хадера", he: "חדרה", en: "Hadera", ar: "الخضيرة" },
  { ru: "Хайфа", he: "חיפה", en: "Haifa", ar: "حيفا" },
  { ru: "Хедера", he: "חדרה", en: "Hadera", ar: "الخضيرة" },
  { ru: "Ход Ха Шарон", he: "הוד השרון", en: "Hod HaSharon", ar: "هود هشارون" },
  { ru: "Хариш", he: "חריש", en: "Harish", ar: "حريش" },
  { ru: "Холон", he: "חולון", en: "Holon", ar: "حولون" },
  { ru: "Цфат", he: "צפת", en: "Safed", ar: "صفد" },
  { ru: "Цомет Канот", he: "צומת קנות", en: "Tzomet Kanot", ar: "مفترق كانوت" },
  { ru: "Шефарам", he: "שפרעם", en: "Shefa-'Amr", ar: "شفاعمرو" },
  { ru: "Эйлат", he: "אילת", en: "Eilat", ar: "إيلات" },
  { ru: "Эльад", he: "אלעד", en: "El'ad", ar: "إلعاد" },
  { ru: "Явне", he: "יבנה", en: "Yavne", ar: "يفنه" },
  { ru: "Рамат Ха Шарон", he: "רמת השרון", en: "Ramat HaSharon", ar: "رمات هشارون" },
  { ru: "Кфар Авив", he: "כפר אביב", en: "Kfar Aviv", ar: "كفار أبيب" },
  { ru: "Кирьят Бял", he: "קריית ביאליק", en: "Kiryat Bialik", ar: "كريات بياليك" },
  { ru: "Кейсария", he: "קיסריה", en: "Caesarea", ar: "قيصرية" },
  { ru: "Мицпе Рамон", he: "מצפה רמון", en: "Mitzpe Ramon", ar: "متسبيه رامون" },
  { ru: "Маалот-Таршиха", he: "מעלות תרשיחא", en: "Ma'alot-Tarshiha", ar: "معالوت ترشيحا" },
  { ru: "Пардес Хана", he: "פרדס חנה", en: "Pardes Hanna", ar: "برديس حنا" }
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

  console.log("🗑 Удаляем всех соискателей...");
  await prisma.seeker.deleteMany({});
  console.log("✅ Все соискатели удалены!");

  console.log("🗑 Удаляем переводы категорий...");
  await prisma.categoryTranslation.deleteMany({});
  console.log("✅ Все переводы категорий удалены!");

  console.log("🗑 Удаляем все категории...");
  await prisma.category.deleteMany({});
  console.log("✅ Все категории удалены!");

  console.log("🗑 Удаляем переводы городов...");
  await prisma.cityTranslation.deleteMany({});
  console.log("✅ Все переводы городов удалены!");

  console.log("🗑 Удаляем все города...");
  await prisma.city.deleteMany({});
  console.log("✅ Все города удалены!");
  
  console.log("📌 Добавляем города с переводами...");
  for (const city of cities) {
    await prisma.city.create({
      data: {
        name: city.ru,
        translations: {
          create: [
            { lang: 'ru', name: city.ru },
            { lang: 'he', name: city.he },
            { lang: 'en', name: city.en },
            { lang: 'ar', name: city.ar },
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
  
  console.log("📌 Добавляем категории с переводами...");
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
  console.log("✅ Все категории с переводами успешно добавлены!");

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
  
  console.log("\n🎉 База данных успешно заполнена!");
  console.log("📊 Статистика:");
  console.log(`   - Города: ${cities.length}`);
  console.log(`   - Категории: ${categories.length}`);
  console.log(`   - Тестовые соискатели: ${testSeekers.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при выполнении скрипта:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
