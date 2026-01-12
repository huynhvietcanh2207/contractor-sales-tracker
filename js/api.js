// API - LocalStorage database operations
const API = {
    // Generic CRUD operations
    getAll(collection) {
        const data = localStorage.getItem(collection);
        return data ? JSON.parse(data) : [];
    },

    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id === parseInt(id) || item.id === id);
    },

    create(collection, data) {
        const items = this.getAll(collection);
        const newItem = {
            ...data,
            id: Utils.generateIncrementalId(items),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        items.push(newItem);
        localStorage.setItem(collection, JSON.stringify(items));
        return newItem;
    },

    update(collection, id, data) {
        const items = this.getAll(collection);
        const index = items.findIndex(item => item.id === parseInt(id) || item.id === id);
        if (index === -1) return null;
        items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
        localStorage.setItem(collection, JSON.stringify(items));
        return items[index];
    },

    delete(collection, id) {
        const items = this.getAll(collection);
        const filtered = items.filter(item => item.id !== parseInt(id) && item.id !== id);
        localStorage.setItem(collection, JSON.stringify(filtered));
        return true;
    },

    // Subcontractors
    getSubcontractors() {
        return this.getAll('subcontractors').filter(s => s.is_active);
    },

    getSubcontractor(id) {
        return this.getById('subcontractors', id);
    },

    createSubcontractor(data) {
        return this.create('subcontractors', { ...data, is_active: true });
    },

    updateSubcontractor(id, data) {
        return this.update('subcontractors', id, data);
    },

    deleteSubcontractor(id) {
        return this.update('subcontractors', id, { is_active: false });
    },

    getSubcontractorStats(id) {
        const leads = this.getAll('leads').filter(l => l.subcontractor_id === parseInt(id));
        return {
            total_leads: leads.length,
            won: leads.filter(l => l.status === 'won').length,
            lost: leads.filter(l => l.status === 'lost').length,
            active: leads.filter(l => l.status === 'active').length,
            win_rate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'won').length / leads.filter(l => l.status !== 'active').length) * 100) || 0 : 0
        };
    },

    // Users
    getUsers() {
        return this.getAll('users').filter(u => u.is_active);
    },

    getUser(id) {
        return this.getById('users', id);
    },

    getUserByEmail(email) {
        const users = this.getAll('users');
        return users.find(u => u.email === email);
    },

    createUser(data) {
        return this.create('users', { ...data, is_active: true, reward_points: 0 });
    },

    updateUser(id, data) {
        return this.update('users', id, data);
    },

    deleteUser(id) {
        return this.update('users', id, { is_active: false });
    },

    getUsersByRole(role) {
        return this.getUsers().filter(u => u.role === role);
    },

    getConsultants() {
        return this.getUsersByRole('consultant');
    },

    getSales() {
        return this.getUsersByRole('sales');
    },

    // Projects
    getProjects(filters = {}) {
        let projects = this.getAll('projects');

        if (filters.status) {
            projects = projects.filter(p => p.status === filters.status);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            projects = projects.filter(p =>
                p.name.toLowerCase().includes(search) ||
                p.code.toLowerCase().includes(search)
            );
        }

        return projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    getProject(id) {
        return this.getById('projects', id);
    },

    createProject(data) {
        const projects = this.getAll('projects');
        const year = new Date().getFullYear();
        const count = projects.filter(p => p.code.includes(`DA-${year}`)).length + 1;
        const code = `DA-${year}-${String(count).padStart(3, '0')}`;
        return this.create('projects', { ...data, code, status: 'active', winner_lead_id: null });
    },

    updateProject(id, data) {
        return this.update('projects', id, data);
    },

    deleteProject(id) {
        return this.delete('projects', id);
    },

    getProjectStats() {
        const projects = this.getAll('projects');
        return {
            total: projects.length,
            active: projects.filter(p => p.status === 'active').length,
            won: projects.filter(p => p.status === 'won').length,
            cancelled: projects.filter(p => p.status === 'cancelled').length
        };
    },

    // Leads
    getLeads(filters = {}) {
        let leads = this.getAll('leads');

        if (filters.project_id) {
            leads = leads.filter(l => l.project_id === parseInt(filters.project_id));
        }
        if (filters.subcontractor_id) {
            leads = leads.filter(l => l.subcontractor_id === parseInt(filters.subcontractor_id));
        }
        if (filters.sales_id) {
            leads = leads.filter(l => l.sales_id === parseInt(filters.sales_id));
        }
        if (filters.assigned_consultant_id) {
            leads = leads.filter(l => l.assigned_consultant_id === parseInt(filters.assigned_consultant_id));
        }
        if (filters.status) {
            leads = leads.filter(l => l.status === filters.status);
        }
        if (filters.current_stage) {
            leads = leads.filter(l => l.current_stage === filters.current_stage);
        }

        return leads;
    },

    getLead(id) {
        return this.getById('leads', id);
    },

    createLead(data) {
        return this.create('leads', {
            ...data,
            current_stage: 'initial_contact',
            status: 'active',
            won_at: null,
            lost_at: null,
            lost_reason: null
        });
    },

    updateLead(id, data) {
        return this.update('leads', id, data);
    },

    deleteLead(id) {
        return this.delete('leads', id);
    },

    getLeadsByProject(projectId) {
        return this.getLeads({ project_id: projectId });
    },

    getActiveLeads() {
        return this.getLeads({ status: 'active' });
    },

    getLeadStats() {
        const leads = this.getAll('leads');
        const stages = {};
        StageHelper.stages.forEach(s => {
            stages[s.code] = leads.filter(l => l.current_stage === s.code && l.status === 'active').length;
        });
        return {
            total: leads.length,
            active: leads.filter(l => l.status === 'active').length,
            won: leads.filter(l => l.status === 'won').length,
            lost: leads.filter(l => l.status === 'lost').length,
            by_stage: stages
        };
    },

    // Select winner
    selectWinner(leadId) {
        const lead = this.getLead(leadId);
        if (!lead) return { success: false, message: 'Lead không tồn tại' };

        const project = this.getProject(lead.project_id);
        if (!project) return { success: false, message: 'Dự án không tồn tại' };

        if (project.status === 'won') {
            return { success: false, message: 'Dự án đã có nhà thầu thắng' };
        }

        // Update winning lead
        this.updateLead(leadId, { status: 'won', won_at: new Date().toISOString() });

        // Update project
        this.updateProject(project.id, { status: 'won', winner_lead_id: leadId });

        // Update other leads to lost
        const otherLeads = this.getLeadsByProject(project.id).filter(l => l.id !== parseInt(leadId));
        otherLeads.forEach(l => {
            this.updateLead(l.id, {
                status: 'lost',
                lost_at: new Date().toISOString(),
                lost_reason: 'Dự án đã có nhà thầu khác thắng'
            });
        });

        // Calculate reward points for consultant
        if (lead.assigned_consultant_id) {
            this.calculateRewardPoints(leadId);
        }

        // Create notifications
        this.createWinnerNotifications(leadId, project.id);

        return { success: true, message: 'Đã chọn thầu thắng thành công' };
    },

    // Lead stage history
    getLeadHistory(leadId) {
        return this.getAll('lead_stage_history')
            .filter(h => h.lead_id === parseInt(leadId))
            .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
    },

    addLeadHistory(leadId, fromStage, toStage, userId, notes = '') {
        return this.create('lead_stage_history', {
            lead_id: parseInt(leadId),
            from_stage: fromStage,
            to_stage: toStage,
            changed_by: userId,
            notes: notes,
            changed_at: new Date().toISOString()
        });
    },

    changeLeadStage(leadId, newStage, userId, notes = '', meetingInfo = '') {
        const lead = this.getLead(leadId);
        if (!lead) return { success: false, message: 'Lead không tồn tại' };

        const oldStage = lead.current_stage;
        const updateData = { current_stage: newStage };

        // Lưu meeting_info nếu có
        if (meetingInfo) {
            updateData.meeting_info = meetingInfo;
        }

        this.updateLead(leadId, updateData);
        this.addLeadHistory(leadId, oldStage, newStage, userId, notes);

        // Create notification
        this.createStageChangeNotification(leadId, oldStage, newStage);

        return { success: true, message: 'Cập nhật stage thành công' };
    },

    // Rewards
    getRewardTransactions(filters = {}) {
        let transactions = this.getAll('reward_transactions');

        if (filters.user_id) {
            transactions = transactions.filter(t => t.user_id === parseInt(filters.user_id));
        }
        if (filters.year) {
            transactions = transactions.filter(t => new Date(t.created_at).getFullYear() === parseInt(filters.year));
        }

        return transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    addRewardPoints(userId, points, type, description, leadId = null, projectId = null, approvedBy = null) {
        const transaction = this.create('reward_transactions', {
            user_id: parseInt(userId),
            lead_id: leadId ? parseInt(leadId) : null,
            project_id: projectId ? parseInt(projectId) : null,
            type: type,
            points: points,
            description: description,
            approved_by: approvedBy
        });

        // Update user total points
        const user = this.getUser(userId);
        if (user) {
            this.updateUser(userId, { reward_points: (user.reward_points || 0) + points });
        }

        return transaction;
    },

    calculateRewardPoints(leadId) {
        const lead = this.getLead(leadId);
        if (!lead || !lead.assigned_consultant_id) return;

        const project = this.getProject(lead.project_id);
        const subcontractor = this.getSubcontractor(lead.subcontractor_id);
        const userId = lead.assigned_consultant_id;

        // Base points for deal won
        let points = 100;
        this.addRewardPoints(userId, 100, 'deal_won',
            `Deal thắng: ${project?.name} - ${subcontractor?.name}`,
            leadId, lead.project_id, 1);

        // Bonus for high value project (>1 billion)
        if (project?.estimated_value > 1000000000) {
            this.addRewardPoints(userId, 50, 'bonus',
                'Deal giá trị lớn (>1 tỷ)',
                leadId, lead.project_id, 1);
        }

        // Bonus for VIP subcontractor
        if (subcontractor?.relationship_level === 'vip') {
            this.addRewardPoints(userId, 30, 'bonus',
                'Thầu VIP',
                leadId, lead.project_id, 1);
        }

        // Bonus for quick close (< 30 days)
        const createdAt = new Date(lead.created_at);
        const wonAt = new Date(lead.won_at);
        const daysDiff = Math.floor((wonAt - createdAt) / (1000 * 60 * 60 * 24));
        if (daysDiff < 30) {
            this.addRewardPoints(userId, 20, 'bonus',
                'Hoàn thành nhanh (<30 ngày)',
                leadId, lead.project_id, 1);
        }

        // Create notification
        this.createRewardNotification(userId, leadId);
    },

    getLeaderboard(year = new Date().getFullYear()) {
        const consultants = this.getConsultants();
        const transactions = this.getRewardTransactions({ year });

        return consultants.map(c => {
            const userTransactions = transactions.filter(t => t.user_id === c.id);
            const totalPoints = userTransactions.reduce((sum, t) => sum + t.points, 0);
            const dealsWon = userTransactions.filter(t => t.type === 'deal_won').length;
            return {
                ...c,
                year_points: totalPoints,
                deals_won: dealsWon
            };
        }).sort((a, b) => b.year_points - a.year_points);
    },

    // Notifications
    getNotifications(userId) {
        return this.getAll('notifications')
            .filter(n => n.user_id === parseInt(userId))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    getUnreadNotifications(userId) {
        return this.getNotifications(userId).filter(n => !n.read_at);
    },

    createNotification(userId, type, title, message, data = {}) {
        return this.create('notifications', {
            user_id: parseInt(userId),
            type: type,
            title: title,
            message: message,
            data: data,
            read_at: null
        });
    },

    markNotificationAsRead(notificationId) {
        return this.update('notifications', notificationId, { read_at: new Date().toISOString() });
    },

    markAllNotificationsAsRead(userId) {
        const notifications = this.getNotifications(userId);
        notifications.forEach(n => {
            if (!n.read_at) {
                this.markNotificationAsRead(n.id);
            }
        });
    },

    createWinnerNotifications(leadId, projectId) {
        const lead = this.getLead(leadId);
        const project = this.getProject(projectId);
        const subcontractor = this.getSubcontractor(lead.subcontractor_id);

        // Notify admin
        const admins = this.getUsersByRole('admin');
        admins.forEach(admin => {
            this.createNotification(admin.id, 'project_won', 'Dự án đã có thầu thắng',
                `${subcontractor?.name} thắng dự án ${project?.name}`,
                { lead_id: leadId, project_id: projectId });
        });

        // Notify consultant
        if (lead.assigned_consultant_id) {
            this.createNotification(lead.assigned_consultant_id, 'project_won', 'Chúc mừng! Deal thắng',
                `Lead ${subcontractor?.name} - ${project?.name} đã thắng`,
                { lead_id: leadId, project_id: projectId });
        }
    },

    createStageChangeNotification(leadId, oldStage, newStage) {
        const lead = this.getLead(leadId);
        const project = this.getProject(lead.project_id);
        const subcontractor = this.getSubcontractor(lead.subcontractor_id);
        const stageName = StageHelper.getStageName(newStage);

        // Notify admin
        const admins = this.getUsersByRole('admin');
        admins.forEach(admin => {
            this.createNotification(admin.id, 'stage_changed', 'Lead cập nhật tiến độ',
                `Lead ${subcontractor?.name} - ${project?.name} chuyển sang ${stageName}`,
                { lead_id: leadId, project_id: lead.project_id });
        });

        // Notify assigned consultant
        if (lead.assigned_consultant_id) {
            this.createNotification(lead.assigned_consultant_id, 'stage_changed', 'Lead cập nhật tiến độ',
                `Lead ${subcontractor?.name} - ${project?.name} chuyển sang ${stageName}`,
                { lead_id: leadId, project_id: lead.project_id });
        }
    },

    createRewardNotification(userId, leadId) {
        const lead = this.getLead(leadId);
        const project = this.getProject(lead.project_id);

        this.createNotification(userId, 'reward_added', 'Điểm thưởng mới',
            `Bạn nhận được điểm thưởng cho deal ${project?.name}`,
            { lead_id: leadId });
    },

    createLeadAssignedNotification(consultantId, leadId) {
        const lead = this.getLead(leadId);
        const project = this.getProject(lead.project_id);
        const subcontractor = this.getSubcontractor(lead.subcontractor_id);

        this.createNotification(consultantId, 'lead_assigned', 'Lead mới được giao',
            `Bạn được giao Lead ${subcontractor?.name} cho dự án ${project?.name}`,
            { lead_id: leadId, project_id: lead.project_id });
    }
};
