# stator-servis

Современная верстка сайта с Gulp, Nunjucks и SCSS. Компонентная архитектура для создания адаптивных веб-макетов с автоматической перезагрузкой и оптимизированной продакшн-сборкой.

## Возможности

- 🎨 **Компонентная архитектура** - Модульные блоки и компоненты для повторного использования UI элементов
- 🔄 **Автоматическая перезагрузка** - BrowserSync с автоматическим обновлением браузера при изменении файлов
- ⚡ **Быстрая сборка** - esbuild для молниеносной сборки JavaScript
- 🎯 **Шаблонизатор** - Nunjucks для мощного HTML темплейтинга
- 🌈 **Современный CSS** - SCSS с autoprefixer и модульным импортом
- 📦 **Готово к продакшну** - Минифицированные и оптимизированные ресурсы для деплоя

## Установка

### Требования

- [Node.js](https://nodejs.org/) (v16 или выше)
- [NPM](https://www.npmjs.com/) или другой пакетный менеджер

### Настройка

Установите зависимости:

```sh
npm install
```

## Разработка

### Запуск сервера разработки

```sh
npm start
# или
gulp
```

Это выполнит:

- Компиляцию всех ресурсов в папку `temp/`
- Запуск сервера BrowserSync на `http://localhost:3000`
- Отслеживание изменений файлов и автоматическую перезагрузку браузера
- Генерацию sourcemaps для отладки

### Сборка для продакшна

```sh
npm run build
# или
gulp build
```

Это выполнит:

- Компиляцию и минификацию CSS/JavaScript
- Оптимизацию изображений (сжатие JPEG/PNG)
- Вывод готовых к продакшну файлов в папку `build/`
- Удаление sourcemaps и комментариев

### Контроль качества кода

**Комплексные команды:**

```sh
npm run check            # Запустить все проверки (lint + format)
npm run fix              # Автоматически исправить все (lint + format)
```

**Линтинг:**

```sh
npm run lint             # Проверить JavaScript и SCSS
npm run lint:js          # Проверить JavaScript с помощью ESLint
npm run lint:js:fix      # Автоматически исправить проблемы в JavaScript

npm run lint:scss        # Проверить SCSS с помощью Stylelint
npm run lint:scss:fix    # Автоматически исправить проблемы в SCSS
```

**Форматирование:**

```sh
npm run format           # Проверить форматирование кода (HTML, SCSS, JS, JSON)
npm run format:fix       # Автоматически исправить проблемы форматирования
```

Prettier полностью интегрирован с ESLint и Stylelint - никаких конфликтов!

### Анализ бандла

```sh
npm run analyze          # Анализ размера JavaScript бандла
```

Показывает размер минифицированного бандла в KB для мониторинга оптимизации.

### Дополнительные команды

**Валидация HTML:**

```sh
npm run validate         # Валидация HTML файлов с помощью W3C валидатора
```

Валидирует все HTML файлы в директории `build/`. Сначала запустите `npm run build`.

**Сжатие изображений:**

```sh
npm run compress         # Сжать исходные изображения (заменяет оригиналы!)
```

Сжимает изображения в `src/assets/images/` с более высокими настройками качества, чем продакшн-сборка.

**Очистка директорий сборки:**

```sh
gulp clean               # Удалить папки temp/ и build/
```

## Структура проекта

```
stator-servis/
├── src/                          # Исходные файлы
│   ├── assets/                   # Статические ресурсы
│   │   ├── favicons/
│   │   ├── fonts/
│   │   └── images/
│   ├── blocks/                   # Крупные структурные секции
│   │   ├── common/               # Специфичные для страниц блоки
│   │   └── general/              # Общие блоки (header, footer и т.д.)
│   ├── components/               # Небольшие переиспользуемые UI элементы
│   │   ├── common/               # Специфичные для проекта компоненты (logo, copyright)
│   │   └── general/              # Общие компоненты (button, menu)
│   ├── layouts/                  # Шаблоны макетов
│   │   ├── default.njk           # Основной макет
│   │   └── grid.njk              # Вариант макета с сеткой
│   ├── pages/                    # Шаблоны страниц (каждый становится .html)
│   │   ├── index.njk             # Главная (/)
│   │   ├── pages.njk             # Список страниц для вёрстки (/pages.html)
│   │   ├── 404.njk               # 404
│   │   ├── uslugi/               # Услуги (/uslugi/)
│   │   ├── o-nas/                # О компании (/o-nas/)
│   │   ├── nashi-raboty/         # Наши работы (/nashi-raboty/)
│   │   ├── блог-и-новости/       # Блог (/блог-и-новости/)
│   │   ├── cena/                 # Цены (/cena/)
│   │   ├── faq/                  # Вопрос-ответ (/faq/)
│   │   ├── contact/              # Контакты (/contact/)
│   │   └── persdan/              # Политика (/persdan/)
│   ├── scss/                     # Стили
│   │   ├── core/                 # Переменные, миксины, глобальные стили
│   │   └── index.scss            # Главная точка входа SCSS
│   └── js/                       # JavaScript
│       ├── utils/                # Утилитарные функции
│       └── index.js              # Главная точка входа JS
├── temp/                         # Вывод сборки для разработки (генерируется автоматически)
├── build/                        # Вывод продакшн-сборки (генерируется автоматически)
├── gulpfile.js                   # Конфигурация сборки
├── package.json
├── AGENTS.md                     # Руководство для AI ассистента
└── README.md
```

### Структура компонента

Каждый компонент/блок следует этому паттерну:

```
component-name/
├── component-name.njk            # Шаблон
├── component-name.scss           # Стили
└── component-name.js             # Логика (опционально)
```

## Технологический стек

### Основные технологии

- **[Nunjucks](https://mozilla.github.io/nunjucks/)** - Мощный шаблонизатор с наследованием и макросами
- **[SCSS](https://sass-lang.com/)** - CSS препроцессор с переменными, миксинами и вложенностью
- **[esbuild](https://esbuild.github.io/)** - Ультрабыстрый сборщик JavaScript
- **[Gulp](https://gulpjs.com/)** - Таск-раннер и система сборки
- **[BrowserSync](https://browsersync.io/)** - Живая перезагрузка и синхронизированное тестирование

### Инструменты контроля качества

- **[ESLint](https://eslint.org/)** - JavaScript линтер (ESLint 9+ flat config)
- **[Stylelint](https://stylelint.io/)** - SCSS/CSS линтер с автоматической сортировкой свойств
- **[Prettier](https://prettier.io/)** - Опциональный форматировщик кода для HTML, SCSS, JS, JSON
- **eslint-config-prettier** - Отключает конфликтующие правила ESLint
- **stylelint-config-prettier-scss** - Отключает конфликтующие правила Stylelint

### Подключенные библиотеки

- **[Lozad.js](https://apoorv.pro/lozad.js/)** - Ленивая загрузка изображений (используйте класс `.lazy`)
- **[Swiper](https://swiperjs.com/)** - Современный мобильный слайдер
- **[Fancyapps UI](https://fancyapps.com/)** - Компонент лайтбокса и галереи
- **[imask](https://imask.js.org/)** - Маски для полей ввода

## Рабочий процесс разработки

### Создание нового компонента

1. Создайте папку компонента в `src/components/general/` или `src/blocks/general/`

2. Создайте файл `.njk` как **макрос** (без комментариев документации внутри):

    ```nunjucks
    {% macro render(text="", variant="primary", size="md") %}
        <div class="your-component {{ variant }} {{ size }}">
            {{ text }}
        </div>
    {% endmacro %}
    ```

3. Импортируйте стили в `src/scss/index.scss`:

    ```scss
    @use "../components/general/your-component/your-component";
    ```

4. Если компоненту нужна инициализация, экспортируйте функцию и добавьте в массив компонентов в `src/js/index.js`:

    ```javascript
    // Экспорт в файле компонента:
    export function yourComponent(context = document) {
        const root = context.querySelector('.component');
        if (!root || root.dataset.init === "true") return;
        root.dataset.init = "true";
        // Логика компонента...
    }

    // В index.js:
    import { yourComponent } from "../components/general/your-component/your-component.js";

    const components = [menu, searchForm, yourComponent]; // Добавить в массив
    ```

5. Используйте макрос в шаблонах (импорт в **начале** файла):

    ```nunjucks
    {% from "components/general/your-component/your-component.njk" import render as yourComponent %}

    {{ yourComponent(text="Привет", variant="primary") }}
    ```

### Создание новой страницы

1. Создайте файл `.njk` в `src/pages/`
2. Расширьте макет:

    ```nunjucks
    {% extends "layouts/default.njk" %}

    {% block content %}
        <!-- Ваш контент страницы -->
    {% endblock %}
    ```

3. Страница будет скомпилирована в HTML в выходной папке

## Рекомендуемые инструменты

- **[Nunjucks VS Code Extension](https://marketplace.visualstudio.com/items?itemName=douglaszaltron.nunjucks-vscode-extensionpack)** - Подсветка синтаксиса, форматирование и сниппеты

## Поддержка браузеров

Настроено через `browserslist` в `package.json`:

- > 1% доли рынка
- Последние 10 версий основных браузеров
- Исключает мертвые браузеры

## Методы

### Toast-уведомления

```js
// Успех (зелёный)
window.showToast("Товар успешно добавлен в заказ", { type: "success" });

// Ошибка (красный)
window.showToast("Не удалось отправить форму", { type: "error" });

// По умолчанию (тёмный), показ 5 секунд
window.showToast("Сохранено", { duration: 5000 });
```

**Параметры:** `showToast(message, { type, duration })`
- `type`: `"default"` | `"success"` | `"error"`
- `duration`: время показа в мс (по умолчанию 3000)

### Popup-окна

```js
// Показать popup по id элемента
window.showPopup("popup-feedback-success");
```

**Доступные popup-id:**
- `"popup-callback"` — обратный звонок
- `"popup-feedback-success"` — успешная отправка формы

