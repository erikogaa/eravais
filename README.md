# Мини-сайт: помощь при лудомании

Одностраничный сайт без сборки и зависимостей. Хостинг — Cloudflare Pages.

## Структура

```
public/              ← всё, что попадает на сайт
  index.html         разметка и тексты
  config.js          контакты и реквизиты (меняются здесь)
  erik.jpg           фото
  assets/style.css   оформление и анимации
  assets/app.js      логика: ссылки, копирование, анимации
  _headers           заголовки безопасности и кэша для Cloudflare
  robots.txt, sitemap.xml
wrangler.toml        настройки Cloudflare Pages
```

## Что править

**Контакты и реквизиты** — в `public/config.js`:

| Поле | Что это |
|---|---|
| `name` | Имя в шапке и в футере |
| `phone` | Номер для WhatsApp — только цифры: `77064254635` |
| `phoneDisplay` | Как номер показывается на сайте |
| `telegram` | Ник в Telegram, без `@` |
| `instagram` | Ник в Instagram, без `@` |
| `waText` / `waTextFamily` | Готовый текст, который подставится в WhatsApp |
| `kaspiPhone` | Номер для перевода в Kaspi (как показывать) |
| `kaspiPhoneCopy` | Что копируется по кнопке — формат `87064254635` |
| `kaspiCard` | Номер карты Visa (как показывать, с пробелами) |
| `kaspiCardCopy` | Что копируется по кнопке — без пробелов |
| `kaspiName` | Имя получателя, как в Kaspi |
| `youtube` | Ссылка на канал. Пусто — кнопки YouTube не будет |
| `youtubeLabel` | Подпись под кнопкой YouTube |

**Тексты** — прямо в `public/index.html`.

**Фото** — квадратное, файл `public/erik.jpg`. Пока файла нет — на его месте подсказка, сайт не ломается.

## Анимации

Все анимации — в конце `assets/style.css` (блок «АНИМАЦИИ») и в `assets/app.js`.
Если на телефоне включено «Уменьшение движения», сайт показывается сразу, без анимаций.

## Публикация на Cloudflare Pages

Сайт: **https://eravais.pages.dev**

Обновить сайт после правок:

```bash
cd "/Users/erikogaj/Ерик Сайт" && npx wrangler pages deploy
```

Wrangler сам возьмёт папку `public/` и имя проекта из `wrangler.toml`.
Первый раз попросит войти в Cloudflare (`npx wrangler login`).

Без терминала: Cloudflare → **Workers & Pages** → проект `eravais` → **Create deployment** →
перетащить папку `public`.

### Свой домен (позже)

Cloudflare → Workers & Pages → `eravais` → **Custom domains** → **Set up a domain**.
Если домен уже в Cloudflare — записи добавятся сами, HTTPS включится автоматически.
После этого поменяй адрес в `index.html` (`canonical`, `og:url`, `og:image`), `robots.txt` и `sitemap.xml`.

## Локальный просмотр

```bash
cd "/Users/erikogaj/Ерик Сайт" && python3 -m http.server 4321 -d public
```

Открой http://localhost:4321
