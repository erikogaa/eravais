# Мини-сайт: помощь при лудомании

Одностраничный сайт. Один файл `index.html` — без сборки, без зависимостей.

## Что править

Открой `index.html`, найди в конце файла блок `const CONFIG = {` — **всё меняется только там**:

| Поле | Что это |
|---|---|
| `name` | Имя в шапке, подписи под цитатой и в футере |
| `phone` | Номер для WhatsApp — только цифры: `77064254635` |
| `phoneDisplay` | Как номер показывается на сайте |
| `telegram` | Ник в Telegram, без `@` |
| `instagram` | Ник в Instagram, без `@` |
| `waText` | Готовый текст, который подставится в WhatsApp |
| `kaspiPhone` | Номер для перевода в Kaspi (как показывать) |
| `kaspiPhoneCopy` | Что копируется по кнопке — формат `87064254635` |
| `kaspiName` | Имя получателя, как в Kaspi |
| `donationAlerts` | Ник в DonationAlerts → `donationalerts.com/r/НИК` |

## Фото

1. Сохрани свою фотографию (квадратную — она обрезается 1:1) в папку с сайтом.
2. Назови файл ровно `erik.jpg`.

Фото появится в шапке само. Пока файла нет — на его месте подсказка, сайт не ломается.
Подпись к фото для поисковиков меняется в `CONFIG.photoAlt`.

## Kaspi QR

1. В приложении Kaspi.kz открой свой QR → «Поделиться» / «Сохранить».
2. Назови файл ровно `kaspi-qr.png`.
3. Положи его рядом с `index.html`.

QR появится на сайте сам. Пока файла нет — вместо него подсказка, ничего не ломается.

## DonationAlerts

1. Зарегистрируйся на https://www.donationalerts.com (вход через Google/почту).
2. В настройках задай ник — он попадёт в ссылку `donationalerts.com/r/НИК`.
3. Подключи вывод средств и включи нужные способы оплаты (карты, кошельки, крипта).
4. Впиши этот ник в `CONFIG.donationAlerts`.

## Публикация на GitHub Pages (бесплатно)

1. Зарегистрируйся на https://github.com
2. Создай репозиторий с именем `<твой-логин>.github.io` — **Public**.
3. Залей файлы:

```bash
cd "/Users/erikogaj/Ерик Сайт" && git init -b main && git add index.html README.md erik.jpg && git commit -m "site" && git remote add origin https://github.com/ЛОГИН/ЛОГИН.github.io.git && git push -u origin main
```

4. В репозитории: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
5. Через 1–2 минуты сайт открыт по адресу `https://ЛОГИН.github.io`

Каждое обновление:

```bash
cd "/Users/erikogaj/Ерик Сайт" && git add -A && git commit -m "update" && git push
```

## Свой домен (позже)

Купи домен (например `eravais.kz`), затем в **Settings → Pages → Custom domain** впиши его,
а у регистратора добавь записи:

```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
CNAME  www  ЛОГИН.github.io
```

HTTPS включится автоматически (галочка «Enforce HTTPS»).

## Локальный просмотр

```bash
cd "/Users/erikogaj/Ерик Сайт" && python3 -m http.server 4321
```

Открой http://localhost:4321
