const pool = require("./database");

// const createTableQuery = `
//   CREATE TABLE IF NOT EXISTS books (
//     id SERIAL PRIMARY KEY,
//     name TEXT NOT NULL,
//     author TEXT NOT NULL,
//     image TEXT NOT NULL,
//     pdf TEXT NOT NULL,
//     rating REAL,
//     released TEXT NOT NULL,
//     description TEXT NOT NULL
//   );
// `;

// const createQuizesTable = `
//   CREATE TABLE IF NOT EXISTS quizes (
//     id SERIAL PRIMARY KEY,
//     name TEXT NOT NULL,
//     complexity REAL,
//     img TEXT NOT NULL,
//     questions JSONB
//   );
// `;

const seedData = `
INSERT INTO quizes (name, complexity, img, questions,lang)
VALUES
(
    'Hacking',
    3,
    'https://www.svgrepo.com/show/493162/hacker.svg',
    $json$
    [
        {
            "id": 1,
            "question": "Что такое SQL-инъекция?",
            "variants": ["Шифрование данных", "Вставка вредоносного SQL-кода в запрос", "Тип данных", "Сжатие данных"],
            "correct": "Вставка вредоносного SQL-кода в запрос"
        },
        {
            "id": 2,
            "question": "Что такое XSS (Cross-Site Scripting)?",
            "variants": ["Шифрование данных", "Вставка вредоносного скрипта в веб-страницу", "Тип атаки на сервер", "Сжатие данных"],
            "correct": "Вставка вредоносного скрипта в веб-страницу"
        },
        {
            "id": 3,
            "question": "Что такое социальная инженерия?",
            "variants": ["Шифрование данных", "Манипуляция людьми для получения доступа", "Атака на сервер", "Тестирование производительности"],
            "correct": "Манипуляция людьми для получения доступа"
        },
        {
            "id": 4,
            "question": "Что такое перехват сетевого трафика (sniffing)?",
            "variants": ["Шифрование данных", "Анализ сетевых пакетов", "Тип данных", "Сжатие данных"],
            "correct": "Анализ сетевых пакетов"
        },
        {
            "id": 5,
            "question": "Что такое CSRF (Cross-Site Request Forgery)?",
            "variants": ["Шифрование данных", "Выполнение несанкционированных запросов от имени пользователя", "Тип атаки на сервер", "Сжатие данных"],
            "correct": "Выполнение несанкционированных запросов от имени пользователя"
        },
        {
            "id": 6,
            "question": "Что такое брутфорс-атака?",
            "variants": ["Шифрование данных", "Перебор паролей для получения доступа", "Тип данных", "Сжатие данных"],
            "correct": "Перебор паролей для получения доступа"
        },
        {
            "id": 7,
            "question": "Что такое MITM (Man-in-the-Middle)?",
            "variants": ["Шифрование данных", "Перехват связи между двумя сторонами", "Тип атаки на сервер", "Сжатие данных"],
            "correct": "Перехват связи между двумя сторонами"
        },
        {
            "id": 8,
            "question": "Что такое фишинг?",
            "variants": ["Шифрование данных", "Мошенничество для кражи данных", "Тип атаки на сервер", "Сжатие данных"],
            "correct": "Мошенничество для кражи данных"
        },
        {
            "id": 9,
            "question": "Что такое уязвимость нулевого дня?",
            "variants": ["Известная уязвимость", "Неизвестная разработчику уязвимость", "Тип данных", "Шифрование"],
            "correct": "Неизвестная разработчику уязвимость"
        },
        {
            "id": 10,
            "question": "Что такое OWASP?",
            "variants": ["Язык программирования", "Организация по безопасности веб-приложений", "Тип атаки", "База данных"],
            "correct": "Организация по безопасности веб-приложений"
        }
    ]
    $json$,
    ''
);
`;

async function initDB() {
  try {
    // await pool.query(createQuizesTable);
    // console.log("✅ Таблица создана (если не существовала)");

    await pool.query(seedData);
    console.log("✅ Данные добавлены");
  } catch (error) {
    console.error("❌ Ошибка при инициализации:", error);
  }
}

initDB();
