// Seed Data - Demo data for the application
const SEED_DATA = {
    // Nhà thầu phụ
    subcontractors: [
        { id: 1, code: 'TP01', name: 'Công ty TNHH Xây dựng Minh Phát', contact_person: 'Nguyễn Văn An', phone: '0901234567', email: 'minhphat@example.com', relationship_level: 'normal', is_active: true, created_at: '2025-01-15T08:00:00Z' },
        { id: 2, code: 'TP02', name: 'Công ty CP Nội thất Hoàng Gia', contact_person: 'Trần Thị Bình', phone: '0912345678', email: 'hoanggia@example.com', relationship_level: 'partner', is_active: true, created_at: '2025-02-20T09:00:00Z' },
        { id: 3, code: 'TP03', name: 'Tập đoàn Xây dựng Thăng Long', contact_person: 'Lê Hoàng Cường', phone: '0923456789', email: 'thanglong@example.com', relationship_level: 'vip', is_active: true, created_at: '2024-06-10T10:00:00Z' },
        { id: 4, code: 'TP04', name: 'Công ty TNHH MTV Đức Thành', contact_person: 'Phạm Văn Dũng', phone: '0934567890', email: 'ducthanh@example.com', relationship_level: 'new', is_active: true, created_at: '2025-11-01T11:00:00Z' },
    ],

    // Người dùng
    users: [
        { id: 1, employee_code: 'NV001', name: 'Nguyễn Quản Trị', email: 'admin@company.com', password: '123456', phone: '0900000001', role: 'admin', subcontractor_id: null, supervisor_id: null, reward_points: 0, avatar: null, is_active: true, created_at: '2024-01-01T08:00:00Z' },
        { id: 2, employee_code: 'NV002', name: 'Trần Tư Vấn A', email: 'consultant1@company.com', password: '123456', phone: '0900000002', role: 'consultant', subcontractor_id: null, supervisor_id: 1, reward_points: 450, avatar: null, is_active: true, created_at: '2024-03-15T08:00:00Z' },
        { id: 3, employee_code: 'NV003', name: 'Lê Tư Vấn B', email: 'consultant2@company.com', password: '123456', phone: '0900000003', role: 'consultant', subcontractor_id: null, supervisor_id: 1, reward_points: 380, avatar: null, is_active: true, created_at: '2024-05-20T08:00:00Z' },
        { id: 4, employee_code: 'NV004', name: 'Phạm Tư Vấn C', email: 'consultant3@company.com', password: '123456', phone: '0900000004', role: 'consultant', subcontractor_id: null, supervisor_id: 1, reward_points: 320, avatar: null, is_active: true, created_at: '2024-07-10T08:00:00Z' },
        { id: 5, employee_code: 'NV005', name: 'Nguyễn Sales 1', email: 'sales1@company.com', password: '123456', phone: '0900000005', role: 'sales', subcontractor_id: 1, supervisor_id: null, reward_points: 0, avatar: null, is_active: true, created_at: '2025-01-20T08:00:00Z' },
        { id: 6, employee_code: 'NV006', name: 'Trần Sales 2', email: 'sales2@company.com', password: '123456', phone: '0900000006', role: 'sales', subcontractor_id: 2, supervisor_id: null, reward_points: 0, avatar: null, is_active: true, created_at: '2025-02-25T08:00:00Z' },
        { id: 7, employee_code: 'NV007', name: 'Lê Sales 3', email: 'sales3@company.com', password: '123456', phone: '0900000007', role: 'sales', subcontractor_id: 3, supervisor_id: null, reward_points: 0, avatar: null, is_active: true, created_at: '2024-06-15T08:00:00Z' },
        { id: 8, employee_code: 'NV008', name: 'Phạm Sales 4', email: 'sales4@company.com', password: '123456', phone: '0900000008', role: 'sales', subcontractor_id: 4, supervisor_id: null, reward_points: 0, avatar: null, is_active: true, created_at: '2025-11-05T08:00:00Z' },
    ],

    // Dự án
    projects: [
        { id: 1, code: 'DA-2026-001', name: 'Chung cư cao cấp Sunrise Tower', description: 'Dự án chung cư 30 tầng tại Quận 2', estimated_value: 850000000, product_notes: 'Cần 200 bộ cửa nhôm cao cấp, 150 bộ cửa kính cường lực. Liên hệ nhãn hàng Eurowindow.', start_date: '2026-01-05', expected_close_date: '2026-02-28', status: 'active', winner_lead_id: null, created_by: 1, created_at: '2026-01-05T08:00:00Z', updated_at: '2026-01-05T08:00:00Z' },
        { id: 2, code: 'DA-2026-002', name: 'Biệt thự Phú Mỹ Hưng', description: 'Khu biệt thự liền kề 15 căn', estimated_value: 1200000000, product_notes: 'Nội thất cao cấp, ưu tiên gỗ tự nhiên. Đã liên hệ nhà cung cấp ABC.', start_date: '2026-01-08', expected_close_date: '2026-03-15', status: 'active', winner_lead_id: null, created_by: 1, created_at: '2026-01-08T09:00:00Z', updated_at: '2026-01-08T09:00:00Z' },
        { id: 3, code: 'DA-2025-015', name: 'Trung tâm thương mại Galaxy', description: 'TTTM 5 tầng với diện tích 20,000m2', estimated_value: 2500000000, product_notes: 'Dự án đã hoàn thành. Thầu 3 thắng cuộc.', start_date: '2025-08-01', expected_close_date: '2025-12-31', status: 'won', winner_lead_id: 9, created_by: 1, created_at: '2025-08-01T08:00:00Z', updated_at: '2025-12-20T10:00:00Z' },
        { id: 4, code: 'DA-2026-003', name: 'Văn phòng TechPark Office', description: 'Tòa nhà văn phòng hạng A 25 tầng', estimated_value: 1800000000, product_notes: 'Cần hệ thống vách kính văn phòng, trần thả. Đang chờ báo giá.', start_date: '2026-01-10', expected_close_date: '2026-04-30', status: 'active', winner_lead_id: null, created_by: 1, created_at: '2026-01-10T08:00:00Z', updated_at: '2026-01-10T08:00:00Z' },
        { id: 5, code: 'DA-2026-004', name: 'Resort Cam Ranh Bay', description: 'Khu nghỉ dưỡng 5 sao 100 phòng', estimated_value: 3500000000, product_notes: 'Thiết kế phong cách nhiệt đới. Cần nội thất gỗ và mây tre.', start_date: '2026-01-12', expected_close_date: '2026-06-30', status: 'active', winner_lead_id: null, created_by: 1, created_at: '2026-01-12T08:00:00Z', updated_at: '2026-01-12T08:00:00Z' },
        { id: 6, code: 'DA-2025-020', name: 'Bệnh viện Đa khoa Quốc tế', description: 'Bệnh viện 500 giường', estimated_value: 5000000000, product_notes: 'Dự án bị hủy do thay đổi quy hoạch.', start_date: '2025-10-01', expected_close_date: '2026-03-31', status: 'cancelled', winner_lead_id: null, created_by: 1, created_at: '2025-10-01T08:00:00Z', updated_at: '2025-12-15T08:00:00Z' },
    ],

    // Leads
    leads: [
        // Dự án 1 - 4 thầu cạnh tranh
        { id: 1, project_id: 1, subcontractor_id: 1, sales_id: 5, assigned_consultant_id: 2, current_stage: 'initial_contact', relationship_score: 4, priority: 'medium', notes: 'Mới bắt đầu tiếp cận', meeting_info: 'Gặp Nhân viên lần 1', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-06T08:00:00Z', updated_at: '2026-01-06T08:00:00Z' },
        { id: 2, project_id: 1, subcontractor_id: 2, sales_id: 6, assigned_consultant_id: 3, current_stage: 'info_gathering', relationship_score: 5, priority: 'medium', notes: 'Đang thu thập thông tin yêu cầu', meeting_info: 'Gặp Quản lý lần 2', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-06T09:00:00Z', updated_at: '2026-01-07T10:00:00Z' },
        { id: 3, project_id: 1, subcontractor_id: 3, sales_id: 7, assigned_consultant_id: 2, current_stage: 'director_meeting', relationship_score: 9, priority: 'critical', notes: 'Đã gặp GĐ, khách hàng rất quan tâm. Chuẩn bị chốt deal.', meeting_info: 'Gặp Giám đốc lần 3, Gặp CDT lần 2', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-06T10:00:00Z', updated_at: '2026-01-09T08:00:00Z' },
        { id: 4, project_id: 1, subcontractor_id: 4, sales_id: 8, assigned_consultant_id: 4, current_stage: 'initial_contact', relationship_score: 2, priority: 'low', notes: 'Thầu mới, chưa có nhiều thông tin', meeting_info: '', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-06T11:00:00Z', updated_at: '2026-01-06T11:00:00Z' },

        // Dự án 2 - 3 thầu cạnh tranh
        { id: 5, project_id: 2, subcontractor_id: 1, sales_id: 5, assigned_consultant_id: 3, current_stage: 'proposal_sent', relationship_score: 6, priority: 'high', notes: 'Đã gửi báo giá, chờ phản hồi', meeting_info: 'Gặp Quản lý lần 3, Gặp CDT lần 1', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-09T08:00:00Z', updated_at: '2026-01-09T14:00:00Z' },
        { id: 6, project_id: 2, subcontractor_id: 2, sales_id: 6, assigned_consultant_id: 2, current_stage: 'negotiation', relationship_score: 7, priority: 'high', notes: 'Đang đàm phán giá, khách muốn giảm 5%', meeting_info: 'Gặp Giám đốc lần 2', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-09T09:00:00Z', updated_at: '2026-01-09T15:00:00Z' },
        { id: 7, project_id: 2, subcontractor_id: 3, sales_id: 7, assigned_consultant_id: 4, current_stage: 'info_gathering', relationship_score: 8, priority: 'medium', notes: 'Thầu 3 mới tham gia dự án này', meeting_info: 'Gặp Nhân viên lần 2', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-09T10:00:00Z', updated_at: '2026-01-09T10:00:00Z' },

        // Dự án 3 - Đã có winner
        { id: 8, project_id: 3, subcontractor_id: 1, sales_id: 5, assigned_consultant_id: 2, current_stage: 'proposal_sent', relationship_score: 5, priority: 'medium', notes: '', meeting_info: '', status: 'lost', won_at: null, lost_at: '2025-12-20T10:00:00Z', lost_reason: 'Dự án đã có nhà thầu khác thắng', created_at: '2025-08-05T08:00:00Z', updated_at: '2025-12-20T10:00:00Z' },
        { id: 9, project_id: 3, subcontractor_id: 3, sales_id: 7, assigned_consultant_id: 2, current_stage: 'contract_signing', relationship_score: 10, priority: 'critical', notes: 'Đã ký hợp đồng thành công!', meeting_info: 'Gặp Giám đốc lần 5, Gặp CDT lần 4', status: 'won', won_at: '2025-12-20T10:00:00Z', lost_at: null, lost_reason: null, created_at: '2025-08-05T09:00:00Z', updated_at: '2025-12-20T10:00:00Z' },
        { id: 10, project_id: 3, subcontractor_id: 4, sales_id: 8, assigned_consultant_id: 3, current_stage: 'initial_contact', relationship_score: 2, priority: 'low', notes: '', meeting_info: '', status: 'lost', won_at: null, lost_at: '2025-12-20T10:00:00Z', lost_reason: 'Dự án đã có nhà thầu khác thắng', created_at: '2025-08-06T08:00:00Z', updated_at: '2025-12-20T10:00:00Z' },

        // Dự án 4 - 2 thầu cạnh tranh
        { id: 11, project_id: 4, subcontractor_id: 2, sales_id: 6, assigned_consultant_id: 3, current_stage: 'proposal_sent', relationship_score: 6, priority: 'medium', notes: 'Đang chờ khách phản hồi báo giá', meeting_info: 'Gặp Quản lý lần 2', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-11T08:00:00Z', updated_at: '2026-01-11T08:00:00Z' },
        { id: 12, project_id: 4, subcontractor_id: 3, sales_id: 7, assigned_consultant_id: 2, current_stage: 'negotiation', relationship_score: 8, priority: 'high', notes: 'Khách quan tâm cao, đang thương lượng', meeting_info: 'Gặp Giám đốc lần 1, Gặp CDT lần 3', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-11T09:00:00Z', updated_at: '2026-01-12T10:00:00Z' },

        // Dự án 5 - 3 thầu cạnh tranh
        { id: 13, project_id: 5, subcontractor_id: 1, sales_id: 5, assigned_consultant_id: 4, current_stage: 'initial_contact', relationship_score: 3, priority: 'low', notes: 'Mới bắt đầu', meeting_info: 'Gặp Nhân viên lần 1', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-13T08:00:00Z', updated_at: '2026-01-13T08:00:00Z' },
        { id: 14, project_id: 5, subcontractor_id: 2, sales_id: 6, assigned_consultant_id: 2, current_stage: 'info_gathering', relationship_score: 5, priority: 'medium', notes: 'Đang tìm hiểu yêu cầu', meeting_info: 'Gặp Quản lý lần 1', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-13T09:00:00Z', updated_at: '2026-01-14T10:00:00Z' },
        { id: 15, project_id: 5, subcontractor_id: 4, sales_id: 8, assigned_consultant_id: 3, current_stage: 'initial_contact', relationship_score: 2, priority: 'low', notes: '', meeting_info: '', status: 'active', won_at: null, lost_at: null, lost_reason: null, created_at: '2026-01-13T10:00:00Z', updated_at: '2026-01-13T10:00:00Z' },
    ],

    // Lịch sử thay đổi stage
    lead_stage_history: [
        { id: 1, lead_id: 3, from_stage: 'initial_contact', to_stage: 'info_gathering', changed_by: 7, notes: 'Bắt đầu thu thập thông tin', changed_at: '2026-01-07T08:00:00Z' },
        { id: 2, lead_id: 3, from_stage: 'info_gathering', to_stage: 'proposal_sent', changed_by: 7, notes: 'Đã gửi báo giá', changed_at: '2026-01-07T14:00:00Z' },
        { id: 3, lead_id: 3, from_stage: 'proposal_sent', to_stage: 'negotiation', changed_by: 2, notes: 'Khách đồng ý đàm phán', changed_at: '2026-01-08T09:00:00Z' },
        { id: 4, lead_id: 3, from_stage: 'negotiation', to_stage: 'director_meeting', changed_by: 7, notes: 'Đã hẹn gặp GĐ ngày 09/01', changed_at: '2026-01-09T08:00:00Z' },
        { id: 5, lead_id: 6, from_stage: 'proposal_sent', to_stage: 'negotiation', changed_by: 6, notes: 'Khách muốn đàm phán giá', changed_at: '2026-01-09T15:00:00Z' },
    ],

    // Điểm thưởng
    reward_transactions: [
        { id: 1, user_id: 2, lead_id: 9, project_id: 3, type: 'deal_won', points: 100, description: 'Deal thắng: TTTM Galaxy - Thầu 3', approved_by: 1, created_at: '2025-12-20T10:30:00Z' },
        { id: 2, user_id: 2, lead_id: 9, project_id: 3, type: 'bonus', points: 50, description: 'Deal giá trị lớn (>2 tỷ)', approved_by: 1, created_at: '2025-12-20T10:30:00Z' },
        { id: 3, user_id: 2, lead_id: 9, project_id: 3, type: 'bonus', points: 30, description: 'Thầu VIP', approved_by: 1, created_at: '2025-12-20T10:30:00Z' },
        { id: 4, user_id: 3, lead_id: null, project_id: null, type: 'bonus', points: 80, description: 'Thưởng quý 4/2025', approved_by: 1, created_at: '2025-12-31T10:00:00Z' },
        { id: 5, user_id: 4, lead_id: null, project_id: null, type: 'bonus', points: 70, description: 'Thưởng quý 4/2025', approved_by: 1, created_at: '2025-12-31T10:00:00Z' },
        { id: 6, user_id: 2, lead_id: null, project_id: null, type: 'bonus', points: 170, description: 'Thưởng năm 2025 - Top 1', approved_by: 1, created_at: '2026-01-02T10:00:00Z' },
        { id: 7, user_id: 3, lead_id: null, project_id: null, type: 'bonus', points: 150, description: 'Thưởng năm 2025 - Top 2', approved_by: 1, created_at: '2026-01-02T10:00:00Z' },
        { id: 8, user_id: 4, lead_id: null, project_id: null, type: 'bonus', points: 130, description: 'Thưởng năm 2025 - Top 3', approved_by: 1, created_at: '2026-01-02T10:00:00Z' },
    ],

    // Thông báo
    notifications: [
        { id: 1, user_id: 2, type: 'lead_assigned', title: 'Lead mới được giao', message: 'Bạn được giao Lead Thầu 3 cho dự án Sunrise Tower', data: { lead_id: 3, project_id: 1 }, read_at: '2026-01-06T10:30:00Z', created_at: '2026-01-06T10:00:00Z' },
        { id: 2, user_id: 1, type: 'stage_changed', title: 'Lead cập nhật tiến độ', message: 'Lead Thầu 3 - Sunrise Tower chuyển sang Director Meeting', data: { lead_id: 3, project_id: 1 }, read_at: null, created_at: '2026-01-09T08:00:00Z' },
        { id: 3, user_id: 2, type: 'stage_changed', title: 'Lead cập nhật tiến độ', message: 'Lead Thầu 3 - Sunrise Tower chuyển sang Director Meeting', data: { lead_id: 3, project_id: 1 }, read_at: null, created_at: '2026-01-09T08:00:00Z' },
        { id: 4, user_id: 3, type: 'lead_assigned', title: 'Lead mới được giao', message: 'Bạn được giao Lead Thầu 2 cho dự án Sunrise Tower', data: { lead_id: 2, project_id: 1 }, read_at: null, created_at: '2026-01-06T09:00:00Z' },
        { id: 5, user_id: 7, type: 'reward_added', title: 'Điểm thưởng mới', message: 'Bạn nhận được 100 điểm cho deal TTTM Galaxy', data: { reward_id: 1 }, read_at: null, created_at: '2025-12-20T10:30:00Z' },
    ],
};

// Database version - increment this to force reset
const DB_VERSION = '2.0'; // Updated: Added meeting_info field

// Initialize database with seed data
function initializeDatabase() {
    const currentVersion = localStorage.getItem('db_version');

    // Force reset if version mismatch or not initialized
    if (currentVersion !== DB_VERSION) {
        console.log(`Database version mismatch (${currentVersion} -> ${DB_VERSION}). Resetting...`);
        localStorage.clear();
    }

    if (!localStorage.getItem('db_initialized')) {
        localStorage.setItem('subcontractors', JSON.stringify(SEED_DATA.subcontractors));
        localStorage.setItem('users', JSON.stringify(SEED_DATA.users));
        localStorage.setItem('projects', JSON.stringify(SEED_DATA.projects));
        localStorage.setItem('leads', JSON.stringify(SEED_DATA.leads));
        localStorage.setItem('lead_stage_history', JSON.stringify(SEED_DATA.lead_stage_history));
        localStorage.setItem('reward_transactions', JSON.stringify(SEED_DATA.reward_transactions));
        localStorage.setItem('notifications', JSON.stringify(SEED_DATA.notifications));
        localStorage.setItem('db_initialized', 'true');
        localStorage.setItem('db_version', DB_VERSION);
        console.log('Database initialized with seed data v' + DB_VERSION);
    }
}

// Reset database to seed data
function resetDatabase() {
    localStorage.clear();
    initializeDatabase();
    console.log('Database reset to seed data');
}
