# 📋 CONTRACTOR SALES TRACKER - LỘ TRÌNH TRÌNH BÀY

## 🎯 TỔNG QUAN

**Contractor Sales Tracker** - Hệ thống quản lý nhà thầu phụ:
- ✅ Quản lý dự án & nhà thầu
- ✅ Theo dõi tiến độ deal
- ✅ Phân quyền Admin/Sales/Tư vấn
- ✅ Thống kê tự động

**6 Modules chính:** Dashboard | Dự án | Nhà thầu phụ | Nhân sự | Thưởng | Thông báo

---

## 📊 MODULE 1: DASHBOARD (CHI TIẾT)

### Mục đích
Tổng quan toàn bộ hoạt động kinh doanh trên 1 màn hình.

### Các thành phần

#### A. Thẻ Thống Kê
- **Dự án Active** (Xanh dương)
- **Thầu tham gia** (Xanh lá)
- **Deal Won** (Vàng cam)

#### B. Top Nhà Thầu Phụ
- Biểu đồ thanh ngang
- Top 5 nhà thầu có nhiều deals nhất
- Animation khi load

#### C. Biểu Đồ Tròn - Tình Trạng
- Phân bổ: Active / Won / Lost
- Donut Chart với tổng số ở giữa

#### D. Tình Hình Dự Án (QUAN TRỌNG)
**Grid Cards hiển thị:**
- Mã + Tên dự án, Giá trị ước tính
- Số nhà thầu / Sales / Tư vấn
- **Thầu dẫn đầu:**
  - Tên nhà thầu
  - Giai đoạn hiện tại
  - Mức độ ưu tiên
  - Sales + Tư vấn phụ trách
  - Thông tin cuộc họp

**Màu sắc:**
- 🟦 Xanh: Thầu dẫn đầu
- 🟧 Cam: Thầu ưu tiên (giai đoạn ≥ 5)
- 🟩 Xanh lá: Thầu thắng

#### E. Hoạt Động Gần Đây
Timeline các thay đổi giai đoạn, ai làm gì, khi nào.

### Phân quyền
- **Admin:** Xem tất cả
- **Sales:** Chỉ xem deal mình phụ trách
- **Consultant:** Chỉ xem deal được assign

---

## 🏗️ MODULE 2: DỰ ÁN (CHI TIẾT)

### Trang Danh Sách

#### Header
- Tiêu đề + Nút "Thêm dự án" (Admin/Sales)

#### Bộ lọc
- Tìm kiếm: Theo tên hoặc mã
- Lọc trạng thái: Active / Won / Cancelled

#### Grid Cards
**Mỗi card hiển thị:**
1. **Thông tin cơ bản:** Mã, tên, trạng thái, mô tả
2. **Thống kê:** Số nhà thầu | Sales | Tư vấn
3. **Tài chính:** Giá trị ước tính, ngày dự kiến chốt
4. **Thông tin thầu:**
   - Nếu Won: Thầu thắng + ngày chốt
   - Nếu Active: Thầu dẫn đầu + giai đoạn + ưu tiên
   - Chưa có thầu: Thông báo
5. **Danh sách thầu khác** (tối đa 5)

### Trang Chi Tiết Dự Án

#### Thông tin dự án
- Tên, mã, trạng thái, giá trị
- Ngày bắt đầu, dự kiến chốt
- Mô tả, ghi chú sản phẩm

#### Danh sách Nhà Thầu
**Table với các cột:**
- Nhà thầu (Tên + Mã)
- Giai đoạn
- Ưu tiên
- Sales phụ trách
- Tư vấn
- Trạng thái
- Hành động (Xem/Sửa)

**Sắp xếp:** Won → Active (theo giai đoạn) → Lost

#### Lịch sử hoạt động
Timeline chi tiết mọi thay đổi.

### Form Tạo/Sửa Dự Án
- Tên dự án (*)
- Mô tả
- Giá trị ước tính (VNĐ)
- Ngày bắt đầu, ngày dự kiến chốt
- Ghi chú sản phẩm

### Phân quyền
- **Admin:** Full quyền
- **Sales:** Tạo dự án, sửa dự án mình tạo
- **Consultant:** Chỉ xem

---

## 👥 MODULE 3: NHÀ THẦU PHỤ (Đơn Giản)

### Chức năng
Quản lý danh sách nhà thầu phụ trong hệ thống.

### Hiển thị
**Table với các cột:**
- Mã nhà thầu
- Tên + Email
- Người liên hệ + SĐT
- Cấp độ quan hệ (A/B/C)
- Thống kê Leads: Won/Lost/Active
- Win Rate (%)
- Hành động: Sửa/Xóa

### Form
- Mã thầu (*), Tên (*)
- Người liên hệ, SĐT, Email
- Cấp độ quan hệ

**Key Point:** Giúp đánh giá được nhà thầu nào tiềm năng, win rate cao.

---

## 👨‍💼 MODULE 4: NHÂN SỰ (Đơn Giản)

### Chức năng
Quản lý nhân viên: Admin, Sales, Tư vấn phụ.

### Hiển thị
**Tab lọc:** Tất cả | Admin | Tư vấn phụ | Sales

**Table:**
- Avatar + Tên + Mã NV
- Email
- Vai trò (badge màu)
- Nhà thầu phụ (nếu là Sales)
- Điểm thưởng (nếu là Tư vấn)
- Hành động: Sửa/Xóa

### Form
- Họ tên (*), Email (*), Mật khẩu (*)
- SĐT
- Vai trò (*): Admin/Sales/Tư vấn
- Nhà thầu phụ (bắt buộc nếu là Sales)

**Key Point:** Phân quyền rõ ràng, mỗi Sales gắn với 1 nhà thầu.

---

## 🏆 MODULE 5: THƯỞNG (Đơn Giản)

### Chức năng
Bảng xếp hạng và điểm thưởng cho Tư vấn phụ.

### Hiển thị

#### Bảng xếp hạng
- **Top 3:** Huy chương 🥇🥈🥉, to hơn, nổi bật
- **Hạng 4+:** Danh sách thông thường
- Hiển thị: Tên, số deals thắng, điểm

#### Thống kê
- Tổng điểm đã phát
- Số deal thắng
- Số bonus

#### Lịch sử điểm
**Table:**
- Ngày
- Tư vấn
- Loại: Deal thắng / Bonus
- Mô tả
- Điểm (+/-)

### Tính năng đặc biệt
- Lọc theo năm
- Tư vấn xem điểm của mình (card nổi bật)

**Key Point:** Động viên, tạo động lực cho đội ngũ tư vấn.

---

## 🔔 MODULE 6: THÔNG BÁO (Đơn Giản)

### Chức năng
Thông báo realtime các sự kiện quan trọng.

### Hiển thị
**Tab:** Tất cả | Chưa đọc

**Danh sách thông báo:**
- Icon màu theo loại
- Tiêu đề + Nội dung
- Thời gian (relative: "2 giờ trước")
- Badge xanh nếu chưa đọc
- Background xanh nhạt nếu chưa đọc

### Loại thông báo
- 🔵 **Lead assigned:** Được assign thầu mới
- 🟡 **Stage changed:** Thầu chuyển giai đoạn
- � **Project won:** Deal thắng
- � **Reward added:** Được cộng điểm

### Tính năng
- Click vào thông báo → Đánh dấu đã đọc + Chuyển trang
- Nút "Đánh dấu tất cả đã đọc"

**Key Point:** Không bỏ sót thông tin quan trọng.

---

## 🔄 LỘ TRÌNH TRÌNH BÀY (25 PHÚT)

### **BƯỚC 1: Giới thiệu (2 phút)**
- Vấn đề khách hàng: Quản lý bằng Excel, mess loạn, bỏ sót
- Giải pháp: Hệ thống tập trung, tự động, phân quyền
- Lợi ích: Tiết kiệm thời gian, tăng tỷ lệ chốt deal

### **BƯỚC 2: Demo Dashboard (5 phút)**
1. Mở Dashboard
2. Chỉ 3 thẻ stats: "Nhìn 1 phát biết tình hình"
3. Chỉ Top nhà thầu: "Đây là đối tác chiến lược"
4. Chỉ Pie Chart: "Tỷ lệ thắng/thua rõ ràng"
5. **Focus:** Tình hình dự án
   - "Dự án này có 3 thầu, thầu ABC đang dẫn đầu, giai đoạn X, Sales Y phụ trách"
   - "Thầu này màu cam nghĩa là sắp chốt deal rồi, ưu tiên cao"
6. Hoạt động gần đây: "Ai làm gì, lúc nào, minh bạch"

**Key Message:** "1 màn hình = toàn bộ tình hình"

### **BƯỚC 3: Demo Module Dự Án (7 phút)**

#### 3.1. Danh sách (2 phút)
- Grid cards đẹp, rõ ràng
- Demo tìm kiếm, lọc
- Giải thích màu sắc phân biệt

#### 3.2. Tạo mới (1 phút)
- Click "Thêm dự án"
- Điền form
- Lưu → Xuất hiện trong danh sách

#### 3.3. Chi tiết (4 phút)
- Click vào dự án
- Xem thông tin đầy đủ
- Xem danh sách nhà thầu, sắp xếp thông minh
- "Thầu Won lên đầu, thầu dẫn đầu theo sau"
- Xem lịch sử: "Mọi thay đổi đều được ghi lại"

**Key Message:** "Mọi thông tin dự án tập trung 1 chỗ"

### **BƯỚC 4: Quét qua 4 Module còn lại (6 phút)**

#### Nhà thầu phụ (1.5 phút)
- Show table: "Quản lý toàn bộ nhà thầu"
- Chỉ Win Rate: "Nhà thầu nào hay thắng, dễ thấy"

#### Nhân sự (1.5 phút)
- Show danh sách: "Quản lý team"
- Chỉ phân quyền: "Admin/Sales/Tư vấn, mỗi người thấy khác nhau"

#### Thưởng (2 phút)
- Show bảng xếp hạng: "Top 3 to như này"
- Show điểm: "Tư vấn nào chăm, deal nhiều → Điểm cao"
- "Tạo động lực cho team"

#### Thông báo (1 phút)
- Show danh sách: "Mọi sự kiện quan trọng đều được thông báo"
- "Không bỏ sót, không quên"

**Key Message:** "Hệ thống toàn diện, không chỉ quản lý dự án"

### **BƯỚC 5: Phân quyền & Bảo mật (2 phút)**
- Demo đăng nhập bằng 3 tài khoản khác nhau
- Admin thấy tất cả
- Sales chỉ thấy deal mình phụ trách
- Tư vấn chỉ thấy deal được assign
- **Key Message:** "An toàn, bảo mật, mỗi người chỉ thấy data của mình"

### **BƯỚC 6: Lợi ích & ROI (3 phút)**

**Lợi ích cụ thể:**
- ⏰ Tiết kiệm 50% thời gian quản lý
- 📈 Tăng 20-30% tỷ lệ chốt deal (follow-up tốt hơn)
- ✅ Giảm 80% sai sót (tự động hóa)
- 👥 Dễ scale: Thêm người, thêm dự án vẫn gọn

**So sánh:**
| Trước (Excel) | Sau (Hệ thống) |
|---------------|----------------|
| Update thủ công | Tự động |
| Dễ bỏ sót | Thông báo realtime |
| Khó theo dõi | Dashboard trực quan |
| Không phân quyền | Bảo mật rõ ràng |

### **BƯỚC 7: Q&A & Chốt Deal (vài phút)**
- Trả lời câu hỏi
- Đưa gói giải pháp & bảng giá
- Chốt timeline: "Bắt đầu từ tuần sau được không?"
- Ký hợp đồng

---

## 📝 CHECKLIST TRƯỚC TRÌNH BÀY

### Dữ liệu
- [ ] ≥10 dự án (Active/Won/Cancelled)
- [ ] ≥20 nhà thầu
- [ ] 3 loại user: Admin/Sales/Tư vấn
- [ ] Lịch sử hoạt động đầy đủ

### Kỹ thuật
- [ ] Hệ thống chạy mượt
- [ ] Test nhiều trình duyệt
- [ ] Laptop dự phòng
- [ ] Internet ổn định

### Tài liệu
- [ ] In spec này cho khách
- [ ] Slide giới thiệu
- [ ] Bảng giá
- [ ] Hợp đồng mẫu

---

## 💡 TIPS CHỐT DEAL

### Pain Points
- "Anh có thấy Excel mất nhiều thời gian không?"
- "Có bao giờ quên follow-up và mất deal không?"

### Show, Don't Tell
- Đừng nói "tốt", hãy demo thực tế

### Tạo Urgency
- "Ưu đãi đến hết tháng"
- "Đối thủ đang dùng hệ thống tương tự"

### Xử lý từ chối
- "Giá cao" → Tính ROI, so sánh chi phí nhân sự
- "Cần suy nghĩ" → Trial 7-14 ngày
- "Đã có hệ thống" → So sánh tính năng

### Close
- "Anh muốn bắt đầu tuần sau hay đầu tháng?"
- "Em chuẩn bị hợp đồng nhé!"

---

## ✅ KẾT LUẬN

**Contractor Sales Tracker:**
- 6 modules toàn diện
- Dashboard trực quan
- Phân quyền rõ ràng
- Tự động hóa thông minh

**→ Giúp tăng tỷ lệ chốt deal, tiết kiệm thời gian, quản lý chuyên nghiệp!** 🚀

---

*Tài liệu hỗ trợ trình bày khách hàng - Version 1.0*
