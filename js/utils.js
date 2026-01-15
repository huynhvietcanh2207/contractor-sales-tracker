// Utils - Helper functions
const Utils = {
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Generate incremental ID
    generateIncrementalId(items) {
        if (!items || items.length === 0) return 1;
        return Math.max(...items.map(item => item.id)) + 1;
    },

    // Format date
    formatDate(dateString, format = 'dd/mm/yyyy') {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        switch (format) {
            case 'dd/mm/yyyy':
                return `${day}/${month}/${year}`;
            case 'dd/mm/yyyy hh:mm':
                return `${day}/${month}/${year} ${hours}:${minutes}`;
            case 'relative':
                return this.getRelativeTime(date);
            default:
                return `${day}/${month}/${year}`;
        }
    },

    // Get relative time (e.g., "2 hours ago")
    getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) return this.formatDate(date);
        if (days > 0) return `${days} ngày trước`;
        if (hours > 0) return `${hours} giờ trước`;
        if (minutes > 0) return `${minutes} phút trước`;
        return 'Vừa xong';
    },

    // Format currency
    formatCurrency(amount, currency = 'VND') {
        if (!amount) return '0';
        if (currency === 'VND') {
            return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
        }
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    },

    // Format number with commas
    formatNumber(num) {
        if (!num) return '0';
        return new Intl.NumberFormat('vi-VN').format(num);
    },

    // Format currency in compact form (e.g., "1.2 tỷ", "850 tr")
    formatCompactCurrency(amount) {
        if (!amount) return '0 ₫';
        if (amount >= 1000000000) {
            return (amount / 1000000000).toFixed(1).replace('.0', '') + ' tỷ';
        }
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(0) + ' tr';
        }
        return this.formatNumber(amount) + ' ₫';
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Get initials from name
    getInitials(name) {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },

    // Get avatar color based on name
    getAvatarColor(name) {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
        ];
        if (!name) return colors[0];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    },

    // Escape HTML
    escapeHtml(text) {
        if (!text) return '';
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    // Truncate text
    truncate(text, length = 50) {
        if (!text || text.length <= length) return text;
        return text.slice(0, length) + '...';
    },

    // Deep clone object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Check if object is empty
    isEmpty(obj) {
        return !obj || Object.keys(obj).length === 0;
    },

    // Parse query string
    parseQueryString(queryString) {
        const params = {};
        if (!queryString) return params;
        const searchParams = new URLSearchParams(queryString);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    },

    // Build query string
    buildQueryString(params) {
        return Object.entries(params)
            .filter(([, v]) => v !== null && v !== undefined && v !== '')
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');
    }
};

// Stage helpers
const StageHelper = {
    stages: [
        { code: 'initial_contact', name: 'Liên hệ ban đầu', order: 1 },
        { code: 'info_gathering', name: 'Thu thập thông tin', order: 2 },
        { code: 'proposal_sent', name: 'Gửi báo giá', order: 3 },
        { code: 'negotiation', name: 'Đàm phán', order: 4 },
        { code: 'director_meeting', name: 'Gặp giám đốc', order: 5 },
        { code: 'contract_signing', name: 'Ký hợp đồng', order: 6 },
    ],

    getStageName(code) {
        const stage = this.stages.find(s => s.code === code);
        return stage ? stage.name : code;
    },

    getStageOrder(code) {
        const stage = this.stages.find(s => s.code === code);
        return stage ? stage.order : 0;
    },

    getStageColor(code) {
        const order = this.getStageOrder(code);
        if (order <= 2) return 'bg-blue-100 text-blue-700';
        if (order <= 4) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    },

    getNextStage(currentCode) {
        const currentOrder = this.getStageOrder(currentCode);
        const nextStage = this.stages.find(s => s.order === currentOrder + 1);
        return nextStage ? nextStage.code : null;
    },

    addCustomStage(stage) {
        // Kiểm tra xem stage đã tồn tại chưa
        if (this.stages.find(s => s.code === stage.code)) {
            return;
        }

        // Thêm stage mới
        this.stages.push(stage);

        // Lưu vào localStorage
        const customStages = JSON.parse(localStorage.getItem('custom_stages') || '[]');
        customStages.push(stage);
        localStorage.setItem('custom_stages', JSON.stringify(customStages));
    },

    loadCustomStages() {
        const customStages = JSON.parse(localStorage.getItem('custom_stages') || '[]');
        customStages.forEach(stage => {
            if (!this.stages.find(s => s.code === stage.code)) {
                this.stages.push(stage);
            }
        });
        // Sắp xếp lại theo order
        this.stages.sort((a, b) => a.order - b.order);
    }
};

// Priority helpers
const PriorityHelper = {
    priorities: [
        { code: 'low', name: 'Thấp', color: 'badge-gray', icon: '🟢' },
        { code: 'medium', name: 'Trung bình', color: 'badge-warning', icon: '🟡' },
        { code: 'high', name: 'Cao', color: 'badge-primary', icon: '🟠' },
        { code: 'critical', name: 'Rất cao', color: 'badge-danger', icon: '🔴' },
    ],

    getPriorityName(code) {
        const priority = this.priorities.find(p => p.code === code);
        return priority ? priority.name : code;
    },

    getPriorityColor(code) {
        const priority = this.priorities.find(p => p.code === code);
        return priority ? priority.color : 'badge-gray';
    },

    getPriorityIcon(code) {
        const priority = this.priorities.find(p => p.code === code);
        return priority ? priority.icon : '⚪';
    }
};

// Status helpers
const StatusHelper = {
    projectStatuses: [
        { code: 'active', name: 'Đang hoạt động', color: 'badge-success', icon: '🟢' },
        { code: 'won', name: 'Đã chốt', color: 'badge-gold', icon: '🏆' },
        { code: 'cancelled', name: 'Đã hủy', color: 'badge-danger', icon: '🔴' },
        { code: 'paused', name: 'Tạm dừng', color: 'badge-gray', icon: '⏸️' },
    ],

    leadStatuses: [
        { code: 'active', name: 'Đang cạnh tranh', color: 'badge-primary', icon: '🔵' },
        { code: 'won', name: 'Thắng cuộc', color: 'badge-gold', icon: '🏆' },
        { code: 'lost', name: 'Thua cuộc', color: 'badge-gray', icon: '❌' },
    ],

    relationshipLevels: [
        { code: 'new', name: 'Mới', color: 'badge-gray' },
        { code: 'normal', name: 'Thường', color: 'badge-primary' },
        { code: 'partner', name: 'Đối tác', color: 'badge-purple' },
        { code: 'vip', name: 'VIP', color: 'badge-gold' },
    ],

    getProjectStatusName(code) {
        const status = this.projectStatuses.find(s => s.code === code);
        return status ? status.name : code;
    },

    getProjectStatusColor(code) {
        const status = this.projectStatuses.find(s => s.code === code);
        return status ? status.color : 'badge-gray';
    },

    getLeadStatusName(code) {
        const status = this.leadStatuses.find(s => s.code === code);
        return status ? status.name : code;
    },

    getLeadStatusIcon(code) {
        const status = this.leadStatuses.find(s => s.code === code);
        return status ? status.icon : '';
    },

    getRelationshipLevelName(code) {
        const level = this.relationshipLevels.find(l => l.code === code);
        return level ? level.name : code;
    },

    getRelationshipLevelColor(code) {
        const level = this.relationshipLevels.find(l => l.code === code);
        return level ? level.color : 'badge-gray';
    }
};

// Permissions
const Permissions = {
    canViewAllProjects(user) {
        return ['admin'].includes(user?.role);
    },

    canViewAllLeads(user) {
        return ['admin'].includes(user?.role);
    },

    canCreateProject(user) {
        return ['admin'].includes(user?.role);
    },

    canEditProject(user) {
        return ['admin'].includes(user?.role);
    },

    canDeleteProject(user) {
        return ['admin'].includes(user?.role);
    },

    canSelectWinner(user) {
        return ['admin'].includes(user?.role);
    },

    canManageEmployees(user) {
        return ['admin'].includes(user?.role);
    },

    canManageSubcontractors(user) {
        return ['admin'].includes(user?.role);
    },

    canViewRewards(user) {
        return ['admin', 'consultant'].includes(user?.role);
    },

    canAssignConsultant(user) {
        return ['admin'].includes(user?.role);
    },

    canUpdateLeadStage(user, lead) {
        if (['admin'].includes(user?.role)) return true;
        if (user?.role === 'consultant' && lead?.assigned_consultant_id === user?.id) return true;
        if (user?.role === 'sales' && lead?.sales_id === user?.id) return true;
        return false;
    },

    // Filter projects based on user role
    filterProjectsForUser(projects, leads, user) {
        if (!user) return [];
        if (user.role === 'admin') return projects;

        if (user.role === 'consultant') {
            const assignedLeadProjectIds = leads
                .filter(l => l.assigned_consultant_id === user.id)
                .map(l => l.project_id);
            return projects.filter(p => assignedLeadProjectIds.includes(p.id));
        }

        if (user.role === 'sales') {
            const salesLeadProjectIds = leads
                .filter(l => l.sales_id === user.id)
                .map(l => l.project_id);
            return projects.filter(p => salesLeadProjectIds.includes(p.id));
        }

        return [];
    },

    // Filter leads based on user role
    filterLeadsForUser(leads, user) {
        if (!user) return [];
        if (user.role === 'admin') return leads;

        if (user.role === 'consultant') {
            return leads.filter(l => l.assigned_consultant_id === user.id);
        }

        if (user.role === 'sales') {
            return leads.filter(l => l.sales_id === user.id);
        }

        return [];
    }
};
