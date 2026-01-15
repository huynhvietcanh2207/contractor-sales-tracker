# 📋 REPORTS MODULE - TASK LIST CHI TIẾT

## 📌 THÔNG TIN CHUNG

**Dự án:** Contractor Sales Tracker  
**Module mới:** Sales Report + Consultant Report  
**Thời gian ước tính:** 15-20 giờ  
**Tạo ngày:** 2026-01-15  
**Cập nhật:** 2026-01-15 (v1.1 - Đã hoàn thành Phase 1-5)

---

## 🎯 TASK LIST THEO THỨ TỰ THỰC HIỆN

---

### 📦 PHASE 1: CHUẨN BỊ DATA MODEL ✅ HOÀN THÀNH

| # | Task | Mô tả | File | Trạng thái |
|---|------|-------|------|------------|
| 1.1 | Cập nhật seed data | Thêm `product_info` object thay vì `product_notes` string | `data/seed.js` | ✅ |
| 1.2 | Migration function | Tạo hàm migrate dữ liệu cũ sang format mới | `data/seed.js` | ✅ |
| 1.3 | Tăng DB_VERSION | Trigger reset database với data mới | `data/seed.js` | ✅ |
| 1.4 | Cập nhật API helpers | Thêm `formatCompactCurrency()` function | `js/utils.js` | ✅ |

---

### 📊 PHASE 2: MODULE SALES REPORT ✅ HOÀN THÀNH

#### 2.1 Tạo cấu trúc trang

| # | Task | Mô tả | File | Trạng thái |
|---|------|-------|------|------------|
| 2.1.1 | Tạo file page | Tạo file JavaScript cho trang báo cáo sales | `js/pages/report-sales.js` | ⬜ |
| 2.1.2 | Thêm route | Đăng ký route `/report-sales` | `js/router.js` | ⬜ |
| 2.1.3 | Thêm menu | Thêm item menu "Báo cáo Sales" vào sidebar | `js/components/sidebar.js` | ⬜ |
| 2.1.4 | Phân quyền menu | Ẩn/hiện menu theo role (Admin + Sales) | `js/components/sidebar.js` | ⬜ |

#### 2.2 Stats Cards

| # | Task | Mô tả | Chi tiết | Trạng thái |
|---|------|-------|----------|------------|
| 2.2.1 | Card: Tổng nhà thầu | Đếm số subcontractor có lead thuộc sales này | Count unique `subcontractor_id` from leads where `sales_id = current_user` | ⬜ |
| 2.2.2 | Card: Nhà thầu mới | Số nhà thầu có first contact trong tháng | Filter leads created this month, count unique new subcontractors | ⬜ |
| 2.2.3 | Card: Tổng dự án | Số dự án có ít nhất 1 lead của sales này | Count unique `project_id` from leads | ⬜ |
| 2.2.4 | Card styling | Animation số chạy, icon, màu sắc gradient | CSS + JS animation | ⬜ |

#### 2.3 Biểu đồ riêng Sales

| # | Task | Mô tả | Chi tiết | Trạng thái |
|---|------|-------|----------|------------|
| 2.3.1 | Chart: Dự án/tháng | Bar chart số dự án tham gia theo tháng | Group leads by month, count unique projects | ⬜ |
| 2.3.2 | Year filter | Dropdown chọn năm cho chart | Default = current year | ⬜ |
| 2.3.3 | Chart: Nhà thầu mới/tháng | Bar chart số nhà thầu mới gặp theo tháng | First contact với mỗi subcontractor | ⬜ |
| 2.3.4 | Chart responsive | Responsive design cho mobile | CSS media queries | ⬜ |

#### 2.4 Logic phân quyền Sales

| # | Task | Mô tả | Chi tiết | Trạng thái |
|---|------|-------|----------|------------|
| 2.4.1 | Check role | Chỉ Admin hoặc Sales được vào | Redirect về dashboard nếu Consultant | ⬜ |
| 2.4.2 | Filter data | Sales chỉ thấy data của mình | `WHERE sales_id = current_user.id` | ⬜ |
| 2.4.3 | Admin dropdown | Admin có dropdown chọn Sales | Select all sales + option "Tất cả" | ⬜ |
| 2.4.4 | Aggregate view | Admin view tổng hợp khi chọn "Tất cả" | Sum/aggregate all sales data | ⬜ |

---

### 📊 PHASE 3: MODULE CONSULTANT REPORT

#### 3.1 Tạo cấu trúc trang

| # | Task | Mô tả | File | Trạng thái |
|---|------|-------|------|------------|
| 3.1.1 | Tạo file page | Tạo file JavaScript cho trang báo cáo tư vấn | `js/pages/report-consultant.js` | ⬜ |
| 3.1.2 | Thêm route | Đăng ký route `/report-consultant` | `js/router.js` | ⬜ |
| 3.1.3 | Thêm menu | Thêm item menu "Báo cáo Tư vấn" vào sidebar | `js/components/sidebar.js` | ⬜ |
| 3.1.4 | Phân quyền menu | Ẩn/hiện menu theo role (Admin + Consultant) | `js/components/sidebar.js` | ⬜ |

#### 3.2 Stats Cards

| # | Task | Mô tả | Chi tiết | Trạng thái |
|---|------|-------|----------|------------|
| 3.2.1 | Card: Tổng dự án | Số dự án được assign làm tư vấn | Count unique `project_id` from leads where `assigned_consultant_id = current_user` | ⬜ |
| 3.2.2 | Card: Tổng sản phẩm | Tổng `product_info.quantity` từ các dự án | Sum up quantities | ⬜ |
| 3.2.3 | Card: Tổng tiền báo | Tổng `product_info.quoted_amount` | Format VNĐ (triệu/tỷ) | ⬜ |
| 3.2.4 | Card styling | Animation số chạy, icon, màu sắc gradient | CSS + JS animation | ⬜ |

#### 3.3 Biểu đồ riêng Consultant

| # | Task | Mô tả | Chi tiết | Trạng thái |
|---|------|-------|----------|------------|
| 3.3.1 | Chart: Dự án/tháng | Bar chart số dự án theo tháng | Group by month of lead creation | ⬜ |
| 3.3.2 | Chart: Sản phẩm/dự án | Horizontal bar chart số lượng SP | Top 10 dự án theo quantity | ⬜ |
| 3.3.3 | Chart: Tiền báo/dự án | Horizontal bar chart số tiền | Top 10 dự án theo quoted_amount | ⬜ |
| 3.3.4 | Chart responsive | Responsive design | CSS media queries | ⬜ |

#### 3.4 Logic phân quyền Consultant

| # | Task | Mô tả | Chi tiết | Trạng thái |
|---|------|-------|----------|------------|
| 3.4.1 | Check role | Chỉ Admin hoặc Consultant được vào | Redirect về dashboard nếu Sales | ⬜ |
| 3.4.2 | Filter data | Consultant chỉ thấy data của mình | `WHERE assigned_consultant_id = current_user.id` | ⬜ |
| 3.4.3 | Admin dropdown | Admin có dropdown chọn Consultant | Select all consultants + "Tất cả" | ⬜ |
| 3.4.4 | Aggregate view | Admin view tổng hợp | Sum/aggregate all consultant data | ⬜ |

---

### 📊 PHASE 4: BIỂU ĐỒ CHUNG

#### 4.1 Pie/Donut Chart - Tình trạng dự án

| # | Task | Mô tả | Chi tiết | Trạng thái |
|---|------|-------|----------|------------|
| 4.1.1 | Create chart component | Tạo reusable donut chart component | Pure CSS/SVG hoặc Canvas | ⬜ |
| 4.1.2 | Integrate to Sales | Thêm chart vào trang Sales Report | Count projects by status | ⬜ |
| 4.1.3 | Integrate to Consultant | Thêm chart vào trang Consultant Report | Same logic | ⬜ |
| 4.1.4 | Animation & tooltips | Hover effect, animation on load | CSS transitions + JS | ⬜ |

#### 4.2 Combo Chart (Bar + Line) - Trend

| # | Task | Mô tả | Chi tiết | Trạng thái |
|---|------|-------|----------|------------|
| 4.2.1 | Check condition | Hàm kiểm tra có ≥3 tháng data không | Return boolean | ⬜ |
| 4.2.2 | Create combo chart | Implement bar + line chart | Có thể dùng Chart.js CDN | ⬜ |
| 4.2.3 | Bar: Projects/month | Thanh cột = số dự án mới | Left Y-axis | ⬜ |
| 4.2.4 | Line: Win rate | Đường = tỷ lệ thắng % | Right Y-axis | ⬜ |
| 4.2.5 | Conditional render | Chỉ hiển thị khi ≥3 tháng | if/else check | ⬜ |

---

### 🔧 PHASE 5: CẬP NHẬT FORM DỰ ÁN

| # | Task | Mô tả | File | Trạng thái |
|---|------|-------|------|------------|
| 5.1 | Thêm input Số lượng SP | Input number cho `product_info.quantity` | `js/pages/projects.js` hoặc `project-detail.js` | ⬜ |
| 5.2 | Thêm input Đơn vị | Input text cho `product_info.unit` | Same | ⬜ |
| 5.3 | Thêm input Số tiền báo giá | Input number cho `product_info.quoted_amount` | Same | ⬜ |
| 5.4 | Textarea Ghi chú | Giữ textarea cho `product_info.notes` | Same | ⬜ |
| 5.5 | Validation | Required fields, number format | JS validation | ⬜ |
| 5.6 | Save logic | Update save function để lưu object | API update | ⬜ |

---

### 🎨 PHASE 6: CSS & STYLING

| # | Task | Mô tả | File | Trạng thái |
|---|------|-------|------|------------|
| 6.1 | Stats cards CSS | Gradient backgrounds, shadows, icons | `css/style.css` | ⬜ |
| 6.2 | Chart containers | Responsive grid layout | Same | ⬜ |
| 6.3 | Bar chart CSS | Custom bar chart styling | Same | ⬜ |
| 6.4 | Donut chart CSS | SVG/CSS donut styling | Same | ⬜ |
| 6.5 | Animations | Micro-animations, hover effects | Same | ⬜ |
| 6.6 | Dark mode | Support dark theme nếu có | Same | ⬜ |
| 6.7 | Mobile responsive | Media queries cho mobile | Same | ⬜ |

---

### ✅ PHASE 7: TESTING & POLISH

| # | Task | Mô tả | Chi tiết | Trạng thái |
|---|------|-------|----------|------------|
| 7.1 | Test Admin role | Login Admin, test xem tất cả | Check dropdown, all data | ⬜ |
| 7.2 | Test Sales role | Login Sales, test chỉ thấy của mình | Verify filter logic | ⬜ |
| 7.3 | Test Consultant role | Login Consultant, test chỉ thấy của mình | Verify filter logic | ⬜ |
| 7.4 | Test empty data | Test khi không có data | Edge cases | ⬜ |
| 7.5 | Test < 3 months | Test combo chart không hiển thị | Conditional render | ⬜ |
| 7.6 | Test ≥ 3 months | Test combo chart hiển thị | Add fake data if needed | ⬜ |
| 7.7 | Mobile test | Test trên mobile screen | Responsive check | ⬜ |
| 7.8 | Browser test | Test Chrome, Firefox, Safari | Cross-browser | ⬜ |

---

## 📝 GHI CHÚ KỸ THUẬT

### Data Queries cần implement

```javascript
// 1. Lấy leads của 1 Sales
function getSalesLeads(salesId) {
    return leads.filter(l => l.sales_id === salesId);
}

// 2. Lấy leads của 1 Consultant
function getConsultantLeads(consultantId) {
    return leads.filter(l => l.assigned_consultant_id === consultantId);
}

// 3. Đếm unique projects
function getUniqueProjects(leads) {
    return [...new Set(leads.map(l => l.project_id))];
}

// 4. Group by month
function groupByMonth(leads) {
    return leads.reduce((acc, lead) => {
        const month = lead.created_at.substring(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});
}

// 5. Tính win rate
function calculateWinRate(leads) {
    const won = leads.filter(l => l.status === 'won').length;
    return (won / leads.length * 100).toFixed(1);
}
```

### Menu structure cập nhật

```javascript
// Trong sidebar.js - thêm vào navigation items
{
    icon: 'chart-bar',
    label: 'Báo cáo',
    children: [
        { 
            path: '/report-sales', 
            label: 'Báo cáo Sales',
            roles: ['admin', 'sales'] 
        },
        { 
            path: '/report-consultant', 
            label: 'Báo cáo Tư vấn',
            roles: ['admin', 'consultant'] 
        }
    ]
}
```

---

## 📊 TIẾN ĐỘ DỰ KIẾN

| Phase | Thời gian ước tính | Độ ưu tiên |
|-------|-------------------|------------|
| Phase 1: Data Model | 2-3 giờ | 🔴 Cao |
| Phase 2: Sales Report | 4-5 giờ | 🔴 Cao |
| Phase 3: Consultant Report | 4-5 giờ | 🔴 Cao |
| Phase 4: Biểu đồ chung | 3-4 giờ | 🟡 Trung bình |
| Phase 5: Cập nhật form | 2 giờ | 🟡 Trung bình |
| Phase 6: CSS & Styling | 2 giờ | 🟢 Thấp |
| Phase 7: Testing | 2 giờ | 🔴 Cao |

**Tổng cộng:** ~15-20 giờ làm việc

---

## ✅ CHECKLIST CUỐI CÙNG

- [ ] Tất cả các tasks trong Phase 1-7 đã hoàn thành
- [ ] 3 roles (Admin/Sales/Consultant) hoạt động đúng
- [ ] Charts hiển thị đúng với dữ liệu
- [ ] Responsive trên mobile
- [ ] Không có lỗi console JavaScript
- [ ] Documentation đã cập nhật

---

*Cập nhật lần cuối: 2026-01-15*
