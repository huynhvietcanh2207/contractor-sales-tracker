# 🚀 Hướng dẫn Deploy Contractor Sales Tracker

## 📋 Bước 1: Push lên GitHub

### 1.1. Tạo repository mới trên GitHub
1. Vào https://github.com/new
2. Đặt tên: `contractor-sales-tracker`
3. Chọn **Public** hoặc **Private**
4. **KHÔNG** chọn "Initialize with README"
5. Click **Create repository**

### 1.2. Push code lên GitHub
```bash
# Thêm remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/contractor-sales-tracker.git

# Push code
git branch -M main
git push -u origin main
```

---

## 🌐 Bước 2: Deploy lên Netlify (KHUYẾN NGHỊ - DễNHẤT)

### Cách 1: Deploy qua Netlify Drop (Nhanh nhất - 2 phút)
1. Vào https://app.netlify.com/drop
2. Kéo thả folder `contractor-sales-tracker` vào
3. Đợi 30 giây
4. ✅ **XONG!** Netlify sẽ cho bạn link: `https://random-name.netlify.app`

### Cách 2: Deploy qua GitHub (Tự động update)
1. Vào https://app.netlify.com
2. Click **Add new site** > **Import an existing project**
3. Chọn **GitHub**
4. Authorize Netlify
5. Chọn repository `contractor-sales-tracker`
6. **Build settings:**
   - Build command: (để trống)
   - Publish directory: `.` (dấu chấm)
7. Click **Deploy site**
8. ✅ **XONG!** Mỗi lần push code, site tự động update!

### Đổi tên domain (Optional)
1. Vào **Site settings** > **Domain management**
2. Click **Options** > **Edit site name**
3. Đổi thành: `your-company-sales-tracker.netlify.app`

---

## 🔥 Bước 3: Deploy lên Vercel (Thay thế Netlify)

### Deploy qua Vercel CLI
```bash
# Install Vercel CLI (chỉ cần 1 lần)
npm install -g vercel

# Deploy
cd contractor-sales-tracker
vercel --prod
```

### Deploy qua Vercel Dashboard
1. Vào https://vercel.com/new
2. Import repository từ GitHub
3. Click **Deploy**
4. ✅ **XONG!**

---

## 📄 Bước 4: Deploy lên GitHub Pages (Miễn phí)

### 4.1. Tạo branch gh-pages
```bash
git checkout -b gh-pages
git push origin gh-pages
```

### 4.2. Cấu hình GitHub Pages
1. Vào repository trên GitHub
2. **Settings** > **Pages**
3. Source: chọn `gh-pages` branch
4. Folder: chọn `/ (root)`
5. Click **Save**
6. Đợi 2-3 phút
7. ✅ Site sẽ có tại: `https://YOUR_USERNAME.github.io/contractor-sales-tracker/`

---

## 🎯 So sánh các nền tảng

| Nền tảng | Tốc độ | Tự động deploy | Custom domain | Khuyến nghị |
|----------|--------|----------------|---------------|-------------|
| **Netlify** | ⚡⚡⚡ | ✅ | ✅ (miễn phí) | ⭐⭐⭐⭐⭐ |
| **Vercel** | ⚡⚡⚡ | ✅ | ✅ (miễn phí) | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | ⚡⚡ | ❌ | ✅ (cần setup) | ⭐⭐⭐ |

---

## 🔒 Bước 5: Bảo mật (Quan trọng!)

### Thay đổi mật khẩu mặc định
Sau khi deploy, **BẮT BUỘC** phải:

1. Login với tài khoản admin:
   - Email: `admin@company.com`
   - Password: `123456`

2. Vào **Nhân sự** > Sửa tài khoản admin
3. **ĐỔI MẬT KHẨU NGAY!**

### Tạo tài khoản thật
1. Xóa các tài khoản demo
2. Tạo tài khoản thật cho team
3. Gán quyền phù hợp

---

## 📱 Bước 6: Chia sẻ với team

Sau khi deploy xong, gửi link cho team:

```
🎉 Hệ thống Sales Tracker đã sẵn sàng!

Link: https://your-site.netlify.app

Tài khoản demo:
- Admin: admin@company.com / 123456
- Tư vấn: consultant1@company.com / 123456
- Sales: sales1@company.com / 123456

⚠️ Nhớ đổi mật khẩu sau khi login lần đầu!
```

---

## 🆘 Troubleshooting

### Lỗi: "Site not found"
- Đợi 2-3 phút sau khi deploy
- Clear cache trình duyệt (Ctrl + Shift + R)

### Lỗi: "Build failed"
- Kiểm tra lại Build settings
- Publish directory phải là `.` (root)

### Dữ liệu bị mất khi refresh
- Đây là tính năng, dữ liệu lưu trong localStorage
- Để reset: Mở Console > gõ `localStorage.clear()`

---

## 🎊 Hoàn thành!

Bây giờ bạn đã có:
- ✅ Code trên GitHub
- ✅ Website live trên internet
- ✅ Link để chia sẻ với team
- ✅ Tự động deploy khi update code

**Chúc mừng! 🎉**
