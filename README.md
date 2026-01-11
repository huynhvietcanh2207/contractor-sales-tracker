# Contractor Sales Tracker

Hệ thống Quản lý Tiến độ Sales & Nhà thầu phụ

## 🚀 Tính năng chính

- ✅ Quản lý dự án và theo dõi tiến độ
- ✅ Quản lý cơ hội (leads) từ nhiều nhà thầu phụ cạnh tranh
- ✅ Dashboard hiển thị thầu dẫn đầu cho mỗi dự án
- ✅ Hệ thống phân quyền (Admin, Tư vấn phụ, Sales)
- ✅ Bảng xếp hạng và điểm thưởng
- ✅ Thông báo realtime

## 📋 Yêu cầu

- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Không cần cài đặt server hay database

## 🎯 Cách sử dụng

### Chạy local

1. Mở file `index.html` bằng trình duyệt
2. Hoặc dùng live server:
```bash
npx serve contractor-sales-tracker -l 3000
```

### Deploy lên hosting

Có thể deploy lên các nền tảng miễn phí:

#### 1. **Netlify** (Khuyến nghị)
- Kéo thả folder `contractor-sales-tracker` vào [Netlify Drop](https://app.netlify.com/drop)
- Hoặc dùng Netlify CLI:
```bash
cd contractor-sales-tracker
npx netlify-cli deploy --prod
```

#### 2. **Vercel**
```bash
cd contractor-sales-tracker
npx vercel --prod
```

#### 3. **GitHub Pages**
- Push code lên GitHub repository
- Vào Settings > Pages
- Chọn branch và folder
- Lưu và đợi deploy

#### 4. **Firebase Hosting**
```bash
cd contractor-sales-tracker
npx firebase-tools init hosting
npx firebase-tools deploy
```

## 👥 Tài khoản demo

### Admin
- Email: `admin@company.com`
- Password: `123456`

### Tư vấn phụ
- Email: `consultant1@company.com`
- Password: `123456`

### Sales
- Email: `sales1@company.com`
- Password: `123456`

## 📱 Responsive

Ứng dụng hoạt động tốt trên:
- 💻 Desktop
- 📱 Mobile
- 📱 Tablet

## 🛠️ Công nghệ

- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- LocalStorage (database)

## 📝 Lưu ý

- Dữ liệu được lưu trong LocalStorage của trình duyệt
- Xóa cache/cookies sẽ mất dữ liệu
- Để reset dữ liệu về mặc định, mở Console và chạy: `resetDatabase()`

## 📞 Hỗ trợ

Nếu có vấn đề, vui lòng liên hệ team phát triển.

---

© 2026 Contractor Sales Tracker. All rights reserved.
