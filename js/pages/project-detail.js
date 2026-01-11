// Project Detail Page
const ProjectDetailPage = {
    projectId: null,

    render(id) {
        this.projectId = parseInt(id);
        const user = Auth.getUser();
        const project = API.getProject(this.projectId);

        if (!project) {
            return `
                ${Header.render('Dự án', [{ label: 'Dự án', href: '#/projects' }, { label: 'Không tìm thấy' }])}
                <main class="p-6">
                    <div class="card p-12 text-center">
                        <div class="empty-state-icon">
                            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="empty-state-title">Không tìm thấy dự án</h3>
                        <p class="empty-state-text">Dự án không tồn tại hoặc đã bị xóa</p>
                        <a href="#/projects" class="btn btn-primary">← Quay lại danh sách</a>
                    </div>
                </main>
            `;
        }

        const leads = API.getLeadsByProject(this.projectId);
        const filteredLeads = Permissions.filterLeadsForUser(leads, user);
        const canSeeAllLeads = Permissions.canViewAllLeads(user);

        return `
            ${Header.render('Dự án', [
            { label: 'Dự án', href: '#/projects' },
            { label: project.name }
        ])}
            
            <main class="p-6">
                <!-- Project Header -->
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <span class="text-sm font-medium text-gray-500">${project.code}</span>
                            <span class="badge ${StatusHelper.getProjectStatusColor(project.status)}">
                                ${StatusHelper.getProjectStatusName(project.status)}
                            </span>
                        </div>
                        <h1 class="text-2xl font-bold text-gray-900">${project.name}</h1>
                        ${project.description ? `<p class="text-gray-600 mt-2">${project.description}</p>` : ''}
                    </div>
                    
                    ${Permissions.canEditProject(user) ? `
                        <div class="flex gap-2">
                            <button onclick="ProjectDetailPage.showEditModal()" class="btn btn-secondary">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                Sửa
                            </button>
                            <button onclick="ProjectDetailPage.deleteProject()" class="btn btn-danger">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Xóa
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    ${this.renderProjectStats(project, filteredLeads, leads)}
                </div>

                <!-- Leading Contractor Alert -->
                ${this.renderLeadingContractorAlert(leads)}

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Main Content -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Leads Section -->
                        <div class="card p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h2 class="text-lg font-semibold text-gray-900">
                                    ${canSeeAllLeads ? 'Các Nhà thầu phụ tham gia' : 'Lead của bạn'}
                                </h2>
                                ${Permissions.canCreateProject(user) && project.status === 'active' ? `
                                    <button onclick="ProjectDetailPage.showAddLeadModal()" class="btn btn-sm btn-primary">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                        Thêm Thầu phụ
                                    </button>
                                ` : ''}
                            </div>

                            ${project.status === 'won' ? `
                                <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div class="flex items-center gap-2 text-green-800">
                                        <span class="text-xl">🏆</span>
                                        <span class="font-medium">Dự án đã có thầu thắng cuộc</span>
                                    </div>
                                </div>
                            ` : ''}

                            <div class="space-y-4">
                                ${(canSeeAllLeads ? leads : filteredLeads).map(lead => this.renderLeadCard(lead, project, user)).join('')}
                                ${leads.length === 0 ? `
                                    <div class="text-center py-8 text-gray-500">
                                        <p>Chưa có thầu phụ nào tham gia dự án này</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="space-y-6">
                        <!-- Project Info -->
                        <div class="card p-6">
                            <h3 class="font-semibold text-gray-900 mb-4">Thông tin dự án</h3>
                            <div class="space-y-3">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500">Giá trị ước tính</span>
                                    <span class="font-medium text-gray-900">${Utils.formatCurrency(project.estimated_value)}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500">Ngày bắt đầu</span>
                                    <span class="font-medium text-gray-900">${project.start_date ? Utils.formatDate(project.start_date) : 'Chưa xác định'}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500">Dự kiến chốt</span>
                                    <span class="font-medium text-gray-900">${project.expected_close_date ? Utils.formatDate(project.expected_close_date) : 'Chưa xác định'}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-500">Ngày tạo</span>
                                    <span class="font-medium text-gray-900">${Utils.formatDate(project.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Product Notes -->
                        ${Permissions.canEditProject(user) ? `
                            <div class="card p-6">
                                <h3 class="font-semibold text-gray-900 mb-4">📝 Ghi chú sản phẩm</h3>
                                <textarea id="product-notes" class="form-input form-textarea" placeholder="Ghi chú các sản phẩm cần liên hệ nhãn hàng...">${project.product_notes || ''}</textarea>
                                <button onclick="ProjectDetailPage.saveNotes()" class="btn btn-sm btn-secondary mt-3 w-full">
                                    Lưu ghi chú
                                </button>
                            </div>
                        ` : project.product_notes ? `
                            <div class="card p-6">
                                <h3 class="font-semibold text-gray-900 mb-4">📝 Ghi chú sản phẩm</h3>
                                <p class="text-sm text-gray-600 whitespace-pre-wrap">${project.product_notes}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </main>
        `;
    },

    renderProjectStats(project, filteredLeads, allLeads) {
        const activeLeads = allLeads.filter(l => l.status === 'active');
        const wonLeads = allLeads.filter(l => l.status === 'won');
        const lostLeads = allLeads.filter(l => l.status === 'lost');

        // Đếm unique sales và consultants
        const uniqueSales = [...new Set(allLeads.map(l => l.sales_id))];
        const uniqueConsultants = [...new Set(allLeads.filter(l => l.assigned_consultant_id).map(l => l.assigned_consultant_id))];
        const uniqueSubcontractors = [...new Set(allLeads.map(l => l.subcontractor_id))];

        return `
            <div class="card p-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Nhà thầu phụ</p>
                        <p class="text-2xl font-bold text-gray-900">${uniqueSubcontractors.length}</p>
                    </div>
                </div>
            </div>

            <div class="card p-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Sales</p>
                        <p class="text-2xl font-bold text-gray-900">${uniqueSales.length}</p>
                    </div>
                </div>
            </div>

            <div class="card p-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Tư vấn phụ</p>
                        <p class="text-2xl font-bold text-gray-900">${uniqueConsultants.length}</p>
                    </div>
                </div>
            </div>

            <div class="card p-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Tỷ lệ thắng</p>
                        <p class="text-2xl font-bold text-gray-900">
                            ${allLeads.length > 0 ? Math.round((wonLeads.length / allLeads.length) * 100) : 0}%
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    renderLeadingContractorAlert(allLeads) {
        const activeLeads = allLeads.filter(l => l.status === 'active');
        if (activeLeads.length === 0) return '';

        // Tìm thầu dẫn đầu
        const leadingLead = activeLeads.reduce((best, current) => {
            const bestStage = StageHelper.getStageOrder(best.current_stage);
            const currentStage = StageHelper.getStageOrder(current.current_stage);
            if (currentStage > bestStage) return current;
            if (currentStage === bestStage && current.relationship_score > best.relationship_score) return current;
            return best;
        });

        const leadingSub = API.getSubcontractor(leadingLead.subcontractor_id);
        const leadingSales = API.getUser(leadingLead.sales_id);
        const leadingConsultant = leadingLead.assigned_consultant_id ? API.getUser(leadingLead.assigned_consultant_id) : null;
        const stageOrder = StageHelper.getStageOrder(leadingLead.current_stage);
        const isCritical = stageOrder >= 5;

        return `
            <div class="mb-6 p-5 ${isCritical ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200'} rounded-xl">
                <div class="flex items-start gap-4">
                    <div class="text-4xl">${isCritical ? '⭐' : '🔵'}</div>
                    <div class="flex-1">
                        <h3 class="text-lg font-bold ${isCritical ? 'text-orange-900' : 'text-blue-900'} mb-2">
                            ${isCritical ? '⚡ THẦU ƯU TIÊN - GẦN CHỐT' : '📊 THẦU DẪN ĐẦU'}
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p class="text-xs ${isCritical ? 'text-orange-600' : 'text-blue-600'} mb-1">Nhà thầu phụ</p>
                                <p class="font-bold ${isCritical ? 'text-orange-900' : 'text-gray-900'} text-lg">${leadingSub?.name || 'N/A'}</p>
                                <p class="text-sm text-gray-600">${leadingSub?.code || ''}</p>
                            </div>
                            <div>
                                <p class="text-xs ${isCritical ? 'text-orange-600' : 'text-blue-600'} mb-1">Tiến độ</p>
                                <div class="flex items-center gap-2">
                                    <span class="badge ${StageHelper.getStageColor(leadingLead.current_stage)}">
                                        ${StageHelper.getStageName(leadingLead.current_stage)}
                                    </span>
                                    <span class="text-sm font-semibold ${isCritical ? 'text-orange-600' : 'text-blue-600'}">
                                        Giai đoạn ${stageOrder}/6
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600 mt-1">
                                    ${PriorityHelper.getPriorityIcon(leadingLead.priority)} ${PriorityHelper.getPriorityName(leadingLead.priority)}
                                </p>
                            </div>
                            <div>
                                <p class="text-xs ${isCritical ? 'text-orange-600' : 'text-blue-600'} mb-1">Phụ trách</p>
                                <p class="text-sm font-medium text-gray-900">Sales: ${leadingSales?.name || 'N/A'}</p>
                                <p class="text-sm font-medium text-gray-900">Tư vấn: ${leadingConsultant?.name || 'Chưa giao'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderLeadCard(lead, project, user) {
        const subcontractor = API.getSubcontractor(lead.subcontractor_id);
        const sales = API.getUser(lead.sales_id);
        const consultant = lead.assigned_consultant_id ? API.getUser(lead.assigned_consultant_id) : null;
        const stageOrder = StageHelper.getStageOrder(lead.current_stage);
        const canSelectWinner = Permissions.canSelectWinner(user) && project.status === 'active' && lead.status === 'active';

        let statusIcon = '🔵';
        let statusClass = 'border-blue-200 bg-blue-50';
        if (lead.status === 'won') {
            statusIcon = '🏆';
            statusClass = 'border-green-300 bg-green-50';
        } else if (lead.status === 'lost') {
            statusIcon = '❌';
            statusClass = 'border-gray-200 bg-gray-50';
        } else if (stageOrder >= 5) {
            statusIcon = '⭐';
            statusClass = 'border-orange-300 bg-orange-50';
        }

        return `
            <div class="p-4 rounded-lg border-2 ${statusClass}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">${statusIcon}</span>
                        <div>
                            <h4 class="font-semibold text-gray-900">${subcontractor?.name || 'N/A'}</h4>
                            <p class="text-sm text-gray-500">${subcontractor?.code || ''}</p>
                        </div>
                    </div>
                    <span class="badge ${lead.status === 'won' ? 'badge-gold' : lead.status === 'lost' ? 'badge-gray' : StageHelper.getStageColor(lead.current_stage)}">
                        ${lead.status === 'won' ? 'Thắng' : lead.status === 'lost' ? 'Thua' : StageHelper.getStageName(lead.current_stage)}
                    </span>
                </div>

                <!-- Stage Progress -->
                ${lead.status === 'active' ? `
                    <div class="mb-4">
                        <div class="text-xs font-medium text-gray-700 mb-3">
                             Tiến độ hiện tại: <span class="text-blue-600">${StageHelper.getStageName(lead.current_stage)}</span>
                        </div>
                        <div class="relative">
                            <div class="flex items-start justify-between">
                                ${StageHelper.stages.map((stage, index) => {
            const currentOrder = stageOrder;
            const isCompleted = stage.order < currentOrder;
            const isCurrent = stage.order === currentOrder;
            return `
                                        <div class="flex flex-col items-center" style="flex: 1; position: relative;">
                                            <div class="stage-dot ${isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}" title="${stage.name}">
                                                ${isCompleted ? '✓' : stage.order}
                                            </div>
                                            <div class="text-xs mt-2 text-center ${isCurrent ? 'font-semibold text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}" style="max-width: 70px; line-height: 1.1; word-wrap: break-word;">
                                                ${stage.name}
                                            </div>
                                            ${index < StageHelper.stages.length - 1 ? `
                                                <div class="absolute top-3 left-1/2 w-full h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}" style="z-index: -1;"></div>
                                            ` : ''}
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <div class="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                        <span class="text-gray-500">Sales:</span>
                        <span class="font-medium text-gray-900 ml-1">${sales?.name || 'Chưa có'}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Tư vấn:</span>
                        <span class="font-medium text-gray-900 ml-1">${consultant?.name || 'Chưa giao'}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Ưu tiên:</span>
                        <span class="ml-1">${PriorityHelper.getPriorityIcon(lead.priority)} ${PriorityHelper.getPriorityName(lead.priority)}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Quan hệ:</span>
                        <span class="font-medium text-gray-900 ml-1">${lead.relationship_score || 0}/10</span>
                    </div>
                </div>

                ${lead.notes ? `
                    <p class="text-sm text-gray-600 italic mb-3">"${lead.notes}"</p>
                ` : ''}

                ${lead.status === 'lost' && lead.lost_reason ? `
                    <p class="text-sm text-gray-500 mb-3">Lý do: ${lead.lost_reason}</p>
                ` : ''}

                <div class="flex gap-2 pt-3 border-t border-gray-200">
                    ${lead.status === 'active' && Permissions.canUpdateLeadStage(user, lead) ? `
                        <button onclick="ProjectDetailPage.showChangeStageModal(${lead.id})" class="btn btn-sm btn-secondary flex-1" title="Click để chuyển stage (có thể thêm stage tùy chỉnh)">
                             Chuyển giai đoạn
                        </button>
                    ` : ''}
                    ${canSelectWinner ? `
                        <button onclick="ProjectDetailPage.selectWinner(${lead.id})" class="btn btn-sm btn-success flex-1">
                            🏆 Chọn thắng
                        </button>
                    ` : ''}
                    <button onclick="ProjectDetailPage.showLeadDetail(${lead.id})" class="btn btn-sm btn-outline">
                        Chi tiết
                    </button>
                </div>
            </div>
        `;
    },

    showEditModal() {
        const project = API.getProject(this.projectId);

        Modal.open({
            title: 'Sửa thông tin dự án',
            size: 'lg',
            content: `
                <form id="edit-project-form">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group md:col-span-2">
                            <label class="form-label">Tên dự án <span class="text-red-500">*</span></label>
                            <input type="text" name="name" class="form-input" value="${project.name}" required>
                        </div>
                        
                        <div class="form-group md:col-span-2">
                            <label class="form-label">Mô tả</label>
                            <textarea name="description" class="form-input form-textarea">${project.description || ''}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Giá trị ước tính (VNĐ)</label>
                            <input type="number" name="estimated_value" class="form-input" value="${project.estimated_value || ''}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Trạng thái</label>
                            <select name="status" class="form-input form-select">
                                <option value="active" ${project.status === 'active' ? 'selected' : ''}>Đang hoạt động</option>
                                <option value="paused" ${project.status === 'paused' ? 'selected' : ''}>Tạm dừng</option>
                                <option value="cancelled" ${project.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Ngày bắt đầu</label>
                            <input type="date" name="start_date" class="form-input" value="${project.start_date || ''}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Ngày dự kiến chốt</label>
                            <input type="date" name="expected_close_date" class="form-input" value="${project.expected_close_date || ''}">
                        </div>
                    </div>
                </form>
            `,
            confirmText: 'Lưu thay đổi',
            onConfirm: () => {
                const form = document.getElementById('edit-project-form');
                const formData = new FormData(form);

                API.updateProject(this.projectId, {
                    name: formData.get('name'),
                    description: formData.get('description'),
                    estimated_value: parseInt(formData.get('estimated_value')) || 0,
                    status: formData.get('status'),
                    start_date: formData.get('start_date'),
                    expected_close_date: formData.get('expected_close_date')
                });

                Toast.success('Thành công', 'Đã cập nhật dự án');
                App.renderContent();
            }
        });
    },

    deleteProject() {
        Modal.confirm({
            title: 'Xóa dự án?',
            message: 'Bạn có chắc muốn xóa dự án này? Hành động này không thể hoàn tác.',
            type: 'danger',
            confirmText: 'Xóa',
            onConfirm: () => {
                API.deleteProject(this.projectId);
                Toast.success('Thành công', 'Đã xóa dự án');
                window.location.hash = '#/projects';
            }
        });
    },

    saveNotes() {
        const notes = document.getElementById('product-notes').value;
        API.updateProject(this.projectId, { product_notes: notes });
        Toast.success('Thành công', 'Đã lưu ghi chú');
    },

    showAddLeadModal() {
        const subcontractors = API.getSubcontractors();
        const existingLeads = API.getLeadsByProject(this.projectId);
        const existingSubIds = existingLeads.map(l => l.subcontractor_id);
        const availableSubs = subcontractors.filter(s => !existingSubIds.includes(s.id));
        const consultants = API.getConsultants();

        if (availableSubs.length === 0) {
            Toast.warning('Thông báo', 'Tất cả nhà thầu đã tham gia dự án này');
            return;
        }

        Modal.open({
            title: 'Thêm Thầu phụ mới',
            size: 'md',
            content: `
                <form id="add-lead-form">
                    <div class="form-group">
                        <label class="form-label">Nhà thầu phụ <span class="text-red-500">*</span></label>
                        <select name="subcontractor_id" class="form-input form-select" required>
                            <option value="">Chọn nhà thầu phụ</option>
                            ${availableSubs.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Sales phụ trách <span class="text-red-500">*</span></label>
                        <select name="sales_id" class="form-input form-select" required>
                            <option value="">Chọn Sales</option>
                            ${API.getUsers().filter(u => u.role === 'sales').map(s => `<option value="${s.id}">${s.name} (${s.employee_code})</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Giao cho Tư vấn phụ</label>
                        <select name="assigned_consultant_id" class="form-input form-select">
                            <option value="">Chưa giao</option>
                            ${consultants.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mức độ ưu tiên</label>
                        <select name="priority" class="form-input form-select">
                            ${PriorityHelper.priorities.map(p => `<option value="${p.code}">${p.icon} ${p.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Ghi chú</label>
                        <textarea name="notes" class="form-input form-textarea" placeholder="Ghi chú về lead này..."></textarea>
                    </div>
                </form>
            `,
            confirmText: 'Thêm Thầu phụ',
            onConfirm: () => {
                const form = document.getElementById('add-lead-form');
                const formData = new FormData(form);

                if (!formData.get('subcontractor_id') || !formData.get('sales_id')) {
                    Toast.error('Lỗi', 'Vui lòng chọn nhà thầu phụ và Sales');
                    return false;
                }

                const lead = API.createLead({
                    project_id: this.projectId,
                    subcontractor_id: parseInt(formData.get('subcontractor_id')),
                    sales_id: parseInt(formData.get('sales_id')),
                    assigned_consultant_id: formData.get('assigned_consultant_id') ? parseInt(formData.get('assigned_consultant_id')) : null,
                    priority: formData.get('priority'),
                    notes: formData.get('notes')
                });

                if (formData.get('assigned_consultant_id')) {
                    API.createLeadAssignedNotification(parseInt(formData.get('assigned_consultant_id')), lead.id);
                }

                Toast.success('Thành công', 'Đã thêm Thầu phụ mới');
                App.renderContent();
            }
        });
    },

    showChangeStageModal(leadId) {
        const lead = API.getLead(leadId);
        const currentOrder = StageHelper.getStageOrder(lead.current_stage);

        Modal.open({
            title: 'Chuyển giai đoạn',
            size: 'sm',
            content: `
                <form id="change-stage-form">
                    <div class="form-group">
                        <label class="form-label">Giai đoạn hiện tại</label>
                        <input type="text" class="form-input" value="${StageHelper.getStageName(lead.current_stage)}" disabled>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Chuyển sang <span class="text-red-500">*</span></label>
                        <select name="new_stage" id="new-stage-select" class="form-input form-select" required>
                            ${StageHelper.stages.filter(s => s.order > currentOrder).map(s =>
                `<option value="${s.code}">Giai đoạn ${s.order}: ${s.name}</option>`
            ).join('')}
                            <option value="__custom__">➡️ Thêm giai đoạn tùy chỉnh...</option>
                        </select>
                    </div>
                    
                    <div id="custom-stage-input" class="form-group" style="display: none;">
                        <label class="form-label">Tên giai đoạn mới</label>
                        <input type="text" id="custom-stage-name" class="form-input" placeholder="Ví dụ: Đàm phán hợp đồng">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Ghi chú</label>
                        <textarea name="notes" class="form-input form-textarea" placeholder="Ghi chú về việc chuyển stage..."></textarea>
                    </div>
                </form>
            `,
            confirmText: 'Chuyển giai đoạn',
            onConfirm: () => {
                const form = document.getElementById('change-stage-form');
                const formData = new FormData(form);
                const newStage = formData.get('new_stage');

                if (newStage === '__custom__') {
                    const customName = document.getElementById('custom-stage-name').value.trim();
                    if (!customName) {
                        Toast.error('Lỗi', 'Vui lòng nhập tên stage mới');
                        return false;
                    }

                    // Thêm custom stage vào StageHelper
                    const newOrder = StageHelper.stages.length + 1;
                    const newCode = 'custom_' + Date.now();
                    StageHelper.addCustomStage({
                        code: newCode,
                        name: customName,
                        order: newOrder,
                        color: 'badge-purple'
                    });

                    API.changeLeadStage(leadId, newCode, Auth.getUser().id, formData.get('notes'));
                    Toast.success('Thành công', `Đã thêm stage mới "${customName}" và cập nhật lead`);
                } else {
                    API.changeLeadStage(leadId, newStage, Auth.getUser().id, formData.get('notes'));
                    Toast.success('Thành công', 'Đã cập nhật stage');
                }

                App.renderContent();
            }
        });

        // Add event listener for custom stage select
        setTimeout(() => {
            const select = document.getElementById('new-stage-select');
            const customInput = document.getElementById('custom-stage-input');
            if (select && customInput) {
                select.addEventListener('change', (e) => {
                    customInput.style.display = e.target.value === '__custom__' ? 'block' : 'none';
                });
            }
        }, 100);
    },

    selectWinner(leadId) {
        const lead = API.getLead(leadId);
        const subcontractor = API.getSubcontractor(lead.subcontractor_id);

        Modal.confirm({
            title: 'Chọn thầu thắng cuộc?',
            message: `Bạn có chắc muốn chọn "${subcontractor?.name}" thắng cuộc? Các thầu còn lại sẽ tự động chuyển sang trạng thái "Thua".`,
            type: 'success',
            confirmText: 'Xác nhận',
            onConfirm: () => {
                const result = API.selectWinner(leadId);
                if (result.success) {
                    Toast.success('Thành công! 🏆', result.message);
                    App.renderContent();
                } else {
                    Toast.error('Lỗi', result.message);
                }
            }
        });
    },

    showLeadDetail(leadId) {
        const lead = API.getLead(leadId);
        const history = API.getLeadHistory(leadId);
        const subcontractor = API.getSubcontractor(lead.subcontractor_id);
        const sales = API.getUser(lead.sales_id);
        const consultant = lead.assigned_consultant_id ? API.getUser(lead.assigned_consultant_id) : null;

        Modal.open({
            title: `Lead: ${subcontractor?.name}`,
            size: 'lg',
            showFooter: false,
            content: `
                <div class="space-y-6">
                    <!-- Info -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500">Nhà thầu phụ</p>
                            <p class="font-medium">${subcontractor?.name}</p>
                            <span class="badge ${StatusHelper.getRelationshipLevelColor(subcontractor?.relationship_level)}">${StatusHelper.getRelationshipLevelName(subcontractor?.relationship_level)}</span>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Trạng thái</p>
                            <span class="badge ${lead.status === 'won' ? 'badge-gold' : lead.status === 'lost' ? 'badge-gray' : 'badge-primary'}">
                                ${StatusHelper.getLeadStatusIcon(lead.status)} ${StatusHelper.getLeadStatusName(lead.status)}
                            </span>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Sales</p>
                            <p class="font-medium">${sales?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Tư vấn phụ</p>
                            <p class="font-medium">${consultant?.name || 'Chưa giao'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Điểm quan hệ</p>
                            <p class="font-medium">${lead.relationship_score || 0}/10</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Ưu tiên</p>
                            <p class="font-medium">${PriorityHelper.getPriorityIcon(lead.priority)} ${PriorityHelper.getPriorityName(lead.priority)}</p>
                        </div>
                    </div>

                    ${lead.notes ? `
                        <div>
                            <p class="text-sm text-gray-500 mb-1">Ghi chú</p>
                            <p class="text-gray-900">${lead.notes}</p>
                        </div>
                    ` : ''}

                    <!-- History -->
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-3">Lịch sử thay đổi</h4>
                        ${history.length > 0 ? `
                            <div class="space-y-3">
                                ${history.map(h => {
                const changedBy = API.getUser(h.changed_by);
                return `
                                        <div class="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p class="text-sm">
                                                    <span class="font-medium">${changedBy?.name || 'Unknown'}</span> chuyển từ 
                                                    <span class="text-gray-500">${StageHelper.getStageName(h.from_stage)}</span> sang 
                                                    <span class="font-medium text-blue-600">${StageHelper.getStageName(h.to_stage)}</span>
                                                </p>
                                                ${h.notes ? `<p class="text-xs text-gray-500 mt-1">"${h.notes}"</p>` : ''}
                                                <p class="text-xs text-gray-400 mt-1">${Utils.formatDate(h.changed_at, 'dd/mm/yyyy hh:mm')}</p>
                                            </div>
                                        </div>
                                    `;
            }).join('')}
                            </div>
                        ` : '<p class="text-gray-500 text-sm">Chưa có lịch sử thay đổi</p>'}
                    </div>
                </div>
            `
        });
    }
};
