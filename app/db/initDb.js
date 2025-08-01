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
  INSERT INTO quizes (name, complexity, img, questions)
  VALUES
   (
        'HTML продвинутый уровень',
        5,
        'https://itproger.com/img/tests/html.svg',
        $json$
        [
         {
    "id": 1,
    "question": "Какой тег используется для создания встроенных SVG-графиков?",
    "variants": ["<svg>", "<canvas>", "<img>", "<vector>"],
    "correct": "<svg>"
  },
  {
    "id": 2,
    "question": "Что делает атрибут crossorigin у тега <script>?",
    "variants": [
      "Позволяет загрузить скрипт с другого домена с кросс-доменной политикой",
      "Отключает выполнение скрипта",
      "Включает отладку",
      "Устанавливает порядок загрузки"
    ],
    "correct": "Позволяет загрузить скрипт с другого домена с кросс-доменной политикой"
  },
  {
    "id": 3,
    "question": "Что делает тег <template> в HTML5?",
    "variants": [
      "Содержит контент, который не отображается, но может быть клонирован и вставлен в DOM с помощью JS",
      "Создаёт модальное окно",
      "Определяет стили",
      "Автоматически выполняет скрипт"
    ],
    "correct": "Содержит контент, который не отображается, но может быть клонирован и вставлен в DOM с помощью JS"
  },
  {
    "id": 4,
    "question": "Что делает атрибут defer у тега <script>?",
    "variants": [
      "Загружает скрипт асинхронно, но выполняет после парсинга HTML",
      "Выполняет скрипт сразу",
      "Блокирует загрузку страницы",
      "Запускает скрипт только при событии"
    ],
    "correct": "Загружает скрипт асинхронно, но выполняет после парсинга HTML"
  },
  {
    "id": 5,
    "question": "Какой атрибут позволяет включить автоматическую проверку формы в браузере?",
    "variants": ["validate", "check", "novalidate", "required"],
    "correct": "required"
  },
  {
    "id": 6,
    "question": "Что такое ARIA-атрибуты?",
    "variants": [
      "Атрибуты для доступности веб-контента",
      "Стили CSS",
      "Типы скриптов",
      "Устаревшие теги"
    ],
    "correct": "Атрибуты для доступности веб-контента"
  },
  {
    "id": 7,
    "question": "Что делает тег <picture>?",
    "variants": [
      "Позволяет использовать разные изображения для разных размеров экрана",
      "Создаёт галерею",
      "Добавляет фильтр к изображению",
      "Вставляет видео"
    ],
    "correct": "Позволяет использовать разные изображения для разных размеров экрана"
  },
  {
    "id": 8,
    "question": "Какой тег используется для определения области виджета на странице?",
    "variants": ["<section>", "<article>", "<aside>", "<widget>"],
    "correct": "<section>"
  },
  {
    "id": 9,
    "question": "Что такое Shadow DOM?",
    "variants": [
      "Изолированное DOM-дерево внутри компонента",
      "Основное дерево DOM",
      "Атрибут для стилизации",
      "API для работы с localStorage"
    ],
    "correct": "Изолированное DOM-дерево внутри компонента"
  },
  {
    "id": 10,
    "question": "Какой тег используется для определения цитаты?",
    "variants": ["<quote>", "<q>", "<cite>", "<blockquote>"],
    "correct": "<blockquote>"
  }]
      $json$
    );
`;

//  (
//         'HTML начальный уровень',
//         2.0,
//         'https://itproger.com/img/tests/html.svg',
//         $json$
//         [
//          {
//     "id": 1,
//     "question": "Какой тег используется для создания гиперссылки?",
//     "variants": ["<link>", "<href>", "<a>", "<url>"],
//     "correct": "<a>"
//   },
//   {
//     "id": 2,
//     "question": "Что выведет следующий HTML?humo<p>Hello <b>world</b>!</p>",
//     "variants": ["Hello **world**!", "Hello world!", "Hello world", "<p>Hello world!</p>"],
//     "correct": "Hello **world**!"
//   },
//   {
//     "id": 3,
//     "question": "Какой тег используется для вставки изображения?",
//     "variants": ["<img src=\\\"...\\\" />", "<image>", "<pic>", "<img>"],
//     "correct": "<img>"
//   },
//   {
//     "id": 4,
//     "question": "Где правильно подключить внешний CSS-файл?",
//     "variants": [
//       "Перед закрывающим тегом <body>",
//       "Внутри <head>",
//       "Внутри <footer>",
//       "В любом месте"
//     ],
//     "correct": "Внутри <head>"
//   },
//   {
//     "id": 5,
//     "question": "Что делает атрибут alt в теге <img>?",
//     "variants": [
//       "Описывает изображение для случая, если оно не загрузится",
//       "Добавляет альтернативное изображение",
//       "Изменяет размер",
//       "Применяет стили"
//     ],
//     "correct": "Описывает изображение для случая, если оно не загрузится"
//   },
//   {
//     "id": 6,
//     "question": "Что такое семантические теги?",
//     "variants": [
//       "Теги, описывающие смысл содержимого",
//       "Теги для стилизации",
//       "Теги с JavaScript",
//       "Устаревшие теги"
//     ],
//     "correct": "Теги, описывающие смысл содержимого"
//   },
//   {
//     "id": 7,
//     "question": "Какой тег используется для создания списка с маркерами?",
//     "variants": ["<ol>", "<ul>", "<li>", "<list>"],
//     "correct": "<ul>"
//   },
//   {
//     "id": 8,
//     "question": "Какой атрибут делает поле <input> обязательным?",
//     "variants": ["need", "required", "must", "validate"],
//     "correct": "required"
//   },
//   {
//     "id": 9,
//     "question": "Какой тег определяет заголовок 1 уровня?",
//     "variants": ["<title>", "<h1>", "<head>", "<header>"],
//     "correct": "<h1>"
//   },
//   {
//     "id": 10,
//     "question": "Что делает тег <br>?",
//     "variants": [
//       "Вставляет перенос строки",
//       "Делает текст жирным",
//       "Заканчивает абзац",
//       "Создает разрыв секции"
//     ],
//     "correct": "Вставляет перенос строки"
//   }]
//     $json$
//     );


//  (
//         'Java Scripts продвинутый уровень',
//         5,
//         'https://itproger.com/img/tests/node-js.svg',
//         $json$
//         [
//         {
//     "id": 1,
//     "question": "Что выведет этот код?humolet a = {};let b = a;a = null;console.log(b);",
//     "variants": ["{}", "null", "undefined", "Ошибка"],
//     "correct": "{}"
//   },
//   {
//     "id": 2,
//     "question": "Что делает замыкание (closure)?",
//     "variants": [
//       "Сохраняет доступ к переменным внешней функции",
//       "Удаляет переменные",
//       "Очищает память",
//       "Создает асинхронность"
//     ],
//     "correct": "Сохраняет доступ к переменным внешней функции"
//   },
//   {
//     "id": 3,
//     "question": "Что выведет следующий код?humoconsole.log(typeof NaN);",
//     "variants": ["\\\"number\\\"", "\\\"NaN\\\"", "\\\"undefined\\\"", "\\\"null\\\""],
//     "correct": "\\\"number\\\""
//   },
//   {
//     "id": 4,
//     "question": "Какой будет результат?humo(() => {let x = 10;return (() => x + 5)();})();",
//     "variants": ["15", "undefined", "10", "NaN"],
//     "correct": "15"
//   },
//   {
//     "id": 5,
//     "question": "Какое ключевое слово позволяет остановить выполнение цикла?",
//     "variants": ["skip", "end", "break", "stop"],
//     "correct": "break"
//   },
//   {
//     "id": 6,
//     "question": "Что произойдет при этом вызове?humo[...\\\"hello\\\"]",
//     "variants": [
//       "[\\\"h\\\",\\\"e\\\",\\\"l\\\",\\\"l\\\",\\\"o\\\"]",
//       "Ошибка",
//       "\\\"hello\\\"",
//       "undefined"
//     ],
//     "correct": "[\\\"h\\\",\\\"e\\\",\\\"l\\\",\\\"l\\\",\\\"o\\\"]"
//   },
//   {
//     "id": 7,
//     "question": "Что делает оператор Object.freeze(obj)?",
//     "variants": [
//       "Делает объект неизменяемым",
//       "Удаляет все свойства",
//       "Глубоко клонирует",
//       "Удаляет прототип"
//     ],
//     "correct": "Делает объект неизменяемым"
//   },
//   {
//     "id": 8,
//     "question": "Какой вывод даст?humofunction foo() {return; { bar: \\\"value\\\" } } console.log(foo());",
//     "variants": ["undefined", "{ bar: \\\"value\\\" }", "SyntaxError", "null"],
//     "correct": "undefined"
//   },
//   {
//     "id": 9,
//     "question": "Что вернёт Promise.resolve(5).then(console.log)?",
//     "variants": ["5", "Promise", "undefined", "Ошибка"],
//     "correct": "5"
//   },
//   {
//     "id": 10,
//     "question": "Какая структура данных лучше всего подходит для LRU-кэша?",
//     "variants": ["Массив", "Объект", "Map", "Set"],
//     "correct": "Map"
//   }

//         ]
//         $json$
//     );

// (
//         'HTML начальный уровень',
//         2.0,
//         'https://itproger.com/img/tests/html.svg',
//         $json$
//         [
//          {
//     "id": 1,
//     "question": "Какой тег используется для создания гиперссылки?",
//     "variants": ["<link>", "<href>", "<a>", "<url>"],
//     "correct": "<a>"
//   },
//   {
//     "id": 2,
//     "question": "Что выведет следующий HTML?humo<p>Hello <b>world</b>!</p>",
//     "variants": ["Hello **world**!", "Hello world!", "Hello world", "<p>Hello world!</p>"],
//     "correct": "Hello **world**!"
//   },
//   {
//     "id": 3,
//     "question": "Какой тег используется для вставки изображения?",
//     "variants": ['<img src=\\\"...\\\" />', "<image>", "<pic>", "<img>"],
//     "correct": "<img>"
//   },
//   {
//     "id": 4,
//     "question": "Где правильно подключить внешний CSS-файл?",
//     "variants": [
//       "Перед закрывающим тегом <body>",
//       "Внутри <head>",
//       "Внутри <footer>",
//       "В любом месте"
//     ],
//     "correct": "Внутри <head>"
//   },
//   {
//     "id": 5,
//     "question": "Что делает атрибут alt в теге <img>?",
//     "variants": [
//       "Описывает изображение для случая, если оно не загрузится",
//       "Добавляет альтернативное изображение",
//       "Изменяет размер",
//       "Применяет стили"
//     ],
//     "correct": "Описывает изображение для случая, если оно не загрузится"
//   },
//   {
//     "id": 6,
//     "question": "Что такое семантические теги?",
//     "variants": [
//       "Теги, описывающие смысл содержимого",
//       "Теги для стилизации",
//       "Теги с JavaScript",
//       "Устаревшие теги"
//     ],
//     "correct": "Теги, описывающие смысл содержимого"
//   },
//   {
//     "id": 7,
//     "question": "Какой тег используется для создания списка с маркерами?",
//     "variants": ["<ol>", "<ul>", "<li>", "<list>"],
//     "correct": "<ul>"
//   },
//   {
//     "id": 8,
//     "question": "Какой атрибут делает поле <input> обязательным?",
//     "variants": ["need", "required", "must", "validate"],
//     "correct": "required"
//   },
//   {
//     "id": 9,
//     "question": "Какой тег определяет заголовок 1 уровня?",
//     "variants": ["<title>", "<h1>", "<head>", "<header>"],
//     "correct": "<h1>"
//   },
//   {
//     "id": 10,
//     "question": "Что делает тег <br>?",
//     "variants": [
//       "Вставляет перенос строки",
//       "Делает текст жирным",
//       "Заканчивает абзац",
//       "Создает разрыв секции"
//     ],
//     "correct": "Вставляет перенос строки"
//   },
//         ]
//         $json$
//     ),
//      (
//         'HTML средний уровень',
//         3.5,
//         'https://itproger.com/img/tests/html.svg',
//         $json$
//         [
//         {
//     "id": 1,
//     "question": "Какой результат этого кода?humo<input type=\"checkbox\" checked>\",
//     "variants": [
//       "Чекбокс будет неактивен",
//       "Чекбокс будет изначально выбран",
//       "Ошибка",
//       "Ничего не произойдёт"
//     ],
//     "correct": "Чекбокс будет изначально выбран"
//   },
//   {
//     "id": 2,
//     "question": "Какой тег используется для создания выпадающего списка?",
//     "variants": ["<list>", "<menu>", "<select>", "<dropdown>"],
//     "correct": "<select>"
//   },
//   {
//     "id": 3,
//     "question": "Как вставить комментарий в HTML?",
//     "variants": ["// комментарий", "/* комментарий */", "<!-- комментарий -->", "# комментарий"],
//     "correct": "<!-- комментарий -->"
//   },
//   {
//     "id": 4,
//     "question": "Что делает атрибут action у формы?",
//     "variants": [
//       "Указывает URL для отправки данных",
//       "Запускает JavaScript",
//       "Сохраняет форму",
//       "Проверяет форму"
//     ],
//     "correct": "Указывает URL для отправки данных"
//   },
//   {
//     "id": 5,
//     "question": "Какой тег используется для встраивания другого HTML-документа?",
//     "variants": ["<div>", "<script>", "<iframe>", "<embed>"],
//     "correct": "<iframe>"
//   },
//   {
//     "id": 6,
//     "question": "Какое значение имеет атрибут target=\"_blank\" у ссылки?",
//     "variants": [
//       "Открывает ссылку в том же окне",
//       "Открывает в новой вкладке",
//       "Делает ссылку неактивной",
//       "Скрывает ссылку"
//     ],
//     "correct": "Открывает в новой вкладке"
//   },
//   {
//     "id": 7,
//     "question": "Какой атрибут задает текст, отображаемый при наведении?",
//     "variants": ["label", "alt", "title", "hover"],
//     "correct": "title"
//   },
//   {
//     "id": 8,
//     "question": "Что делает тег <label for=\"email\">?",
//     "variants": [
//       "Связывает текст с input-элементом с id=\"email\"",
//       "Добавляет стили",
//       "Создает поле",
//       "Валидирует email"
//     ],
//     "correct": "Связывает текст с input-элементом с id=\"email\""
//   },
//   {
//     "id": 9,
//     "question": "Какой тег HTML5 используется для навигации?",
//     "variants": ["<nav>", "<menu>", "<nav>", "<navigate>"],
//     "correct": "<nav>"
//   },
//   {
//     "id": 10,
//     "question": "Какой элемент HTML5 используется для группировки основного контента?",
//     "variants": ["<body>", "<div>", "<main>", "<section>"],
//     "correct": "<main>"
//   },
// ]
//         $json$
//     ),
//      (
//         'HTML продвинутый уровень',
//         2.0,
//         'https://itproger.com/img/tests/html.svg',
//         $json$
//         [
//          {
//     "id": 1,
//     "question": "Какой тег используется для создания встроенных SVG-графиков?",
//     "variants": ["<svg>", "<canvas>", "<img>", "<vector>"],
//     "correct": "<svg>"
//   },
//   {
//     "id": 2,
//     "question": "Что делает атрибут crossorigin у тега <script>?",
//     "variants": [
//       "Позволяет загрузить скрипт с другого домена с кросс-доменной политикой",
//       "Отключает выполнение скрипта",
//       "Включает отладку",
//       "Устанавливает порядок загрузки"
//     ],
//     "correct": "Позволяет загрузить скрипт с другого домена с кросс-доменной политикой"
//   },
//   {
//     "id": 3,
//     "question": "Что делает тег <template> в HTML5?",
//     "variants": [
//       "Содержит контент, который не отображается, но может быть клонирован и вставлен в DOM с помощью JS",
//       "Создаёт модальное окно",
//       "Определяет стили",
//       "Автоматически выполняет скрипт"
//     ],
//     "correct": "Содержит контент, который не отображается, но может быть клонирован и вставлен в DOM с помощью JS"
//   },
//   {
//     "id": 4,
//     "question": "Что делает атрибут defer у тега <script>?",
//     "variants": [
//       "Загружает скрипт асинхронно, но выполняет после парсинга HTML",
//       "Выполняет скрипт сразу",
//       "Блокирует загрузку страницы",
//       "Запускает скрипт только при событии"
//     ],
//     "correct": "Загружает скрипт асинхронно, но выполняет после парсинга HTML"
//   },
//   {
//     "id": 5,
//     "question": "Какой атрибут позволяет включить автоматическую проверку формы в браузере?",
//     "variants": ["validate", "check", "novalidate", "required"],
//     "correct": "required"
//   },
//   {
//     "id": 6,
//     "question": "Что такое ARIA-атрибуты?",
//     "variants": [
//       "Атрибуты для доступности веб-контента",
//       "Стили CSS",
//       "Типы скриптов",
//       "Устаревшие теги"
//     ],
//     "correct": "Атрибуты для доступности веб-контента"
//   },
//   {
//     "id": 7,
//     "question": "Что делает тег <picture>?",
//     "variants": [
//       "Позволяет использовать разные изображения для разных размеров экрана",
//       "Создаёт галерею",
//       "Добавляет фильтр к изображению",
//       "Вставляет видео"
//     ],
//     "correct": "Позволяет использовать разные изображения для разных размеров экрана"
//   },
//   {
//     "id": 8,
//     "question": "Какой тег используется для определения области виджета на странице?",
//     "variants": ["<section>", "<article>", "<aside>", "<widget>"],
//     "correct": "<section>"
//   },
//   {
//     "id": 9,
//     "question": "Что такое Shadow DOM?",
//     "variants": [
//       "Изолированное DOM-дерево внутри компонента",
//       "Основное дерево DOM",
//       "Атрибут для стилизации",
//       "API для работы с localStorage"
//     ],
//     "correct": "Изолированное DOM-дерево внутри компонента"
//   },
//   {
//     "id": 10,
//     "question": "Какой тег используется для определения цитаты?",
//     "variants": ["<quote>", "<q>", "<cite>", "<blockquote>"],
//     "correct": "<blockquote>"
//   }]
//       $json$
//     )

//  INSERT INTO quizes (name, complexity, img, questions)
//  VALUES
//   (
//         'Java Script basics',
//         2.0,
//         'https://itproger.com/img/tests/node-js.svg',
//         '[
//             {
//                 "id": 1,
//                 "question": "What does DOM stand for in JavaScript?",
//                 "variants": ["Document Object Model", "Data Object Model", "Document Order Model", "Dynamic Object Manipulation"],
//                 "correct": "Document Object Model",
//
//             },
//             {
//                 "id": 2,
//                 "question": "Which of the following is NOT a primitive data type in JavaScript?",
//                 "variants": ["String", "Array", "Boolean", "Number"],
//                 "correct": "Array",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 3,
//                 "question": "What does the typeof operator return for a function in JavaScript?",
//                 "variants": [\"function\", \"object\", \"array\", \"undefined\"],
//                 "correct": \"object\",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 4,
//                 "question": "Which method is used to add a new element at the end of an array in JavaScript?",
//                 "variants": ["push()", "add()", "append()", "insert()"],
//                 "correct": "push()",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 5,
//                 "question": "What is the purpose of setTimeout() function in JavaScript?",
//                 "variants": ["To pause the execution of a function for a specific time period", "To execute a function after a specific time interval", "To set the timeout for AJAX requests", "To set the time zone of the browser"],
//                 "correct": "To execute a function after a specific time interval",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 6,
//                 "question": "Какие функции выполняет JS?",
//                 "variants": ["Выполняет работу с сервером", "Создает разметку на странице сайта", "Создает стилевое оформление сайта", "Отвечает за функции на стороне клиента"],
//                 "correct": "Отвечает за функции на стороне клиента",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 7,
//                 "question": "Which method is used to remove the last element from an array in JavaScript?",
//                 "variants": ["pop()", "remove()", "deleteLast()", "splice()"],
//                 "correct": "pop()",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 8,
//                 "question": "What does the NaN keyword represent in JavaScript?",
//                 "variants": ["Not a Number", "Null and None", "Negative Number", "Numeric Array"],
//                 "correct": "Not a Number",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 9,
//                 "question": "Which operator is used to concatenate two or more strings in JavaScript?",
//                 "variants": ["+", "&", "||", ","],
//                 "correct": "+",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 10,
//                 "question": "What does the spread syntax (...) do when used with objects in JavaScript?",
//                 "variants": ["Combines multiple objects into one object", "Creates a shallow copy of an object", "Converts an object into an array of its values", "Adds new properties to an existing object"],
//                 "correct": "Creates a shallow copy of an object",
//                 "selected": null,
//                 "isCorrect": false
//             }
//         ]'::jsonb
//     ),
//     (
//         'React quiz',
//         3.5,
//         'https://itproger.com/img/tests/react-js.svg',
//         '[
//             {
//                 "id": 1,
//                 "question": "Which of the following best describes the purpose of React''s useReducer() hook?",
//                 "variants": ["To manage complex state logic in functional components.", "To handle side effects in functional components.", "To control the rendering behavior of functional components.", "To create reusable components in React."],
//                 "correct": "To manage complex state logic in functional components.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 2,
//                 "question": "In React, what is the primary role of the key prop when rendering lists?",
//                 "variants": ["It specifies the index of the element in the list.", "It uniquely identifies each element in the list.", "It defines the styling for each element in the list.", "It determines the order of elements in the list."],
//                 "correct": "It uniquely identifies each element in the list.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 3,
//                 "question": "Which of the following accurately describes React''s virtual DOM?",
//                 "variants": ["It''s an alternative to the actual DOM used in server-side rendering.", "It''s a lightweight version of the actual DOM used for testing purposes.", "It''s an in-memory representation of the actual DOM, used to improve performance.", "It''s a separate layer between React components and the browser''s rendering engine."],
//                 "correct": "It''s an in-memory representation of the actual DOM, used to improve performance.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 4,
//                 "question": "What does React''s Fragment component allow you to do?",
//                 "variants": ["Create reusable component templates.", "Render multiple children without a parent wrapper.", "Define custom lifecycle methods for functional components.", "Implement conditional rendering in React components."],
//                 "correct": "Render multiple children without a parent wrapper.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 5,
//                 "question": "In React, what is the primary purpose of the React.memo() function?",
//                 "variants": ["To memoize data fetching operations.", "To create higher-order components.", "To memoize the output of functional components.", "To optimize rendering performance of class components."],
//                 "correct": "To memoize the output of functional components.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 6,
//                 "question": "Which of the following hooks is used for performing side effects in React functional components?",
//                 "variants": [\"useState()\", \"useEffect()\", \"useReducer()\", \"useContext()\"],
//                 "correct": \"useEffect()\",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 7,
//                 "question": "What is the primary difference between controlled and uncontrolled components in React?",
//                 "variants": ["Controlled components are stateless, while uncontrolled components manage their own state.", "Controlled components manage their own state internally, while uncontrolled components rely on external state management.", "Controlled components use the virtual DOM, while uncontrolled components directly manipulate the actual DOM.", "Controlled components have their form elements'' values controlled by React state, while uncontrolled components manage their own state internally."],
//                 "correct": "Controlled components have their form elements'' values controlled by React state, while uncontrolled components manage their own state internally.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 8,
//                 "question": "Which of the following statements accurately describes React''s context API?",
//                 "variants": ["It provides a way to pass data through the component tree without using props.", "It allows components to share state without using Redux or other state management libraries.", "It''s primarily used for routing purposes in React applications.", "It''s a tool for defining global CSS styles in React components."],
//                 "correct": "It provides a way to pass data through the component tree without using props.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 9,
//                 "question": "What is the primary role of the useCallback() hook in React?",
//                 "variants": ["To memoize functions, preventing unnecessary re-renders of components.", "To manage complex state logic in functional components.", "To handle asynchronous data fetching operations.", "To create reusable custom hooks for React components."],
//                 "correct": "To memoize functions, preventing unnecessary re-renders of components.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 10,
//                 "question": "Which of the following accurately describes the difference between class components and functional components in React?",
//                 "variants": ["Class components have access to lifecycle methods, while functional components do not.", "Functional components can have local state, while class components cannot.", "Class components use arrow functions for rendering, while functional components use regular functions.", "Functional components can only be used for presentational purposes, while class components are required for business logic."],
//                 "correct": "Class components have access to lifecycle methods, while functional components do not.",
//                 "selected": null,
//                 "isCorrect": false
//             }
//         ]'::jsonb
//     ),
//     (
//         'HTML & CSS',
//         2.5,
//         'https://itproger.com/img/tests/html.svg',
//         '[
//             {
//                 "id": 1,
//                 "question": "What does HTML stand for?",
//                 "variants": ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"],
//                 "correct": "Hyper Text Markup Language",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 2,
//                 "question": "Which tag is used to define an unordered list in HTML?",
//                 "variants": ["<ul>", "<ol>", "<li>", "<list>"],
//                 "correct": "<ul>",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 3,
//                 "question": "What does CSS stand for?",
//                 "variants": ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
//                 "correct": "Cascading Style Sheets",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 4,
//                 "question": "Which CSS property is used to change the text color of an element?",
//                 "variants": ["text-color", "color", "font-color", "text-style"],
//                 "correct": "color",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 5,
//                 "question": "What is the correct HTML element for inserting a line break?",
//                 "variants": ["<br>", "<break>", "<lb>", "<line>"],
//                 "correct": "<br>",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 6,
//                 "question": "Which CSS property controls the spacing between elements?",
//                 "variants": ["margin", "padding", "space", "gap"],
//                 "correct": "gap",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 7,
//                 "question": "What is the purpose of the HTML <head> tag?",
//                 "variants": ["It defines the main content of the document.", "It contains metadata about the document.", "It specifies a header for a document or section.", "It defines a footer for a document or section."],
//                 "correct": "It contains metadata about the document.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 8,
//                 "question": "How can you make a text appear bold in HTML?",
//                 "variants": ["<strong>", "<bold>", "<b>", "<big>"],
//                 "correct": "<strong>",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 9,
//                 "question": "Which CSS property is used to set the background color of an element?",
//                 "variants": ["color", "background-color", "background", "bgcolor"],
//                 "correct": "background-color",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 10,
//                 "question": "What is the correct HTML for creating a hyperlink?",
//                 "variants": ["<a href=\\\"https://example.com\\\">Click here</a>", "<link href=\\\"https://example.com\\\">", "<hyperlink>https://example.com</hyperlink>", "<href=\\\"https://example.com\\\">Click here</href>"],
//                 "correct": "<a href=\\\"https://example.com\\\">Click here</a>",
//                 "selected": null,
//                 "isCorrect": false
//             }
//         ]'::jsonb
//     ),
//     (
//         'Python',
//         5.0,
//         'https://itproger.com/img/tests/python.svg',
//         '[
//             {
//                 "id": 1,
//                 "question": "What is the purpose of the lambda function in Python?",
//                 "variants": ["To create anonymous functions", "To define class methods", "To perform mathematical operations only", "To declare global variables"],
//                 "correct": "To create anonymous functions",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 2,
//                 "question": "What does the zip() function do in Python?",
//                 "variants": ["Combines two dictionaries into one", "Matches elements of iterables based on index", "Sorts elements in ascending order", "Reverses the order of elements in a list"],
//                 "correct": "Matches elements of iterables based on index",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 3,
//                 "question": "What is the difference between append() and extend() methods in Python lists?",
//                 "variants": ["append() adds an element to the end of a list, while extend() adds multiple elements to the end of a list.", "append() adds multiple elements to a list, while extend() adds an element to the end of a list.", "Both append() and extend() add elements to the beginning of a list.", "append() and extend() are used interchangeably in Python."],
//                 "correct": "append() adds an element to the end of a list, while extend() adds multiple elements to the end of a list.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 4,
//                 "question": "What is the output of 2 ** 3 ** 2 in Python?",
//                 "variants": ["64", "512", "12", "144"],
//                 "correct": "512",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 5,
//                 "question": "How do you open a file named \\\"data.txt\\\" in read mode in Python?",
//                 "variants": ["file = open(\\\"data.txt\\\", mode=\\\"r\\\")", "file = open(\\\"data.txt\\\", \\\"read\\\")", "file = open(\\\"data.txt\\\")", "file = open(\\\"data.txt\\\", mode=\\\"read\\\")"],
//                 "correct": "file = open(\\\"data.txt\\\")",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 6,
//                 "question": "What is the purpose of the __init__ method in Python classes?",
//                 "variants": ["To initialize class variables", "To define private methods", "To create instances of the class", "To define class attributes"],
//                 "correct": "To initialize class variables",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 7,
//                 "question": "What does the super() function do in Python?",
//                 "variants": ["Calls the superclass constructor", "Returns a list of all superclass methods", "Accesses private variables of the superclass", "Terminates the program execution"],
//                 "correct": "Calls the superclass constructor",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 8,
//                 "question": "What is the difference between a shallow copy and a deep copy in Python?",
//                 "variants": ["A shallow copy creates a new object with references to the original nested objects, while a deep copy creates a completely independent copy of nested objects.", "A shallow copy creates a completely independent copy of nested objects, while a deep copy creates a new object with references to the original nested objects", "Both shallow copy and deep copy create new objects with references to the original nested objects.", "Shallow copy and deep copy are synonymous in Python."],
//                 "correct": "A shallow copy creates a new object with references to the original nested objects, while a deep copy creates a completely independent copy of nested objects.",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 9,
//                 "question": "How do you remove an element from a set in Python?",
//                 "variants": ["Using remove(element) method", "Using pop() method", "Using discard(element) method", "All of the above"],
//                 "correct": "All of the above",
//                 "selected": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": 10,
//                 "question": "What is the purpose of the __str__ method in Python classes?",
//                 "variants": ["To convert an object to a string representation", "To compare two objects for equality", "To check if an object exists", "To raise exceptions"],
//                 "correct": "To convert an object to a string representation",
//                 "selected": null,
//                 "isCorrect": false
//             }
//         ]'::jsonb
//     );
// `;

// ALISHER
//      (
//         'Java Scripts продвинутый уровень',
//         5,
//         'https://itproger.com/img/tests/node-js.svg',
//         $json$
//         [
//         {
//     "id": 1,
//     "question": "Что выведет этот код?humolet a = {};\nlet b = a;\na = null;\nconsole.log(b);\n",
//     "variants": ["{}", "null", "undefined", "Ошибка"],
//     "correct": "{}"
//   },
//   {
//     "id": 2,
//     "question": "Что делает замыкание (closure)?",
//     "variants": [
//       "Сохраняет доступ к переменным внешней функции",
//       "Удаляет переменные",
//       "Очищает память",
//       "Создает асинхронность"
//     ],
//     "correct": "Сохраняет доступ к переменным внешней функции"
//   },
//   {
//     "id": 3,
//     "question": "Что выведет следующий код?humoconsole.log(typeof NaN);",
//     "variants": ["\"number\"", "\"NaN\"", "\"undefined\"", "\"null\""],
//     "correct": "\"number\""
//   },
//   {
//     "id": 4,
//     "question": "Какой будет результат?humo(() => {\n  let x = 10;\n  return (() => x + 5)();\n})();",
//     "variants": ["15", "undefined", "10", "NaN"],
//     "correct": "15"
//   },
//   {
//     "id": 5,
//     "question": "Какое ключевое слово позволяет остановить выполнение цикла?",
//     "variants": ["skip", "end", "break", "stop"],
//     "correct": "break"
//   },
//   {
//     "id": 6,
//     "question": "Что произойдет при этом вызове?humo[...\"hello\"]",
//     "variants": [
//       "["h","e","l","l","o"]",
//       "Ошибка",
//       "\"hello\"",
//       "undefined"
//     ],
//     "correct": "["h","e","l","l","o"]"
//   },
//   {
//     "id": 7,
//     "question": "Что делает оператор Object.freeze(obj)?",
//     "variants": [
//       "Делает объект неизменяемым",
//       "Удаляет все свойства",
//       "Глубоко клонирует",
//       "Удаляет прототип"
//     ],
//     "correct": "Делает объект неизменяемым"
//   },
//   {
//     "id": 8,
//     "question": "Какой вывод даст?humofunction foo() {\n  return;\n  {\n    bar: \"value\"\n  }\n}\nconsole.log(foo());",
//     "variants": ["undefined", "{ bar: \"value\" }", "SyntaxError", "null"],
//     "correct": "undefined"
//   },
//   {
//     "id": 9,
//     "question": "Что вернёт Promise.resolve(5).then(console.log)?",
//     "variants": ["5", "Promise", "undefined", "Ошибка"],
//     "correct": "5"
//   },
//   {
//     "id": 10,
//     "question": "Какая структура данных лучше всего подходит для LRU-кэша?",
//     "variants": ["Массив", "Объект", "Map", "Set"],
//     "correct": "Map"
//   }

//         ]
//         $json$
//     ),
//      (
//         'HTML начальный уровень',
//         2.0,
//         'https://itproger.com/img/tests/html.svg',
//         $json$
//         [
//          {
//     "id": 1,
//     "question": "Какой тег используется для создания гиперссылки?",
//     "variants": ["<link>", "<href>", "<a>", "<url>"],
//     "correct": "<a>"
//   },
//   {
//     "id": 2,
//     "question": "Что выведет следующий HTML?humo<p>Hello <b>world</b>!</p>",
//     "variants": ["Hello **world**!", "Hello world!", "Hello world", "<p>Hello world!</p>"],
//     "correct": "Hello **world**!"
//   },
//   {
//     "id": 3,
//     "question": "Какой тег используется для вставки изображения?",
//     "variants": ['<img src=\"...\" />', "<image>", "<pic>", "<img>"],
//     "correct": "<img>"
//   },
//   {
//     "id": 4,
//     "question": "Где правильно подключить внешний CSS-файл?",
//     "variants": [
//       "Перед закрывающим тегом <body>",
//       "Внутри <head>",
//       "Внутри <footer>",
//       "В любом месте"
//     ],
//     "correct": "Внутри <head>"
//   },
//   {
//     "id": 5,
//     "question": "Что делает атрибут alt в теге <img>?",
//     "variants": [
//       "Описывает изображение для случая, если оно не загрузится",
//       "Добавляет альтернативное изображение",
//       "Изменяет размер",
//       "Применяет стили"
//     ],
//     "correct": "Описывает изображение для случая, если оно не загрузится"
//   },
//   {
//     "id": 6,
//     "question": "Что такое семантические теги?",
//     "variants": [
//       "Теги, описывающие смысл содержимого",
//       "Теги для стилизации",
//       "Теги с JavaScript",
//       "Устаревшие теги"
//     ],
//     "correct": "Теги, описывающие смысл содержимого"
//   },
//   {
//     "id": 7,
//     "question": "Какой тег используется для создания списка с маркерами?",
//     "variants": ["<ol>", "<ul>", "<li>", "<list>"],
//     "correct": "<ul>"
//   },
//   {
//     "id": 8,
//     "question": "Какой атрибут делает поле <input> обязательным?",
//     "variants": ["need", "required", "must", "validate"],
//     "correct": "required"
//   },
//   {
//     "id": 9,
//     "question": "Какой тег определяет заголовок 1 уровня?",
//     "variants": ["<title>", "<h1>", "<head>", "<header>"],
//     "correct": "<h1>"
//   },
//   {
//     "id": 10,
//     "question": "Что делает тег <br>?",
//     "variants": [
//       "Вставляет перенос строки",
//       "Делает текст жирным",
//       "Заканчивает абзац",
//       "Создает разрыв секции"
//     ],
//     "correct": "Вставляет перенос строки"
//   },
//         ]
//         $json$
//     ),
//      (
//         'HTML средний уровень',
//         3.5,
//         'https://itproger.com/img/tests/html.svg',
//         $json$
//         [
//         {
//     "id": 1,
//     "question": "Какой результат этого кода?humo<input type=\"checkbox\" checked>\",
//     "variants": [
//       "Чекбокс будет неактивен",
//       "Чекбокс будет изначально выбран",
//       "Ошибка",
//       "Ничего не произойдёт"
//     ],
//     "correct": "Чекбокс будет изначально выбран"
//   },
//   {
//     "id": 2,
//     "question": "Какой тег используется для создания выпадающего списка?",
//     "variants": ["<list>", "<menu>", "<select>", "<dropdown>"],
//     "correct": "<select>"
//   },
//   {
//     "id": 3,
//     "question": "Как вставить комментарий в HTML?",
//     "variants": ["// комментарий", "/* комментарий */", "<!-- комментарий -->", "# комментарий"],
//     "correct": "<!-- комментарий -->"
//   },
//   {
//     "id": 4,
//     "question": "Что делает атрибут action у формы?",
//     "variants": [
//       "Указывает URL для отправки данных",
//       "Запускает JavaScript",
//       "Сохраняет форму",
//       "Проверяет форму"
//     ],
//     "correct": "Указывает URL для отправки данных"
//   },
//   {
//     "id": 5,
//     "question": "Какой тег используется для встраивания другого HTML-документа?",
//     "variants": ["<div>", "<script>", "<iframe>", "<embed>"],
//     "correct": "<iframe>"
//   },
//   {
//     "id": 6,
//     "question": "Какое значение имеет атрибут target=\"_blank\" у ссылки?",
//     "variants": [
//       "Открывает ссылку в том же окне",
//       "Открывает в новой вкладке",
//       "Делает ссылку неактивной",
//       "Скрывает ссылку"
//     ],
//     "correct": "Открывает в новой вкладке"
//   },
//   {
//     "id": 7,
//     "question": "Какой атрибут задает текст, отображаемый при наведении?",
//     "variants": ["label", "alt", "title", "hover"],
//     "correct": "title"
//   },
//   {
//     "id": 8,
//     "question": "Что делает тег <label for=\"email\">?",
//     "variants": [
//       "Связывает текст с input-элементом с id=\"email\"",
//       "Добавляет стили",
//       "Создает поле",
//       "Валидирует email"
//     ],
//     "correct": "Связывает текст с input-элементом с id=\"email\""
//   },
//   {
//     "id": 9,
//     "question": "Какой тег HTML5 используется для навигации?",
//     "variants": ["<nav>", "<menu>", "<nav>", "<navigate>"],
//     "correct": "<nav>"
//   },
//   {
//     "id": 10,
//     "question": "Какой элемент HTML5 используется для группировки основного контента?",
//     "variants": ["<body>", "<div>", "<main>", "<section>"],
//     "correct": "<main>"
//   },
// ]
//         $json$
//     ),
//      (
//         'HTML продвинутый уровень',
//         2.0,
//         'https://itproger.com/img/tests/html.svg',
//         $json$
//         [
//          {
//     "id": 1,
//     "question": "Какой тег используется для создания встроенных SVG-графиков?",
//     "variants": ["<svg>", "<canvas>", "<img>", "<vector>"],
//     "correct": "<svg>"
//   },
//   {
//     "id": 2,
//     "question": "Что делает атрибут crossorigin у тега <script>?",
//     "variants": [
//       "Позволяет загрузить скрипт с другого домена с кросс-доменной политикой",
//       "Отключает выполнение скрипта",
//       "Включает отладку",
//       "Устанавливает порядок загрузки"
//     ],
//     "correct": "Позволяет загрузить скрипт с другого домена с кросс-доменной политикой"
//   },
//   {
//     "id": 3,
//     "question": "Что делает тег <template> в HTML5?",
//     "variants": [
//       "Содержит контент, который не отображается, но может быть клонирован и вставлен в DOM с помощью JS",
//       "Создаёт модальное окно",
//       "Определяет стили",
//       "Автоматически выполняет скрипт"
//     ],
//     "correct": "Содержит контент, который не отображается, но может быть клонирован и вставлен в DOM с помощью JS"
//   },
//   {
//     "id": 4,
//     "question": "Что делает атрибут defer у тега <script>?",
//     "variants": [
//       "Загружает скрипт асинхронно, но выполняет после парсинга HTML",
//       "Выполняет скрипт сразу",
//       "Блокирует загрузку страницы",
//       "Запускает скрипт только при событии"
//     ],
//     "correct": "Загружает скрипт асинхронно, но выполняет после парсинга HTML"
//   },
//   {
//     "id": 5,
//     "question": "Какой атрибут позволяет включить автоматическую проверку формы в браузере?",
//     "variants": ["validate", "check", "novalidate", "required"],
//     "correct": "required"
//   },
//   {
//     "id": 6,
//     "question": "Что такое ARIA-атрибуты?",
//     "variants": [
//       "Атрибуты для доступности веб-контента",
//       "Стили CSS",
//       "Типы скриптов",
//       "Устаревшие теги"
//     ],
//     "correct": "Атрибуты для доступности веб-контента"
//   },
//   {
//     "id": 7,
//     "question": "Что делает тег <picture>?",
//     "variants": [
//       "Позволяет использовать разные изображения для разных размеров экрана",
//       "Создаёт галерею",
//       "Добавляет фильтр к изображению",
//       "Вставляет видео"
//     ],
//     "correct": "Позволяет использовать разные изображения для разных размеров экрана"
//   },
//   {
//     "id": 8,
//     "question": "Какой тег используется для определения области виджета на странице?",
//     "variants": ["<section>", "<article>", "<aside>", "<widget>"],
//     "correct": "<section>"
//   },
//   {
//     "id": 9,
//     "question": "Что такое Shadow DOM?",
//     "variants": [
//       "Изолированное DOM-дерево внутри компонента",
//       "Основное дерево DOM",
//       "Атрибут для стилизации",
//       "API для работы с localStorage"
//     ],
//     "correct": "Изолированное DOM-дерево внутри компонента"
//   },
//   {
//     "id": 10,
//     "question": "Какой тег используется для определения цитаты?",
//     "variants": ["<quote>", "<q>", "<cite>", "<blockquote>"],
//     "correct": "<blockquote>"
//   }]
//       $json$
//     )

// const seedData = `
//  INSERT INTO books (name, author, image, pdf, rating, released, description)
// VALUES
// ('You don''t know JS', 'Kyle Simpson', 'uploads/you_dont_know_js.jpg', 'https://xiaoguo.net/~books/Program/You_Dont_Know_JS_Up_and_Going.pdf', 4.7, '2014-01-01', 'This best-selling series prepares you to deeply understand JavaScript fundamentals, with new editions covering JS for 2020 and beyond.'),
// ('The Pragmatic Programmer', 'Andrew Humd & David Thomas', 'uploads/progmatic_programmer.jpg', 'https://www.cin.ufpe.br/~cavmj/104The%20Pragmatic%20Programmer,%20From%20Journeyman%20To%20Master%20-%20Andrew%20Hunt,%20David%20Thomas%20-%20Addison%20Wesley%20-%201999.pdf', 4.8, '1999-10-01', 'A timeless guide with insights for all developers, helping them create better code and rediscover the joy of programming.'),
// ('Code', 'Charles Petzold', 'uploads/code.jpg', 'https://delong.typepad.com/files/code.pdf', 4.7, '1999-09-29', 'An illuminating story of the inner life of computers, teaching core computing concepts through analogies and storytelling.'),
// ('Code Complete', 'Steve McConnell', 'uploads/code_complete.jpg', 'https://people.engr.tamu.edu/slupoli/notes/ProgrammingStudio/supplements/Code%20Complete%202nd.pdf', 4.4, '2020-01-01', 'A hands-on guide to scalable, observable backend services with Node.js for modern enterprises.'),
// ('Essential TypeScript', 'Adam Freeman', 'uploads/essential_ts.jpg', 'https://people.engr.tamu.edu/slupoli/notes/ProgrammingStudio/supplements/Code%20Complete%202nd.pdf', 4.1, '2021-04-01', 'A comprehensive guide to using TypeScript 5 for more reliable, maintainable, and consistent JavaScript development.'),
// ('The Self-Taught Programmer', 'Cory Althoff', 'uploads/self_taught.jpg', 'https://books-library.net/files/books-library.net-11301817Az7X6.pdf', 4.5, '2017-01-01', 'Cory Althoff shares his path from self-study to software engineer, offering insights and lessons for beginners.'),
// ('Python Programming and SQL', 'Mark Reed', 'uploads/python_sql.jpg', 'https://xiaoguo.net/~books/Program/You_Dont_Know_JS_Up_and_Going.pdf', 4.5, '2020-01-01', 'Designed for beginners and experienced developers to learn Python and SQL efficiently and advance their careers.'),
// ('Learning GO', 'Jon Bodner', 'uploads/learning_go.webp', 'https://miek.nl/files/go/Learning-Go-latest.pdf', 4.5, '2021-01-01', 'A practical guide to learning idiomatic Go and understanding core patterns used by experienced Go developers.'),
// ('Python Crash Course', 'Eric Matthes', 'uploads/python_crush_course.webp', 'https://bedford-computing.co.uk/learning/wp-content/uploads/2015/10/No.Starch.Python.Oct_.2015.ISBN_.1593276036.pdf', 4.8, '2019-05-03', 'A fast-paced introduction to Python programming with hands-on projects and clear explanations of core concepts.'),
// ('A Byte of Python', 'Swaroop S.H.', 'uploads/byte_of_python.jpg', 'https://www.ibiblio.org/swaroopch/byteofpython/files/120/byteofpython_120.pdf', 4.2, '2005-01-01', 'A beginner-friendly guide to Python 3, ideal for readers new to programming with simple, clear examples.'),
// ('The Road to React', 'Robin Wieruch', 'uploads/react_road.webp', 'http://gsl-archive.mit.edu/media/programs/rwanda-summer-2018/materials/the-road-to-learn-react.pdf', 4.5, '2017-11-15', 'Step-by-step guide to building React apps with a strong focus on fundamentals and clean project setup.'),
// ('Learn React with TypeScript', 'Carl Rippon', 'uploads/react_with_ts.jpg', 'https://xiaoguo.net/~books/Program/You_Dont_Know_JS_Up_and_Going.pdf', 4.7, '2023-03-03', 'Covers React 18 and TypeScript 4 with modern design patterns and scalable component architecture.'),
// ('JavaScript and jQuery', 'Jon Ducket', 'uploads/js_and_query.webp', 'https://bedford-computing.co.uk/learning/wp-content/uploads/2015/10/JavaScript-and-JQuery-Interactive-Front-End-Web-Development-Introduction.pdf', 4.6, '2013-01-01', 'A fully illustrated, beginner-friendly guide to front-end interactivity using JavaScript and jQuery.'),
// ('Distribute System with Node.js', 'Hunter Thomas', 'uploads/node_js.webp', 'https://xiaoguo.net/~books/Program/You_Dont_Know_JS_Up_and_Going.pdf', 4.4, '2020-01-01', 'A hands-on guide to scalable, observable backend services with Node.js for modern enterprises.'),
// ('Clean Code', 'Robert C. Martin', 'uploads/clean_code.jpg', 'https://ptgmedia.pearsoncmg.com/images/9780132350884/samplepages/9780132350884.pdf', 4.7, '2008-08-01', 'Teaches the principles and values of writing clean, maintainable, and readable code with agile practices.'),
// ('HTML and CSS QuickStart Guide', 'David DuRocher', 'uploads/html_css.webp', 'https://ptgmedia.pearsoncmg.com/images/9780321928832/samplepages/0321928830.pdf', 4.5, '2021-01-01', 'Breaks down HTML5 and CSS3 fundamentals into practical, beginner-friendly lessons for first-time developers.'),
// ('Go Programming Cookbook', 'Ian Taylor', 'uploads/go_programming_cooclbook.webp', 'https://edu.anarcho-copy.org/Programming%20Languages/Go/go-programming-cookbook-readable-applications-2nd.pdf', 4.5, '2014-01-01', 'A recipe-based guide to Go programming that emphasizes practical, readable applications.'),
// ('Head First HTML and CSS', 'Elisabeth Robson', 'uploads/head_html_css.webp', 'http://artsites.ucsc.edu/sdaniel/170a_2014/Head_First_HTML_CSS_XHTML.pdf', 4.5, '2014-01-01', 'An illustrated, brain-friendly guide to HTML and CSS for beginners who want to build better websites.'),
// ('Web Development with Node and Express', 'Ethan Brown', 'uploads/node_express.webp', 'https://www.vanmeegern.de/fileadmin/user_upload/PDF/Web_Development_with_Node_Express.pdf', 4.5, '2014-01-01', 'A practical introduction to building backend web applications with Node.js and Express framework.'),
// ('MongoDB Data Modeling and Schema Design', 'Daniel Coupal, Pascal Desmarets', 'uploads/mongo_db.webp', 'https://www.percona.com/sites/default/files/presentations/Percona-Webinar_MongoDB-Schema-Design.pdf', 4.5, '2014-01-01', 'Covers data modeling best practices for MongoDB, focusing on schema design for performance and scalability.'),
// ('C++ Programming Language', 'Bjarne Stroustrup', 'uploads/c++.webp', 'https://chenweixiang.github.io/docs/The_C++_Programming_Language_4th_Edition_Bjarne_Stroustrup.pdf', 4.5, '2014-01-01', 'Written by the creator of C++, this definitive guide explains C++ features and programming techniques.'),
// ('The C# Player''s Guide', 'R.B. Whitaker', 'uploads/c_sharp.webp', 'https://csharpplayersguide.com/TheCSharpPlayersGuide-5thEdition-Sample.pdf', 4.5, '2014-01-01', 'An approachable and thorough introduction to C# programming and .NET fundamentals.'),
// ('Head First Java: A Brain-Friendly Guide', 'Kathy Sierra, Bert Bates', 'uploads/java.webp', 'https://www.rcsdk12.org/cms/lib/NY01001156/Centricity/Domain/4951/Head_First_Java_Second_Edition.pdf', 4.5, '2014-01-01', 'A visual and interactive guide for learning Java programming using the Head First approach.'),
// ('Social Engineering: The Science of Human Hacking', 'Christopher Hadnagy', 'uploads/human_hacking.jpg', 'https://theswissbay.ch/pdf/Books/Computer%20science/socialengineering_thescienceofhumanhacking_2ndedition.pdf', 4.5, '2014-01-01', 'Explores the psychological tactics behind social engineering and how attackers manipulate human behavior.'),
// ('Practical SQL', 'Anthony DeBarros', 'uploads/practical_sql.webp', 'https://someplace-else.neocities.org/books/Practical%20SQL.pdf', 4.5, '2014-01-01', 'A hands-on introduction to SQL for data analysis, reporting, and data wrangling with real-world examples.'),
// ('JavaScript: The Definitive Guide', 'David Flanagan', 'uploads/js.webp', 'https://pepa.holla.cz/wp-content/uploads/2016/08/JavaScript-The-Definitive-Guide-6th-Edition.pdf', 4.5, '2014-01-01', 'A comprehensive reference and tutorial for the JavaScript language, ideal for both beginners and professionals.'),
// ('A Smarter Way to Learn JavaScript', 'Mark Myers', 'uploads/smart_way_to_learn_js.webp', 'https://wccftech.com/wp-content/uploads/2014/10/JavaScript.pdf', 4.5, '2014-01-01', 'Uses interactive exercises and concise lessons to make JavaScript easy and approachable for beginners.'),
// ('Hacking APIs', 'Corey J. Ball', 'uploads/hacking_apis.webp', 'https://xiaoguo.net/~books/Program/You_Dont_Know_JS_Up_and_Going.pdf', 4.5, '2014-01-01', 'A hands-on guide to testing and exploiting vulnerabilities in APIs using modern hacking techniques.'),
// ('Learning Redux', 'Daniel Bugl', 'uploads\learning_redux.webp', 'https://www.dsspp.sk/assets/redux-book.pdf', 4.5, '2014-01-01', 'Covers core concepts and advanced usage of Redux for managing application state in JavaScript projects.'),
// ('Algorithms (4th Edition)', 'Robert Sedgewick and Kevin Wayne', 'uploads/algorithms.webp', 'https://dsp-book.narod.ru/Algorithms.pdf', 4.5, '2014-01-01', 'A classic and widely-used textbook on algorithms and data structures in Java, with a focus on clarity and performance.'),
// ('Mastering Node.js', 'Sandro Pasquali', 'uploads/mastering_node_js.jpg', 'https://dl.ebooksworld.ir/sooth3r/javascript/PP.Mastering.Node.js.Nov.2013.www.EBooksWorld.ir.pdf', 4.0, '2005-01-01', 'A complete guide to building robust Node.js applications using event-driven architecture and real-world patterns.');
// `;

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
