# AGENTS.md

Этот файл содержит руководство для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Обзор проекта

Это генератор статических сайтов на основе Gulp, использующий шаблоны Nunjucks, SCSS и JavaScript, собранный с помощью esbuild. Проект использует компонентную архитектуру, где UI элементы организованы в переиспользуемые блоки и компоненты.

## Команды разработки

### Запуск сервера разработки
```sh
npm start
# или
gulp
```
Запускает сервер BrowserSync на http://localhost:3000 с живой перезагрузкой. Скомпилированные файлы попадают в папку `temp/`.

### Сборка для продакшна
```sh
npm run build
# или
gulp build
```
Компилирует оптимизированные ресурсы в папку `build/` с минифицированными CSS/JS и оптимизированными изображениями.

### Очистка директорий сборки
```sh
gulp clean
```
Удаляет папки `temp/` и `build/`.

### Линтинг кода
```sh
npm run lint
```
Запускает проверки ESLint (JavaScript) и Stylelint (SCSS).

```sh
npm run lint:js
```
Проверяет JavaScript файлы с помощью ESLint.

```sh
npm run lint:js:fix
```
Автоматически исправляет проблемы линтинга JavaScript.

```sh
npm run lint:scss
```
Проверяет SCSS файлы с помощью Stylelint.

```sh
npm run lint:scss:fix
```
Автоматически исправляет проблемы линтинга SCSS.

### Форматирование кода
```sh
npm run format
```
Проверяет форматирование кода для HTML, SCSS, JS и JSON файлов с помощью Prettier.

```sh
npm run format:fix
```
Автоматически исправляет проблемы форматирования.

### Комплексные команды
```sh
npm run check
```
Запускает все проверки (lint + format) одной командой.

```sh
npm run fix
```
Автоматически исправляет все проблемы (lint:fix + format:fix) одной командой.

### Анализ бандла
```sh
npm run analyze
```
Показывает размер минифицированного JavaScript бандла в KB.

### Дополнительные команды
```sh
npm run validate
```
Валидирует HTML файлы в директории `build/` с помощью W3C валидатора. Сначала запустите `npm run build`.

```sh
npm run compress
```
Сжимает исходные изображения в `src/assets/images/` (заменяет оригиналы с более высоким качеством, чем продакшн-сборка).

## Архитектура

### Система сборки (gulpfile.js)

Конвейер Gulp имеет отдельные задачи для разработки и продакшна:

**Задачи разработки** (вывод в `temp/`):
- `html` - Компиляция шаблонов Nunjucks без минификации
- `styles` - Компиляция SCSS с sourcemaps, вывод как `bundle.css`
- `scripts` - Сборка JS с esbuild и sourcemaps, вывод как `bundle.js`
- `assets` - Копирование ресурсов без оптимизации
- `serve` - Запуск сервера BrowserSync с отслеживанием файлов

**Задачи продакшна** (вывод в `build/`):
- `htmlProd` - Компиляция шаблонов и замена ссылок на бандлы версиями с `.min`
- `stylesProd` - Компиляция SCSS с autoprefixer и cssnano, вывод как `bundle.min.css`
- `scriptsProd` - Сборка и минификация JS, вывод как `bundle.min.js`
- `assetsProd` - Копирование и оптимизация изображений с помощью mozjpeg и pngquant

### Компонентная архитектура

**Блоки** (`src/blocks/`) - Крупные структурные секции страницы:
- `general/` - Переиспользуемые блоки, такие как header, footer, sidebar, section
- `common/` - Специфичные для страниц блоки, такие как hero

**Компоненты** (`src/components/`) - Небольшие переиспользуемые UI элементы:
- `general/` - Переиспользуемые компоненты, такие как button, title, menu, breadcrumbs
- `common/` - Уникальные компоненты, такие как logo, copyright

Каждый блок/компонент следует этой структуре:
```
component-name/
├── component-name.njk   # Шаблон Nunjucks
├── component-name.scss  # Стили
└── component-name.js    # JavaScript (при необходимости)
```

### Система шаблонов (Nunjucks)

**Макеты** (`src/layouts/`):
- `default.njk` - Основной макет с header, footer и блоком контента
- `grid.njk` - Вариант макета (при необходимости)

**Страницы** (`src/pages/`):
- Каждый файл `.njk` становится HTML страницей; вложенные папки сохраняют URL (`uslugi/index.njk` → `/uslugi/`)
- Страницы расширяют макеты и включают блоки/компоненты
- Используйте `{% extends "layouts/default.njk" %}` и `{% block content %}`
- Список шаблонов для вёрстки: `/pages.html`

**Подключение шаблонов**:
- Блоки/компоненты: `{% include "blocks/general/header/header.njk" %}`
- Метаданные в макетах: `{% include "blocks/general/meta/meta.njk" %}`

### Система стилей

**Точка входа**: `src/scss/index.scss`

SCSS организован в:
- `core/` - Переменные, миксины, шрифты, анимации, глобальные стили, точки останова
- Стили компонентов импортируются из `src/blocks/` и `src/components/`
- Стили сторонних библиотек из `node_modules/`

Компилятор Sass использует `includePaths` для разрешения импортов из:
- `src/blocks`
- `src/components`
- `src/scss/core`

### Система JavaScript

**Точка входа**: `src/js/index.js`

#### Архитектура инициализации

Проект использует централизованный паттерн инициализации компонентов:

```js
import lozad from "lozad";
import { menu } from "../components/general/menu/menu.js";
import { searchForm } from "../components/general/search-form/search-form.js";

const components = [menu, searchForm, /* другие компоненты */];

function init(context = document) {
    components.forEach((fn) => fn(context));
}

document.addEventListener("DOMContentLoaded", () => {
    lozad(".lazy", { rootMargin: "200px 200px", threshold: 0.1, enableAutoReload: true }).observe();
    init();
});

window.reinit = init; // Для переинициализации после AJAX
```

**Ключевые особенности:**
- Массив `components` содержит все функции инициализации компонентов
- Функция `init(context)` позволяет переинициализировать компоненты в определённом контексте
- `window.reinit` доступен глобально для переинициализации после динамических изменений DOM

#### Паттерн компонента JavaScript

Каждый компонент экспортирует функцию с параметром `context`:

```js
export function componentName(context = document) {
    const root = context.querySelector('[data-dropdown="component"]');
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const controller = new AbortController();
    const { signal } = controller;

    // Логика компонента...

    // Очистка при удалении элемента
    root.addEventListener("destroy", () => controller.abort(), { once: true });
}
```

**Обязательные элементы:**
- Проверка `root.dataset.init === "true"` предотвращает двойную инициализацию
- `AbortController` для управления слушателями событий
- Событие `destroy` для очистки при удалении элемента из DOM

**Утилитарные функции**: `src/js/utils/`
- Директория для общих утилитарных функций (помощники DOM, делегирование событий, debounce/throttle и т.д.)

esbuild собирает все в один IIFE бандл для браузера.

### Контроль качества кода

Проект использует три комплементарных инструмента для контроля качества кода:

#### ESLint (JavaScript)

**Конфигурация**: `eslint.config.js` (формат ESLint 9+ flat config)

ESLint настроен с:
- Поддержкой ES модулей (`sourceType: "module"`)
- Глобальными переменными браузера и Node.js
- Рекомендуемыми правилами JavaScript
- Интеграцией **eslint-config-prettier** (отключает конфликтующие правила стиля)
- Авто-игнорированием паттернов для `node_modules/`, `temp/`, `build/` и `*.min.js`

Основные применяемые правила (только логика, без правил стиля):
- `no-var` - Необходимо использовать `let`/`const` вместо `var`
- `prefer-const` - Использовать `const` для переменных, которые не переназначаются
- `prefer-arrow-callback` - Предпочитать стрелочные функции для коллбэков
- `prefer-template` - Предпочитать шаблонные литералы вместо конкатенации строк

**Примечание:** Все стилистические правила (отступы, кавычки, точки с запятой, пробелы) обрабатываются Prettier.

#### Stylelint (SCSS/CSS)

**Конфигурация**: `.stylelintrc.json`

Stylelint настроен с:
- `stylelint-config-standard-scss` - Стандартные правила SCSS
- `stylelint-config-recess-order` - Автоматическая сортировка CSS свойств (аналогично стилю Bootstrap)
- Интеграцией **stylelint-config-prettier-scss** (отключает конфликтующие правила стиля)
- Авто-игнорированием паттернов для `node_modules/`, `temp/`, `build/` и `*.min.css`

Возможности:
- Валидация синтаксиса SCSS
- Автоматическая сортировка свойств (position → display → box-model → typography → visual → и т.д.)
- Обнаружение дублирующихся селекторов и недопустимых правил
- Валидация цветов, единиц измерения и значений
- Поддержка автоисправления для большинства проблем

Основные отключенные правила для гибкости:
- `selector-class-pattern` - Без принудительного использования BEM
- `scss/dollar-variable-pattern` - Без ограничений на именование переменных
- `no-descending-specificity` - Позволяет гибкую специфичность

#### Prettier (Форматировщик кода)

**Конфигурация**: `.prettierrc.json` | **Игнорирование**: `.prettierignore`

Prettier настроен с:
- Отступами в 4 пробела (соответствует настройкам ESLint)
- Двойными кавычками
- Точками с запятой всегда
- Шириной строки: 120 символов
- Окончаниями строк LF
- **Форматирует**: HTML, SCSS, JS, JSON
- **Исключает**: файлы `.njk` (шаблоны Nunjucks не форматируются)

Интеграция:
- `eslint-config-prettier` отключает все правила стиля ESLint
- `stylelint-config-prettier-scss` отключает все правила стиля Stylelint
- **Нет конфликтов** между инструментами - Prettier обрабатывает все форматирование, линтеры - качество кода

**Важно:** Всегда запускайте `npm run format:fix` перед коммитом для обеспечения единообразного стиля кода.

## Общие библиотеки

**Активные:**
- **Lozad.js** - Ленивая загрузка для изображений с классом `.lazy` (инициализируется в `index.js`)
- **Swiper** - Карусели/слайдеры (используется в `service-detail` и `projects-detail`)
- **@fancyapps/ui** - Галерея лайтбокс (используется в `service-detail` и `projects-detail`)

**Установленные, но не реализованные:**
- **nice-select2** - Кастомная стилизация select (CSS импортирован, компонент select не существует)
- **imask** - Маскирование ввода (установлен, не используется)

**Примечание:** Неиспользуемые библиотеки должны быть либо реализованы с примерами компонентов, либо удалены для уменьшения размера бандла.

## Известные проблемы и несоответствия

### Критические
- **Отсутствующая анимация:** keyframe `rotation`, используемый в `globals.scss:168`, не определен в `animations.scss`
- Исправление: Добавить `@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`

### Компонентная архитектура
- **Несогласованные паттерны:** Только button, textarea и breadcrumbs используют паттерн макросов
- Другие компоненты (title, heading, text, navigation) все еще используют паттерн include
- **Рекомендация:** Стандартизировать все компоненты для использования макросов для согласованности

### Отсутствующие компоненты
- Нет компонентов ввода форм (текстовый ввод, select, checkbox, radio)
- Нет общих UI компонентов (modal, alert, tabs, accordion, tooltip)
- Нет страниц документации для: компонентов title, heading, text, navigation

### Доступность
- Только button и breadcrumbs имеют правильную поддержку ARIA атрибутов
- Другие компоненты нуждаются в улучшении доступности

## Добавление новых компонентов

1. Создайте директорию компонента в `src/components/general/` или `src/blocks/general/`
2. Создайте файлы `.njk`, `.scss` и `.js` (при необходимости)
3. Импортируйте SCSS в `src/scss/index.scss`
4. Если компонент нуждается в JS логике:
   - Экспортируйте функцию `componentName(context = document)` из `.js`
   - Импортируйте и добавьте в массив `components` в `src/js/index.js`
5. Подключите компонент на страницах/в макетах, используя `{% from %}` и вызов макроса

## Отслеживание файлов

Gulp отслеживает эти паттерны в режиме разработки:
- `src/**/*.njk` - Запускает задачу `html`
- `src/**/*.scss` - Запускает задачу `styles`
- `src/**/*.js` - Запускает задачу `scripts`
- `src/assets/**/*.*` - Запускает задачу `assets`

## Руководство по разработке компонентов

Этот раздел описывает стандартные паттерны и стиль кода для создания новых компонентов на основе существующих компонентов, таких как `button` и `textarea`.

### Структура файлов

Каждый компонент должен иметь:
```
component-name/
├── component-name.njk   # Шаблон Nunjucks (обязательно)
├── component-name.scss  # Стили (обязательно)
└── component-name.js    # JavaScript (опционально, только при необходимости)
```

### Структура шаблона Nunjucks (.njk)

**Важно:** Все компоненты должны использовать **макросы Nunjucks** для лучшей переиспользуемости и чистой области видимости. НЕ добавляйте комментарии документации внутри файлов компонентов.

#### 1. Определение макроса

Определите компонент как макрос с параметрами:

```njk
{% macro render(
    text="",
    variant="primary",
    size="md",
    disabled=false,
    class="",
    data={},
    aria={}
) %}
```

#### 2. Значения по умолчанию

Значения по умолчанию определены в параметрах макроса. Дополнительные значения по умолчанию внутри макроса:

```njk
{% set componentClasses = "component-name " + variant + " " + size %}
{% if class %}{% set componentClasses = componentClasses + " " + class %}{% endif %}
```

#### 3. Построение имен классов

Создавайте CSS классы условно:

```njk
{% set componentClasses = "component-name " + variant %}
{% if component.modifier %}{% set componentClasses = componentClasses + " " + modifier %}{% endif %}
{% if component.class %}{% set componentClasses = componentClasses + " " + component.class %}{% endif %}
```

**Паттерн:** Базовый класс + вариант/размер + модификаторы + пользовательские классы

#### 4. HTML элемент

Отрендерьте элемент с условными атрибутами:

```njk
<element
    class="{{ componentClasses }}"
    {% if component.id %}id="{{ component.id }}"{% endif %}
    {% if component.name %}name="{{ component.name }}"{% endif %}
    {% if component.disabled %}disabled{% endif %}
    {% if component.data %}
        {% for key, val in component.data %}
            data-{{ key | replace("_", "-") }}="{{ val }}"
        {% endfor %}
    {% endif %}
    {% if component.aria %}
        {% for key, val in component.aria %}
            aria-{{ key | replace("_", "-") }}="{{ val }}"
        {% endfor %}
    {% endif %}
>
    {% if component.content %}{{ component.content }}{% endif %}
</element>
```

**Ключевые паттерны:**
- Используйте `{% if %}` для опциональных атрибутов
- Всегда поддерживайте атрибуты `data` и `aria` через циклы
- Конвертируйте подчеркивания в дефисы в ключах data/aria: `replace("_", "-")`
- Сохраняйте чистое форматирование с правильными отступами

#### 5. Условная логика

Исключайте определенные модификаторы из конкретных вариантов:

```njk
{% set buttonClasses = "button " + variant %}
{% if variant != "link" %}
    {% set buttonClasses = buttonClasses + " " + size + " " + shape %}
{% endif %}
{% endmacro %}
```

**Использование на страницах:**
```njk
{% from "components/general/button/button.njk" import render as button %}

{{ button(text="Нажми меня", variant="primary", size="lg") }}
{{ button(text="Вторичная", variant="secondary") }}
```

**Размещение импорта:** Всегда размещайте импорты макросов в **верхней части файла**, перед любым другим кодом (аналогично импортам JavaScript/CSS).

### Структура SCSS

#### 1. Заголовок файла

```scss
@use "core/breakpoints" as bp;
@use "core/mixins" as mix;
```

#### 2. CSS кастомные свойства

Определите специфичные для компонента переменные, используя CSS кастомные свойства:

```scss
.component-name {
    // Переменные компонента
    --component-border-radius: 6px;
    --component-font-size-sm: 0.75rem;
    --component-font-size-md: 0.875rem;
    --component-font-size-lg: 0.875rem;
    --component-padding-sm: 0.625rem;
    --component-padding-md: 0.75rem;
    --component-padding-lg: 1rem;

    // Базовые стили
    display: block;
    // ... другие базовые стили
}
```

**Преимущества:**
- Легко переопределить
- Читаемые имена переменных
- Область видимости компонента

#### 3. Базовые стили

Сначала определите базовые стили:

```scss
.component-name {
    // Сначала переменные

    // Базовые стили
    position: relative;
    display: block;
    font-family: var(--font-family-primary);
    font-size: var(--component-font-size-md);
    // ... другие стили
    transition: all 0.2s ease-in-out;
```

#### 4. Состояния

Группируйте интерактивные состояния вместе:

```scss
    // Состояние фокуса
    &:focus,
    &:focus-visible {
        outline: 2px solid var(--color-primary);
    }

    // Состояние наведения
    &:hover:not(:disabled) {
        border-color: var(--color-black);
    }

    // Отключенное состояние
    &:disabled,
    &.disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    // Активное состояние
    &:active:not(:disabled) {
        transform: translateY(1px);
    }
```

**Важно:** Всегда используйте `:not(:disabled)` для состояний hover/active

#### 5. Секция вариантов

Группируйте варианты с заголовком комментария:

```scss
    // --------------------------------------
    // Варианты
    // --------------------------------------

    &.primary {
        color: var(--color-white);
        background-color: var(--color-primary);

        &:hover:not(:disabled) {
            background-color: var(--color-primary-dark);
        }
    }

    &.secondary {
        // ...
    }
```

#### 6. Секция размеров

Группируйте размеры с заголовком комментария:

```scss
    // --------------------------------------
    // Размеры
    // --------------------------------------

    &.sm {
        padding: var(--component-padding-sm);
        font-size: var(--component-font-size-sm);
    }

    &.md {
        padding: var(--component-padding-md);
        font-size: var(--component-font-size-md);
    }

    &.lg {
        padding: var(--component-padding-lg);
        font-size: var(--component-font-size-lg);
    }
```

#### 7. Модификаторы

Дополнительные модификаторы идут после основных вариантов:

```scss
    &.error {
        border-color: var(--color-red);

        &:focus {
            border-color: var(--color-red);
        }

        &:hover {
            border-color: var(--color-red) !important;
        }
    }
```

### Правила стиля кода

#### Nunjucks

- **Без BEM нотации** - Используйте простые имена классов с модификаторами
- **Встроенные условия** - Держите простые условия на одной строке:
  ```njk
  {% if component.id %}id="{{ component.id }}"{% endif %}
  ```
- **Многострочные циклы for** - Форматируйте циклы с правильными отступами
- **Комментарии** - Используйте `{# #}` для блоков документации

#### SCSS

- **БЕЗ BEM нотации** - Избегайте синтаксиса `__element` и `--modifier`
- **Используйте вложенность** - Вкладывайте связанные селекторы вместо BEM:
  ```scss
  .component {
      .header {
          .title { }
      }
  }
  ```
- **Разделители секций** - Используйте разделители комментариев:
  ```scss
  // --------------------------------------
  // Название секции
  // --------------------------------------
  ```
- **Цепочки состояний** - Объединяйте состояния для специфичности:
  ```scss
  &:hover:not(:disabled):not(.disabled) { }
  ```
- **CSS переменные** - Используйте CSS кастомные свойства с префиксом имени компонента:
  ```scss
  --button-padding-md: 0.75rem;
  ```

### Соглашения об именовании параметров

**Общие параметры, которые должны поддерживать все компоненты:**
- `id` - Атрибут ID элемента
- `class` - Дополнительные CSS классы
- `name` - Имя элемента формы
- `disabled` - Отключенное состояние (булево)
- `data` - Объект data атрибутов
- `aria` - Объект aria атрибутов

**Именование размеров/вариантов:**
- `size: "sm|md|lg"` - Маленький, средний, большой
- `variant` - Варианты компонента (например, "primary", "secondary")

**Булевые флаги:**
- Используйте простые булевые имена: `disabled`, `readonly`, `required`, `error`
- НЕ: `isDisabled`, `hasError`


### Чеклист интеграции

При добавлении нового компонента:

1. ✅ Создать директорию компонента: `src/components/general/component-name/`
2. ✅ Создать шаблон `.njk` как **макрос** (без комментариев документации внутри)
   ```njk
   {% macro render(param1="default", param2="default") %}
       {# Реализация компонента #}
   {% endmacro %}
   ```
3. ✅ Создать файл `.scss` с правильной структурой (использовать имя компонента как базовый класс)
4. ✅ Создать файл `.js`, если компонент нуждается в логике
5. ✅ Импортировать SCSS в `src/scss/index.scss`:
   ```scss
   @use "../components/general/component-name/component-name";
   ```
6. ✅ Импортировать и добавить в массив компонентов в `src/js/index.js` (при необходимости):
   ```js
   import { componentName } from "../components/general/component-name/component-name.js";

   const components = [menu, searchForm, componentName]; // Добавить в массив
   ```
7. ✅ Добавить поддержку ARIA атрибутов для доступности
8. ✅ Запустить линтеры: `npm run lint` и исправить все проблемы
9. ✅ Отформатировать код: `npm run format:fix` для обеспечения единообразного форматирования
