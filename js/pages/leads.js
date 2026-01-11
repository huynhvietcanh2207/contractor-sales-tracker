// Leads Page - Kanban View
const LeadsPage = {
    viewMode: 'kanban', // kanban or list
    filters: { project_id: '', subcontractor_id: '', priority: '' },

    render() {
        const user = Auth.getUser();
        const allLeads = API.getActiveLeads();
        const leads = Permissions.filterLeadsForUser(allLeads, user);
        const projects = API.getProjects({ status: 'active' });
        const subcontractors = API.getSubcontractors();

        return `
            ${Header.render('Cơ hội', [{ label: 'Cơ hội' }])}
            
            <main class="p-6">
                <!-- Page Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Quản lý Cơ hội</h1>
                        <p class="text-gray-500">Theo dõi tiến độ các cơ hội kinh doanh</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="LeadsPage.setViewMode('kanban')" class="btn ${this.viewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
                            </svg>
                            Kanban
                        </button>
                        <button onclick="LeadsPage.setViewMode('list')" class="btn ${this.viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                            </svg>
                            Danh sách
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="card p-4 mb-6">
                    <div class="flex flex-wrap gap-4">
                        <select class="form-input form-select w-full sm:w-48" onchange="LeadsPage.onFilterProject(this.value)">
                            <option value="">Tất cả dự án</option>
                            ${projects.map(p => `<option value="${p.id}" ${this.filters.project_id == p.id ? 'selected' : ''}>${p.code} - ${p.name}</option>`).join('')}
                        </select>
                        ${user.role === 'admin' ? `
                            <select class="form-input form-select w-full sm:w-48" onchange="LeadsPage.onFilterSubcontractor(this.value)">
                                <option value="">Tất cả nhà thầu</option>
                                ${subcontractors.map(s => `<option value="${s.id}" ${this.filters.subcontractor_id == s.id ? 'selected' : ''}>${s.code} - ${s.name}</option>`).join('')}
                            </select>
                        ` : ''}
                        <select class="form-input form-select w-full sm:w-40" onchange="LeadsPage.onFilterPriority(this.value)">
                            <option value="">Tất cả ưu tiên</option>
                            ${PriorityHelper.priorities.map(p => `<option value="${p.code}" ${this.filters.priority === p.code ? 'selected' : ''}>${p.icon} ${p.name}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <!-- Content -->
                ${this.viewMode === 'kanban' ? this.renderKanban(leads) : this.renderList(leads)}
            </main>
        `;
    },

    renderKanban(leads) {
        const filteredLeads = this.applyFilters(leads);

        return `
            <div class="kanban-container">
                ${StageHelper.stages.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.current_stage === stage.code);
            return `
                        <div class="kanban-column">
                            <div class="kanban-column-header">
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold text-gray-900">${stage.name}</span>
                                    <span class="badge badge-gray">${stageLeads.length}</span>
                                </div>
                            </div>
                            <div class="kanban-cards">
                                ${stageLeads.map(lead => this.renderKanbanCard(lead)).join('')}
                                ${stageLeads.length === 0 ? `
                                    <div class="text-center py-8 text-gray-400 text-sm">
                                        Không có lead
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    renderKanbanCard(lead) {
        const project = API.getProject(lead.project_id);
        const subcontractor = API.getSubcontractor(lead.subcontractor_id);
        const stageOrder = StageHelper.getStageOrder(lead.current_stage);
        const isCritical = stageOrder >= 5;

        return `
            <div class="kanban-card ${isCritical ? 'border-l-4 border-orange-400' : ''}" onclick="LeadsPage.showLeadModal(${lead.id})">
                <div class="flex items-start justify-between mb-2">
                    <span class="text-xs font-medium text-gray-500">${project?.code || 'N/A'}</span>
                    <span class="badge ${PriorityHelper.getPriorityColor(lead.priority)} text-xs">
                        ${PriorityHelper.getPriorityIcon(lead.priority)}
                    </span>
                </div>
                <h4 class="font-medium text-gray-900 mb-1">${subcontractor?.name || 'N/A'}</h4>
                <p class="text-sm text-gray-500 truncate mb-2">${project?.name || ''}</p>
                ${lead.notes ? `
                    <p class="text-xs text-gray-400 truncate italic">"${lead.notes}"</p>
                ` : ''}
                <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <span class="text-xs text-gray-400">${Utils.formatDate(lead.updated_at, 'relative')}</span>
                    ${isCritical ? '<span class="text-xs text-orange-600 font-medium">⭐ Tiềm năng</span>' : ''}
                </div>
            </div>
        `;
    },

    renderList(leads) {
        const filteredLeads = this.applyFilters(leads);

        if (filteredLeads.length === 0) {
            return `
                <div class="card p-12 text-center">
                    <div class="empty-state-icon">
                        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3 class="empty-state-title">Không có Thầu phụ nào</h3>
                    <p class="empty-state-text">Thay đổi bộ lọc để xem thêm Thầu phụ</p>
                </div>
            `;
        }

        return `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Dự án</th>
                            <th>Nhà thầu</th>
                            <th>Stage</th>
                            <th>Ưu tiên</th>
                            <th>Tư vấn</th>
                            <th>Cập nhật</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredLeads.map(lead => {
            const project = API.getProject(lead.project_id);
            const subcontractor = API.getSubcontractor(lead.subcontractor_id);
            const consultant = lead.assigned_consultant_id ? API.getUser(lead.assigned_consultant_id) : null;

            return `
                                <tr class="cursor-pointer" onclick="LeadsPage.showLeadModal(${lead.id})">
                                    <td>
                                        <div class="font-medium text-gray-900">${project?.code || 'N/A'}</div>
                                        <div class="text-sm text-gray-500">${project?.name || ''}</div>
                                    </td>
                                    <td>
                                        <div class="font-medium text-gray-900">${subcontractor?.name || 'N/A'}</div>
                                        <span class="badge ${StatusHelper.getRelationshipLevelColor(subcontractor?.relationship_level)} text-xs">
                                            ${StatusHelper.getRelationshipLevelName(subcontractor?.relationship_level)}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge ${StageHelper.getStageColor(lead.current_stage)}">
                                            ${StageHelper.getStageName(lead.current_stage)}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge ${PriorityHelper.getPriorityColor(lead.priority)}">
                                            ${PriorityHelper.getPriorityIcon(lead.priority)} ${PriorityHelper.getPriorityName(lead.priority)}
                                        </span>
                                    </td>
                                    <td class="text-gray-600">${consultant?.name || 'Chưa giao'}</td>
                                    <td class="text-gray-500 text-sm">${Utils.formatDate(lead.updated_at, 'relative')}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); LeadsPage.showLeadModal(${lead.id})">
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    applyFilters(leads) {
        return leads.filter(lead => {
            if (this.filters.project_id && lead.project_id !== parseInt(this.filters.project_id)) return false;
            if (this.filters.subcontractor_id && lead.subcontractor_id !== parseInt(this.filters.subcontractor_id)) return false;
            if (this.filters.priority && lead.priority !== this.filters.priority) return false;
            return true;
        });
    },

    setViewMode(mode) {
        this.viewMode = mode;
        App.renderContent();
    },

    onFilterProject(value) {
        this.filters.project_id = value;
        App.renderContent();
    },

    onFilterSubcontractor(value) {
        this.filters.subcontractor_id = value;
        App.renderContent();
    },

    onFilterPriority(value) {
        this.filters.priority = value;
        App.renderContent();
    },

    showLeadModal(leadId) {
        const lead = API.getLead(leadId);
        const project = API.getProject(lead.project_id);
        window.location.hash = `#/projects/${project.id}`;
    }
};
