
<div align="center">

# ⚡ LvdCord Web Client — Next.js Frontend

  <p>
    Современный, веб-клиент для платформы <b>LvdCord</b>. Реализован в стиле Discord с поддержкой WebRTC голосовых комнат, личек и адаптивного дизайна.
  </p>

  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Components-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
  ![LiveKit](https://img.shields.io/badge/LiveKit-React_SDK-FF4F00?style=for-the-badge)
  ![Zustand](https://img.shields.io/badge/Zustand-State_Management-443E38?style=for-the-badge)

</div>

---

## 📌 Особенности интерфейса

- 🎨 **Discord UI**:
    - Темная палитра цветов в пространстве OKLCH (`#313338`, `#2b2d31`, `#1e1f22`, Blurple `#5865f2`).
    - Кастомный профиль пользователя («Моя учетная запись») с баннером и карточками настроек.
- 🔊 **Непрерывная голосовая связь (Voice in Background)**:
    - Глобальный `GlobalVoiceProvider` в корневом макете позволяет переключаться между серверами и чатами **без разрыва голосового звонка**.
    - **React Portals**: Виджет статуса звонка (`VoiceStatusWidget`) и контроллеры микрофона телепортируются напрямую в сайдбар над профилем пользователя.
    - **Индивидуальный аудио-контроль**: Громкость каждого участника звонка настраивается отдельно (0–100%), поддержка локального мута.
- 📱 **Полный адаптив (Responsive Design)**:
    - Автоматическое скрытие сайдбаров на мобильных экранах (`< 768px`).
    - Выкатная шторка (`Sheet`) с единым доступом к серверам, каналам и личным перепискам.
- 💬 **Гибридный текстовый чат**:
    - История сообщений подгружается из PostgreSQL через Server Actions.
    - Новые сообщения в реальном времени доставляются с нулевой задержкой через WebRTC Data Channels LiveKit (`useChat`).
- 🤝 **Лички и Друзья**:
    - Полноценная страница друзей («В сети», «Все», «Ожидание», «Добавить в друзья»).
    - Быстрый старт диалога 1-на-1 (Lazy DM) и создание групповых чатов (Group DMs).
- 🔄 **Авто-обновление сессий**:
    - Axios-интерцепторы на клиенте и сервере с поддержкой Cookie Polling для бесшовного рефреша токенов и синхронизации между вкладками.

---

## 🛠️ Технологический стек

- **Фреймворк**: Next.js 15+ (App Router, Server Actions, Server Components)
- **Стилизация**: Tailwind CSS v4 + Shadcn UI
- **Управление состоянием**: Zustand (`useAuthStore`, `useVoiceStore`)
- **WebRTC Связь**: `@livekit/components-react` + `livekit-client`
- **HTTP Клиент**: Axios (с автоматическими интерцепторами авторизации)
- **Иконки**: Lucide React
- **Уведомления**: Sonner Toasts

---

## 📁 Архитектура (Feature-Sliced Design / Feature-Based)

Проект организован по принципам декомпозиции на фичи и сущности:

```text
src/
├── app/                  # Routes (App Router), корневые layouts и провайдеры
├── features/             # Модули бизнес-логики (auth, server, chat, voice, friends)
│   ├── [feature]/
│   │   ├── actions.ts    # Next.js Server Actions ('use server')
│   │   ├── components/   # UI-компоненты конкретной фичи
│   │   ├── store/        # Zustand-сторы
│   │   └── types/        # TypeScript интерфейсы
├── components/ui/        # Базовый Shadcn UI-кит (Button, Dialog, Sheet, Avatar)
├── lib/                  # Инстанс Axios (api.ts), createSafeAction обертка
└── constants/            # Константы роутинга
```
