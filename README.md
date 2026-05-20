# 🏸 SportCenter - Web-Based Database System

Sistem Pemesanan Lapangan Futsal & Badminton berbasis web yang menerapkan **Three-Tier Architecture** serverless. Proyek ini dibuat untuk memenuhi tugas mata kuliah Data Engineering.

## 🚀 Link Live Demo
[Klik di sini untuk mengakses aplikasi](https://username.github.io/futsal-booking-system/) *(Ganti dengan link GitHub Pages kamu)*

## 🛠️ Fitur Utama
* **Statistik Dinamis:** Menghitung total booking dan sesi per lapangan secara real-time.
* **Fitur Pencarian (Search):** Filter data pelanggan dan lapangan secara instan tanpa membebani performa API.
* **Real-time Read & Create:** Integrasi langsung ke Google Sheets tanpa perlu reload halaman.
* **Responsive Web Design:** Tampilan optimal di perangkat mobile maupun desktop.

## 📐 Arsitektur Sistem (Three-Tier)
1. **Presentation Tier:** HTML5, CSS3, Vanilla JavaScript (Hosted via GitHub Pages)
2. **Application Tier:** Google Apps Script (RESTful API Engine)
3. **Data Tier:** Google Sheets (Cloud Relational Database Simulation)

## 📁 Struktur Kode
* `index.html` - Struktur antarmuka dan komponen UI.
* `style.css` - Desain tata letak modern, variabel warna, dan animasi spinner.
* `app.js` - Logika konsumsi API (Fetch GET/POST) dan pemrosesan data lokal.