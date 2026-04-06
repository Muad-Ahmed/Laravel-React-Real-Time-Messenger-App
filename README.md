# 🚀 Laravel-React Real-Time Messenger

[![Laravel 12](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![React 18](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![WebSockets](https://img.shields.io/badge/WebSockets-Real--time-brightgreen.svg)](https://laravel.com/docs/reverb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, real-time messaging application featuring both private and group chats, media handling, and administrative controls. Built with **Laravel 12 (Reverb)** and **React (Inertia.js)** for a seamless and responsive user experience.

🔗 **Live Demo:** [https://messenger.muad.pro](https://messenger.muad.pro)


---

## ✨ Key Features

- 💬 **Instant Real-Time Messaging:** Experience lightning-fast private and group messaging powered by **Laravel Reverb**.
- 📂 **Rich Media Support:** Seamlessly send and receive images, audio messages, and files with instant previews.
- 🔄 **Infinite Message History:** Optimized loading of large conversation histories via efficient infinite scroll and backend pagination.
- 🧹 **Asynchronous Group Ops:** Large-scale group management and deletions are handled via **background jobs** for maximum UI responsiveness.
- 🔐 **Advanced User Controls:** Full RBAC (Role-Based Access Control) with admin capabilities, user blocking, and granular permissions.
- 🎨 **Modern & Responsive UI:** A sleek, mobile-ready design built with **React**, **Tailwind CSS**, and **DaisyUI**.

---

## 🛠 Tech Stack

| Layer          | Technology |
|----------------|------------|
| **Framework**    | **Laravel 12** & **React 18** (via **Inertia.js**) |
| **Real-time**    | **Laravel Reverb** (WebSocket Server) |
| **Styling**      | **Tailwind CSS** + **DaisyUI** |
| **Auth**         | **Laravel Sanctum** & **Breeze** |
| **Worker**       | Redis / Database Queue (for deletions/heavy ops) |
| **Deployment**   | VPS + **CI/CD** (GitHub Actions) |

---

## 🚀 Getting Started

### Prerequisites
- **PHP 8.2+**
- **Node.js 18+** & NPM
- **Composer**
- **MySQL** / **PostgreSQL**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Muad-Ahmed/Laravel-React-Real-Time-Messenger-App.git
   cd Laravel-React-Real-Time-Messenger-App
   ```

2. **Environment & Dependencies:**
   ```bash
   composer install
   npm install
   cp .env.example .env
   php artisan key:generate
   ```
   *Note: Update `.env` with your DB and Reverb credentials.*

3. **Database & Seeding:**
   ```bash
   php artisan migrate --seed
   ```

4. **Running Locally:**
   ```bash
   # Open 4 terminal sessions:
   php artisan serve          # App server
   php artisan reverb:start    # WebSocket server
   php artisan queue:listen   # Background jobs
   npm run dev                # Frontend assets
   ```

---

## 📜 License
This project is open-source and licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

Developed by **Muad Ahmed**

