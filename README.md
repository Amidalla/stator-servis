# Статор-Сервис

Вёрстка сайта [stator-servis.ru](https://stator-servis.ru/) — статический генератор на Gulp, Nunjucks и SCSS.

Сейчас полностью сверстана **главная** (`/home.html`). Остальные страницы в каркасе с заглушкой «страница в разработке».

## Стек

- **Gulp** — сборка и dev-сервер (BrowserSync)
- **Nunjucks** — шаблоны страниц, блоков и компонентов
- **SCSS** — стили с модульным `@use`
- **esbuild** — сборка JS в один бандл
- **Lozad.js** — ленивая загрузка изображений (`.lazy`)
- **Swiper** — слайдеры (наши работы, отзывы, полезные материалы)
- **Fancyapps UI** — попапы (заказ звонка, успешная отправка)
- **imask** — маска телефона в формах

## Быстрый старт

```sh
npm install
npm start
```

Dev-сервер: `http://localhost:3000`  
Сборка в `temp/` с живой перезагрузкой.

Навигация по страницам вёрстки: `/` (`index.html`).

## Команды

| Команда | Описание |
|---------|----------|
| `npm start` / `gulp` | Dev-сервер + сборка в `temp/` |
| `npm run build` / `gulp build` | Продакшн-сборка в `build/` |
| `gulp clean` | Удалить `temp/` и `build/` |
| `npm run lint` | ESLint + Stylelint |
| `npm run lint:js` / `lint:scss` | Линт по отдельности |
| `npm run lint:js:fix` / `lint:scss:fix` | Автоисправление |
| `npm run format` / `format:fix` | Проверка / правка Prettier |
| `npm run check` | lint + format |
| `npm run fix` | автофикс lint + format |
| `npm run analyze` | Размер JS-бандла |
| `npm run validate` | W3C-валидация HTML из `build/` |
| `npm run compress` | Сжатие исходных изображений в `src/assets/images/` |

## Структура

```
src/
├── assets/                 # шрифты, изображения, favicons
├── blocks/
│   ├── general/            # header, footer, meta, page-in-dev
│   └── common/             # секции главной (hero, FAQ, форма…)
├── components/
│   ├── general/            # button, form, menu, input…
│   └── common/             # контакты, попапы, copyright…
├── layouts/default.njk     # общий макет
├── pages/                  # страницы → HTML
├── scss/                   # core + точка входа index.scss
└── js/                     # точка входа index.js + utils
```

### Главная (`pages/home.njk`)

Секции по порядку:

1. `hero` — первый экран
2. `directions` — направления работ
3. `about-intro` / `about-company` — о компании
4. `advantages` — преимущества
5. `our-works` — наши работы (Swiper)
6. `reviews` — отзывы (Swiper)
7. `work-types` — виды работ
8. `faq-home` — FAQ (аккордеон)
9. `useful-materials` — полезные материалы (Swiper)
10. `main-form` — форма заявки

Общий каркас: header, footer, мобильное меню, попап «Заказать звонок», уведомление об успешной отправке, cookie-баннер.

### Остальные страницы

Заглушка `page-in-dev`: услуги, о компании, работы, блог, цены, FAQ, контакты, политика, 404.

## Попапы

```js
// Успешная отправка формы
window.showPopup("popup-feedback-success");

// Или через API компонента
window.PopupFeedbackSuccess.open();
```

Попап обратного звонка открывается по `data-src="popup-callback"` (кнопки в header/footer/меню).

## Контроль качества

- **ESLint** — логика JS (без стилистики)
- **Stylelint** — SCSS + сортировка свойств
- **Prettier** — HTML, SCSS, JS, JSON (файлы `.njk` не форматируются)

Перед коммитом: `npm run fix`.

## Браузеры

`browserslist` в `package.json`:

- > 1%
- последние 10 версий
- не dead
