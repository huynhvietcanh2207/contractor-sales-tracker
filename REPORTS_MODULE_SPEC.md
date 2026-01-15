# 📊 REPORTS MODULE - ĐẶC TẢ KỸ THUẬT

## 📌 TỔNG QUAN

Thêm 2 module báo cáo mới vào hệ thống:
1. **Sales Report** - Báo cáo hoạt động của nhân viên Sales
2. **Consultant Report** - Báo cáo hoạt động của nhân viên Tư vấn

**Lưu ý quan trọng về phân quyền:**
- **Admin:** Xem được tất cả báo cáo của mọi nhân viên
- **Sales:** Chỉ xem được báo cáo của bản thân
- **Consultant (Tư vấn):** Chỉ xem được báo cáo của bản thân

---

## 📈 MODULE 1: SALES REPORT

### 1.1 Mục đích
Giúp Sales và Admin theo dõi hiệu suất hoạt động của nhân viên Sales, bao gồm số lượng nhà thầu/khách hàng đã gặp, số dự án tham gia theo thời gian.

### 1.2 Các thành phần hiển thị

#### A. Thẻ Thống Kê (Stats Cards)
| Thẻ | Mô tả | Màu sắc |
|-----|-------|---------|
| **Tổng nhà thầu đã gặp** | Đếm số lượng nhà thầu/khách hàng mà Sales đã tiếp xúc (có trong leads) | 🔵 Xanh dương |
| **Nhà thầu mới tháng này** | Số lượng nhà thầu mới (first contact trong tháng hiện tại) | 🟢 Xanh lá |
| **Tổng dự án tham gia** | Số dự án mà Sales có lead được assign | 🟠 Cam |

#### B. Biểu đồ theo Module Sales

##### B1. Biểu đồ Cột - Số lượng dự án tham gia theo tháng
- **Loại:** Bar Chart (Vertical)
- **Trục X:** Tháng (MM/YYYY)
- **Trục Y:** Số lượng dự án
- **Bộ lọc:** Dropdown chọn năm (mặc định năm hiện tại)
- **Màu sắc:** Gradient xanh dương

##### B2. Biểu đồ Cột - Số lượng nhà thầu mới đã gặp theo tháng
- **Loại:** Bar Chart (Vertical)
- **Trục X:** Tháng (MM/YYYY)
- **Trục Y:** Số lượng nhà thầu mới
- **Định nghĩa nhà thầu mới:** Nhà thầu có lead đầu tiên được tạo trong tháng đó
- **Màu sắc:** Gradient xanh lá

#### C. Biểu đồ Chung (Áp dụng cho cả Sales & Consultant)

##### C1. Biểu đồ Tròn (Pie/Donut Chart) - Tình trạng dự án
- **Loại:** Donut Chart
- **Hiển thị:** Phân bổ dự án theo trạng thái (Active / Won / Lost / Cancelled)
- **Số tổng ở giữa:** Tổng số dự án tham gia
- **Màu sắc:** 
  - 🔵 Active: Xanh dương
  - 🟢 Won: Xanh lá
  - 🔴 Lost: Đỏ
  - ⚫ Cancelled: Xám

##### C2. Biểu đồ Kết hợp Cột + Đường (Bar + Line Chart) - Trend
- **Điều kiện hiển thị:** Chỉ xuất hiện khi có dữ liệu từ **≥ 3 tháng**
- **Loại:** Combo Chart (Bar + Line)
- **Trục X:** Tháng (MM/YYYY)
- **Trục Y trái (Cột):** Số lượng dự án mới tham gia
- **Trục Y phải (Đường):** Tỷ lệ thắng (Win Rate %)
- **Mục đích:** Theo dõi xu hướng hiệu suất theo thời gian

---

## 📈 MODULE 2: CONSULTANT REPORT (TƯ VẤN)

### 2.1 Mục đích
Giúp Tư vấn và Admin theo dõi hiệu suất hoạt động của nhân viên Tư vấn, bao gồm số dự án đã làm, số lượng sản phẩm, và giá trị báo giá.

### 2.2 Cập nhật Data Model

#### Thay đổi trường `product_notes` trong Project

**Hiện tại:**
```javascript
product_notes: 'Cần 200 bộ cửa nhôm cao cấp, 150 bộ cửa kính cường lực. Liên hệ nhãn hàng Eurowindow.'
```

**Thay đổi thành Object với nhiều trường:**
```javascript
product_info: {
    notes: 'Cần 200 bộ cửa nhôm cao cấp, 150 bộ cửa kính cường lực. Liên hệ nhãn hàng Eurowindow.',
    quantity: 350,           // Tổng số lượng sản phẩm
    unit: 'bộ',              // Đơn vị
    quoted_amount: 850000000 // Số tiền đã báo giá (VNĐ)
}
```

**Lưu ý:** Cần migration để chuyển đổi dữ liệu cũ sang format mới.

### 2.3 Các thành phần hiển thị

#### A. Thẻ Thống Kê (Stats Cards)
| Thẻ | Mô tả | Màu sắc |
|-----|-------|---------|
| **Tổng dự án đã làm** | Số dự án được assign làm Tư vấn | 🔵 Xanh dương |
| **Tổng sản phẩm** | Tổng số lượng sản phẩm trong các dự án (từ `product_info.quantity`) | 🟠 Cam |
| **Tổng tiền đã báo** | Tổng giá trị báo giá (từ `product_info.quoted_amount`) | 🟢 Xanh lá |

#### B. Biểu đồ theo Module Consultant

##### B1. Biểu đồ Cột - Số lượng dự án đã làm theo tháng
- **Loại:** Bar Chart (Vertical)
- **Trục X:** Tháng (MM/YYYY)
- **Trục Y:** Số lượng dự án
- **Bộ lọc:** Dropdown chọn năm
- **Màu sắc:** Gradient tím

##### B2. Biểu đồ Cột - Số lượng sản phẩm theo dự án
- **Loại:** Bar Chart (Horizontal)
- **Trục X:** Số lượng sản phẩm
- **Trục Y:** Tên dự án (top 10)
- **Dữ liệu:** Từ `product_info.quantity` của các dự án Tư vấn tham gia
- **Màu sắc:** Gradient cam

##### B3. Biểu đồ Cột - Số tiền đã báo giá theo dự án
- **Loại:** Bar Chart (Horizontal)
- **Trục X:** Số tiền (VNĐ)
- **Trục Y:** Tên dự án (top 10)
- **Dữ liệu:** Từ `product_info.quoted_amount` của các dự án Tư vấn tham gia
- **Màu sắc:** Gradient xanh lá
- **Format:** Hiển thị theo đơn vị triệu/tỷ VNĐ

#### C. Biểu đồ Chung (Giống Sales)
- C1. Biểu đồ Tròn - Tình trạng dự án
- C2. Biểu đồ Combo (≥3 tháng)

---

## 🔐 PHÂN QUYỀN CHI TIẾT

| Vai trò | Báo cáo Sales | Báo cáo Tư vấn | Dữ liệu hiển thị |
|---------|---------------|----------------|------------------|
| **Admin** | ✅ Xem tất cả | ✅ Xem tất cả | Dropdown chọn nhân viên + Xem tổng hợp |
| **Sales** | ✅ Xem của mình | ❌ Không thấy | Chỉ hiển thị dữ liệu cá nhân |
| **Consultant** | ❌ Không thấy | ✅ Xem của mình | Chỉ hiển thị dữ liệu cá nhân |

### Admin View:
- Có dropdown để chọn nhân viên cụ thể hoặc "Tất cả"
- Khi chọn "Tất cả": Hiển thị dữ liệu tổng hợp của toàn bộ team
- Có thêm bảng so sánh hiệu suất giữa các nhân viên (optional)

---

## 🎨 THIẾT KẾ UI/UX

### Layout trang Report

```
+-----------------------------------------------+
|  📊 BÁO CÁO SALES                    [Dropdown: Chọn Sales - Admin only]
+-----------------------------------------------+
|  [Stats Card 1]  [Stats Card 2]  [Stats Card 3]
+-----------------------------------------------+
|  +-------------------+  +-------------------+
|  | Biểu đồ dự án     |  | Biểu đồ nhà thầu  |
|  | theo tháng        |  | mới theo tháng    |
|  +-------------------+  +-------------------+
+-----------------------------------------------+
|  +-------------------+  +-------------------+
|  | Pie Chart         |  | Combo Chart       |
|  | Tình trạng dự án  |  | (≥3 tháng)        |
|  +-------------------+  +-------------------+
+-----------------------------------------------+
```

### Style Guidelines
- **Cards:** Rounded corners, subtle shadow, glassmorphism effect
- **Charts:** Smooth animations, tooltips on hover
- **Colors:** Theo theme hiện tại của app
- **Responsive:** Grid layout responsive cho mobile/tablet

---

## 📋 TASK BREAKDOWN

### PHASE 1: Chuẩn bị Data (Ước lượng: 2-3 giờ)

#### Task 1.1: Cập nhật Data Model
- [ ] Refactor `product_notes` → `product_info` object trong seed.js
- [ ] Thêm các trường: `notes`, `quantity`, `unit`, `quoted_amount`
- [ ] Cập nhật DB_VERSION để trigger migration
- [ ] Test migration dữ liệu cũ

#### Task 1.2: Cập nhật Form Dự án
- [ ] Sửa form tạo/sửa dự án để hỗ trợ `product_info`
- [ ] Thêm input fields: Số lượng sản phẩm, Đơn vị, Số tiền báo giá
- [ ] Validation cho các trường mới
- [ ] Backward compatibility với dữ liệu cũ

#### Task 1.3: Cập nhật API functions
- [ ] Sửa `api.js` để đọc/ghi `product_info`
- [ ] Thêm helper functions cho báo cáo

---

### PHASE 2: Module Báo cáo Sales (Ước lượng: 4-5 giờ)

#### Task 2.1: Tạo trang Sales Report
- [ ] Tạo file `js/pages/report-sales.js`
- [ ] Tạo route `/report-sales` trong router.js
- [ ] Thêm menu item trong sidebar

#### Task 2.2: Stats Cards
- [ ] Implement card "Tổng nhà thầu đã gặp"
- [ ] Implement card "Nhà thầu mới tháng này"
- [ ] Implement card "Tổng dự án tham gia"
- [ ] Animation và styling

#### Task 2.3: Biểu đồ dự án theo tháng
- [ ] Implement Bar Chart sử dụng CSS/Canvas/Chart.js
- [ ] Logic tính toán dữ liệu theo tháng
- [ ] Dropdown filter theo năm
- [ ] Responsive design

#### Task 2.4: Biểu đồ nhà thầu mới theo tháng
- [ ] Implement Bar Chart
- [ ] Logic xác định nhà thầu mới
- [ ] Responsive design

#### Task 2.5: Apply phân quyền
- [ ] Logic kiểm tra role
- [ ] Filter dữ liệu theo user đăng nhập
- [ ] Dropdown chọn nhân viên cho Admin

---

### PHASE 3: Module Báo cáo Tư vấn (Ước lượng: 4-5 giờ)

#### Task 3.1: Tạo trang Consultant Report
- [ ] Tạo file `js/pages/report-consultant.js`
- [ ] Tạo route `/report-consultant` trong router.js
- [ ] Thêm menu item trong sidebar

#### Task 3.2: Stats Cards
- [ ] Implement card "Tổng dự án đã làm"
- [ ] Implement card "Tổng sản phẩm"
- [ ] Implement card "Tổng tiền đã báo"
- [ ] Animation và styling

#### Task 3.3: Biểu đồ dự án theo tháng
- [ ] Implement Bar Chart
- [ ] Logic tính toán theo Consultant assigned
- [ ] Dropdown filter theo năm

#### Task 3.4: Biểu đồ số lượng sản phẩm
- [ ] Implement Horizontal Bar Chart
- [ ] Hiển thị top 10 dự án
- [ ] Responsive design

#### Task 3.5: Biểu đồ số tiền báo giá
- [ ] Implement Horizontal Bar Chart
- [ ] Format số tiền (triệu/tỷ VNĐ)
- [ ] Hiển thị top 10 dự án

#### Task 3.6: Apply phân quyền
- [ ] Logic kiểm tra role
- [ ] Filter dữ liệu theo user
- [ ] Dropdown chọn nhân viên cho Admin

---

### PHASE 4: Biểu đồ chung (Ước lượng: 3-4 giờ)

#### Task 4.1: Pie/Donut Chart - Tình trạng dự án
- [ ] Implement Donut Chart
- [ ] Phân bổ Active/Won/Lost/Cancelled
- [ ] Animation và tooltips
- [ ] Hiển thị tổng số ở giữa

#### Task 4.2: Combo Chart (Bar + Line)
- [ ] Implement Combo Chart
- [ ] Logic kiểm tra ≥3 tháng dữ liệu
- [ ] Ẩn/hiện dựa trên điều kiện
- [ ] Dual Y-axis

---

### PHASE 5: Polish & Testing (Ước lượng: 2-3 giờ)

#### Task 5.1: CSS & Animations
- [ ] Thêm CSS cho các charts
- [ ] Micro-animations
- [ ] Glassmorphism effects
- [ ] Dark mode support

#### Task 5.2: Testing
- [ ] Test với các vai trò khác nhau (Admin/Sales/Consultant)
- [ ] Test responsive trên mobile
- [ ] Test với dữ liệu rỗng (edge cases)
- [ ] Test performance

#### Task 5.3: Documentation
- [ ] Cập nhật CUSTOMER_PRESENTATION_SPEC.md
- [ ] Thêm hướng dẫn sử dụng

---

## 📊 KỸ THUẬT TRIỂN KHAI CHARTS

### Option 1: Vanilla CSS/HTML Charts (Khuyến nghị)
- Không phụ thuộc thư viện bên ngoài
- Lightweight
- Custom hoàn toàn
- Sử dụng CSS Grid + Flexbox + Transforms

### Option 2: Chart.js (CDN)
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```
- Dễ implement
- Nhiều loại chart
- Responsive built-in

### Option 3: Canvas API
- Native JavaScript
- Full control
- Performance tốt

**Quyết định:** Sử dụng **Vanilla CSS/HTML** cho simple charts (bars, pie) và **Chart.js CDN** nếu cần combo chart phức tạp.

---

## 🔄 BACKWARD COMPATIBILITY

### Migration Strategy cho product_info

```javascript
// Trong api.js - khi đọc project
function getProjectProductInfo(project) {
    // Nếu dữ liệu cũ (string)
    if (typeof project.product_notes === 'string') {
        return {
            notes: project.product_notes,
            quantity: 0,
            unit: '',
            quoted_amount: 0
        };
    }
    // Nếu dữ liệu mới (object)
    return project.product_info || {
        notes: '',
        quantity: 0,
        unit: '',
        quoted_amount: 0
    };
}
```

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Data model đã cập nhật
- [ ] Form dự án đã sửa
- [ ] Trang Sales Report hoạt động
- [ ] Trang Consultant Report hoạt động
- [ ] Phân quyền đúng cho 3 roles
- [ ] Biểu đồ tròn hiển thị đúng
- [ ] Biểu đồ combo hiển thị khi ≥3 tháng
- [ ] Responsive trên mobile
- [ ] Test với nhiều scenarios

---

*Version 1.0 - Created: 2026-01-15*
