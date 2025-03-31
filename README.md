# Renklerle İnsanları Tanıma

Bu proje, kişilik özelliklerini renklerle ilişkilendirerek kullanıcıların kendilerini daha iyi tanımalarını sağlayan bir test uygulamasıdır.

## Özellikler

- 15 soruluk kişilik testi
- Her soruda 1 veya 2 şık seçme imkanı
- Renk bazlı sonuç analizi
- Sonuçları PNG veya Excel olarak indirme
- Admin paneli

## Kullanılan Teknolojiler

### Frontend
- React
- Vite
- Tailwind CSS
- Chart.js
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Kurulum

### Gereksinimler
- Node.js (v14.0 veya üzeri)
- npm veya yarn
- MongoDB veritabanı

### Backend Kurulumu

```bash
# Backend klasörüne gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun ve düzenleyin
# Örnek:
# PORT=5000
# MONGO_URI=mongodb+srv://...
# JWT_SECRET=renklerquizapplication2025
# JWT_EXPIRE=30d

# Veritabanını başlatın
npm run init

# Sunucuyu başlatın
npm start
```

### Frontend Kurulumu

```bash
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Admin Giriş Bilgileri

İlk giriş için:
- E-posta: admin@admin.com
- Şifre: admin

İlk girişten sonra yeni admin kullanıcısı oluşturulacak ve default admin hesabı devre dışı kalacaktır.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
