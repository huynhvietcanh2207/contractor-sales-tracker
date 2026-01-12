// Projects Page
const ProjectsPage = {
    filters: { status: '', search: '' },

    render() {
        const user = Auth.getUser();
        const allProjects = API.getProjects(this.filters);
        const allLeads = API.getLeads();
        const projects = Permissions.filterProjectsForUser(allProjects, allLeads, user);

        return `
            ${Header.render('Dự án', [{ label: 'Dự án' }])}
            
            <main class="p-6">
                <!-- Page Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Quản lý Dự án</h1>
                        <p class="text-gray-500">Danh sách các dự án và tiến độ</p>
                    </div>
                    ${Permissions.canCreateProject(user) ? `
                        <button onclick="ProjectsPage.showCreateModal()" class="btn btn-primary">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Thêm dự án
                        </button>
                    ` : ''}
                </div>

                <!-- Filters -->
                <div class="card p-4 mb-6">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex-1">
                            <input type="text" 
                                   placeholder="Tìm kiếm theo tên hoặc mã dự án..." 
                                   class="form-input"
                                   value="${this.filters.search}"
                                   oninput="ProjectsPage.onSearch(this.value)">
                        </div>
                        <select class="form-input form-select w-full sm:w-48" onchange="ProjectsPage.onFilterStatus(this.value)">
                            <option value="">Tất cả trạng thái</option>
                            <option value="active" ${this.filters.status === 'active' ? 'selected' : ''}>🟢 Đang hoạt động</option>
                            <option value="won" ${this.filters.status === 'won' ? 'selected' : ''}>🏆 Đã chốt</option>
                            <option value="cancelled" ${this.filters.status === 'cancelled' ? 'selected' : ''}>🔴 Đã hủy</option>
                        </select>
                    </div>
                </div>

                <!-- Projects Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${projects.map(project => this.renderProjectCard(project, allLeads)).join('')}
                </div>

                ${projects.length === 0 ? `
                    <div class="card p-12 text-center">
                        <div class="empty-state-icon">
                            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <h3 class="empty-state-title">Không có dự án nào</h3>
                        <p class="empty-state-text">Bắt đầu bằng cách tạo dự án mới</p>
                        ${Permissions.canCreateProject(user) ? `
                            <button onclick="ProjectsPage.showCreateModal()" class="btn btn-primary">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Thêm dự án
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
            </main>
        `;
    },

    renderProjectCard(project, allLeads) {
        const projectLeads = allLeads.filter(l => l.project_id === project.id);
        const activeLeads = projectLeads.filter(l => l.status === 'active');
        const wonLead = projectLeads.find(l => l.status === 'won');
        const winner = wonLead ? API.getSubcontractor(wonLead.subcontractor_id) : null;

        // Tìm thầu dẫn đầu trong các thầu active
        let leadingLead = null;
        if (activeLeads.length > 0) {
            leadingLead = activeLeads.reduce((best, current) => {
                const bestStage = StageHelper.getStageOrder(best.current_stage);
                const currentStage = StageHelper.getStageOrder(current.current_stage);
                if (currentStage > bestStage) return current;
                if (currentStage === bestStage && current.relationship_score > best.relationship_score) return current;
                return best;
            });
        }

        const leadingSub = leadingLead ? API.getSubcontractor(leadingLead.subcontractor_id) : null;
        const leadingSales = leadingLead ? API.getUser(leadingLead.sales_id) : null;
        const stageOrder = leadingLead ? StageHelper.getStageOrder(leadingLead.current_stage) : 0;
        const isCritical = stageOrder >= 5;

        // Đếm số sales và tư vấn phụ unique
        const uniqueSales = [...new Set(projectLeads.map(l => l.sales_id))].length;
        const uniqueConsultants = [...new Set(projectLeads.filter(l => l.assigned_consultant_id).map(l => l.assigned_consultant_id))].length;

        return `
            <div class="card card-interactive p-5" onclick="window.location.hash='#/projects/${project.id}'">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-xs font-semibold text-gray-500">${project.code}</span>
                            <span class="badge ${StatusHelper.getProjectStatusColor(project.status)}">
                                ${StatusHelper.getProjectStatusName(project.status)}
                            </span>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">${project.name}</h3>
                        ${project.description ? `
                            <p class="text-sm text-gray-600 line-clamp-2 mb-2">${project.description}</p>
                        ` : ''}
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div class="text-center">
                        <div class="text-xs text-gray-500 mb-1">Nhà thầu</div>
                        <div class="text-xl font-bold text-blue-600">${projectLeads.length}</div>
                    </div>
                    <div class="text-center border-l border-r border-gray-200">
                        <div class="text-xs text-gray-500 mb-1">Sales</div>
                        <div class="text-xl font-bold text-green-600">${uniqueSales}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-gray-500 mb-1">Tư vấn</div>
                        <div class="text-xl font-bold text-purple-600">${uniqueConsultants}</div>
                    </div>
                </div>

                <div class="space-y-2 mb-3">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">Giá trị ước tính</span>
                        <span class="font-semibold text-gray-900">${Utils.formatCurrency(project.estimated_value)}</span>
                    </div>
                    ${project.expected_close_date ? `
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-500">Dự kiến chốt</span>
                            <span class="font-medium text-gray-900">${Utils.formatDate(project.expected_close_date)}</span>
                        </div>
                    ` : ''}
                </div>

                ${project.status === 'won' && winner ? `
                    <div class="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                        <div class="flex-1">
                            <div class="text-xs text-green-600 font-medium">THẦU THẮNG CUỘC</div>
                            <div class="font-bold text-green-900">${winner.name}</div>
                            <div class="text-xs text-green-600 mb-2">${Utils.formatDate(wonLead.won_at)}</div>
                            <div class="pt-2 border-t border-green-200 space-y-1">
                                <div class="flex items-center gap-1">
                                    <span class="text-xs text-green-600">Sales phụ trách:</span>
                                    <span class="text-xs font-medium text-green-800">${API.getUser(wonLead.sales_id)?.name || 'N/A'}</span>
                                </div>
                                ${wonLead.assigned_consultant_id ? `
                                    <div class="flex items-center gap-1">
                                        <span class="text-xs text-green-600">Tư vấn:</span>
                                        <span class="text-xs font-medium text-green-800">${API.getUser(wonLead.assigned_consultant_id)?.name || 'N/A'}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                ` : leadingLead ? `
                    <div class="p-3 ${isCritical ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200' : 'bg-blue-50 border border-blue-200'} rounded-lg">
                        <div class="flex-1">
                            <div class="text-xs ${isCritical ? 'text-orange-600' : 'text-blue-600'} font-medium">
                                ${isCritical ? 'THẦU ƯU TIÊN' : 'THẦU DẪN ĐẦU'}
                            </div>
                            <div class="font-bold ${isCritical ? 'text-orange-900' : 'text-gray-900'}">${leadingSub?.name || 'N/A'}</div>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="badge ${StageHelper.getStageColor(leadingLead.current_stage)} text-xs">
                                    Giai đoạn: ${StageHelper.getStageName(leadingLead.current_stage)}
                                </span>
                                <span class="text-xs ${isCritical ? 'text-orange-600' : 'text-gray-500'}">
                                    ${PriorityHelper.getPriorityIcon(leadingLead.priority)} ${PriorityHelper.getPriorityName(leadingLead.priority)}
                                </span>
                            </div>
                            <div class="pt-2 border-t border-${isCritical ? 'orange' : 'blue'}-200 space-y-1">
                                <div class="flex items-center gap-1">
                                    <span class="text-xs text-gray-500">Sales phụ trách:</span>
                                    <span class="text-xs font-medium text-gray-700">${leadingSales?.name || 'N/A'}</span>
                                </div>
                                ${leadingLead.assigned_consultant_id ? `
                                    <div class="flex items-center gap-1">
                                        <span class="text-xs text-gray-500">Tư vấn:</span>
                                        <span class="text-xs font-medium text-gray-700">${API.getUser(leadingLead.assigned_consultant_id)?.name || 'N/A'}</span>
                                    </div>
                                ` : ''}
                            </div>
                            ${leadingLead.meeting_info ? `
                                <div class="flex items-start gap-1 pt-1">
                                    <span class="text-xs text-gray-600 italic">${leadingLead.meeting_info}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : `
                    <div class="p-3 bg-gray-50 rounded-lg text-center">
                        <p class="text-sm text-gray-500">Chưa có thầu tham gia</p>
                    </div>
                `}
            </div>
        `;
    },

    onSearch: Utils.debounce((value) => {
        ProjectsPage.filters.search = value;
        App.renderContent();
    }, 300),

    onFilterStatus(value) {
        this.filters.status = value;
        App.renderContent();
    },

    showCreateModal() {
        Modal.open({
            title: 'Thêm dự án mới',
            size: 'lg',
            content: `
                <form id="project-form">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group md:col-span-2">
                            <label class="form-label">Tên dự án <span class="text-red-500">*</span></label>
                            <input type="text" name="name" class="form-input" placeholder="VD: Chung cư cao cấp ABC" required>
                        </div>
                        
                        <div class="form-group md:col-span-2">
                            <label class="form-label">Mô tả</label>
                            <textarea name="description" class="form-input form-textarea" placeholder="Mô tả chi tiết về dự án..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Giá trị ước tính (VNĐ)</label>
                            <input type="number" name="estimated_value" class="form-input" placeholder="500000000">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Ngày bắt đầu</label>
                            <input type="date" name="start_date" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Ngày dự kiến chốt</label>
                            <input type="date" name="expected_close_date" class="form-input">
                        </div>
                        
                        <div class="form-group md:col-span-2">
                            <label class="form-label">Ghi chú sản phẩm</label>
                            <textarea name="product_notes" class="form-input form-textarea" placeholder="Ghi chú các sản phẩm cần liên hệ nhãn hàng..."></textarea>
                        </div>
                    </div>
                </form>
            `,
            confirmText: 'Tạo dự án',
            onConfirm: () => {
                const form = document.getElementById('project-form');
                const formData = new FormData(form);

                if (!formData.get('name')) {
                    Toast.error('Lỗi', 'Vui lòng nhập tên dự án');
                    return false;
                }

                const project = API.createProject({
                    name: formData.get('name'),
                    description: formData.get('description'),
                    estimated_value: parseInt(formData.get('estimated_value')) || 0,
                    start_date: formData.get('start_date'),
                    expected_close_date: formData.get('expected_close_date'),
                    product_notes: formData.get('product_notes'),
                    created_by: Auth.getUser().id
                });

                Toast.success('Thành công', 'Đã tạo dự án mới');
                App.renderContent();
            }
        });
    }
};
