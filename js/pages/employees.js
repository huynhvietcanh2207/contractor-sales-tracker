// Employees Page
const EmployeesPage = {
    filter: 'all',

    render() {
        const users = API.getUsers();
        const filteredUsers = this.filter === 'all' ? users : users.filter(u => u.role === this.filter);
        const subcontractors = API.getSubcontractors();

        return `
            ${Header.render('Nhân sự', [{ label: 'Nhân sự' }])}
            
            <main class="p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Quản lý Nhân sự</h1>
                        <p class="text-gray-500">Danh sách nhân viên trong hệ thống</p>
                    </div>
                    <button onclick="EmployeesPage.showCreateModal()" class="btn btn-primary">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Thêm nhân viên
                    </button>
                </div>

                <!-- Tabs -->
                <div class="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                    <button onclick="EmployeesPage.setFilter('all')" class="px-4 py-2 text-sm font-medium border-b-2 ${this.filter === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}">
                        Tất cả (${users.length})
                    </button>
                    <button onclick="EmployeesPage.setFilter('admin')" class="px-4 py-2 text-sm font-medium border-b-2 ${this.filter === 'admin' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}">
                        Admin (${users.filter(u => u.role === 'admin').length})
                    </button>
                    <button onclick="EmployeesPage.setFilter('consultant')" class="px-4 py-2 text-sm font-medium border-b-2 ${this.filter === 'consultant' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}">
                        Tư vấn phụ (${users.filter(u => u.role === 'consultant').length})
                    </button>
                    <button onclick="EmployeesPage.setFilter('sales')" class="px-4 py-2 text-sm font-medium border-b-2 ${this.filter === 'sales' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}">
                        Sales (${users.filter(u => u.role === 'sales').length})
                    </button>
                </div>

                <!-- Table -->
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nhân viên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Nhà thầu</th>
                                <th>Điểm</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredUsers.map(user => {
            const subcontractor = user.subcontractor_id ? API.getSubcontractor(user.subcontractor_id) : null;
            return `
                                    <tr>
                                        <td>
                                            <div class="flex items-center gap-3">
                                                <div class="avatar avatar-sm ${Utils.getAvatarColor(user.name)}">
                                                    ${Utils.getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <div class="font-medium text-gray-900">${user.name}</div>
                                                    <div class="text-sm text-gray-500">${user.employee_code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-gray-600">${user.email}</td>
                                        <td>
                                            <span class="badge ${user.role === 'admin' ? 'badge-purple' : user.role === 'consultant' ? 'badge-primary' : 'badge-gray'}">
                                                ${Auth.getRoleDisplayName(user.role)}
                                            </span>
                                        </td>
                                        <td class="text-gray-600">${subcontractor ? subcontractor.name : '-'}</td>
                                        <td>
                                            ${user.role === 'consultant' ? `
                                                <span class="font-medium text-blue-600">${user.reward_points || 0} điểm</span>
                                            ` : '-'}
                                        </td>
                                        <td>
                                            <div class="flex gap-1">
                                                <button onclick="EmployeesPage.showEditModal(${user.id})" class="btn btn-sm btn-outline">Sửa</button>
                                                ${user.id !== Auth.getUser().id ? `
                                                    <button onclick="EmployeesPage.deleteUser(${user.id})" class="btn btn-sm btn-outline text-red-600 hover:bg-red-50">Xóa</button>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `;
        }).join('')}
                        </tbody>
                    </table>
                </div>

                ${filteredUsers.length === 0 ? `
                    <div class="card p-12 text-center mt-6">
                        <h3 class="empty-state-title">Không có nhân viên</h3>
                    </div>
                ` : ''}
            </main>
        `;
    },

    setFilter(filter) {
        this.filter = filter;
        App.renderContent();
    },

    showCreateModal() {
        const subcontractors = API.getSubcontractors();

        Modal.open({
            title: 'Thêm nhân viên',
            size: 'md',
            content: `
                <form id="employee-form">
                    <div class="form-group">
                        <label class="form-label">Họ và tên <span class="text-red-500">*</span></label>
                        <input type="text" name="name" class="form-input" placeholder="Nguyễn Văn A" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email <span class="text-red-500">*</span></label>
                        <input type="email" name="email" class="form-input" placeholder="email@company.com" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Mật khẩu <span class="text-red-500">*</span></label>
                        <input type="password" name="password" class="form-input" placeholder="Mật khẩu" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Số điện thoại</label>
                        <input type="tel" name="phone" class="form-input" placeholder="0901234567">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Vai trò <span class="text-red-500">*</span></label>
                        <select name="role" id="role-select" class="form-input form-select" required onchange="EmployeesPage.onRoleChange(this.value)">
                            <option value="consultant">Tư vấn phụ</option>
                            <option value="sales">Sales</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div class="form-group" id="subcontractor-group" style="display: none;">
                        <label class="form-label">Nhà thầu phụ <span class="text-red-500">*</span></label>
                        <select name="subcontractor_id" class="form-input form-select">
                            <option value="">Chọn nhà thầu</option>
                            ${subcontractors.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('')}
                        </select>
                    </div>
                </form>
            `,
            confirmText: 'Thêm',
            onConfirm: () => {
                const form = document.getElementById('employee-form');
                const formData = new FormData(form);

                if (!formData.get('name') || !formData.get('email') || !formData.get('password')) {
                    Toast.error('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
                    return false;
                }

                if (formData.get('role') === 'sales' && !formData.get('subcontractor_id')) {
                    Toast.error('Lỗi', 'Vui lòng chọn nhà thầu phụ cho Sales');
                    return false;
                }

                // Check duplicate email
                if (API.getUserByEmail(formData.get('email'))) {
                    Toast.error('Lỗi', 'Email đã tồn tại');
                    return false;
                }

                const users = API.getUsers();
                const code = 'NV' + String(users.length + 1).padStart(3, '0');

                API.createUser({
                    employee_code: code,
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    phone: formData.get('phone'),
                    role: formData.get('role'),
                    subcontractor_id: formData.get('subcontractor_id') ? parseInt(formData.get('subcontractor_id')) : null
                });

                Toast.success('Thành công', 'Đã thêm nhân viên');
                App.renderContent();
            }
        });
    },

    onRoleChange(role) {
        const subGroup = document.getElementById('subcontractor-group');
        if (subGroup) {
            subGroup.style.display = role === 'sales' ? 'block' : 'none';
        }
    },

    showEditModal(id) {
        const user = API.getUser(id);
        const subcontractors = API.getSubcontractors();

        Modal.open({
            title: 'Sửa thông tin nhân viên',
            size: 'md',
            content: `
                <form id="employee-form">
                    <div class="form-group">
                        <label class="form-label">Mã nhân viên</label>
                        <input type="text" class="form-input" value="${user.employee_code}" disabled>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Họ và tên <span class="text-red-500">*</span></label>
                        <input type="text" name="name" class="form-input" value="${user.name}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" value="${user.email}" disabled>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Số điện thoại</label>
                        <input type="tel" name="phone" class="form-input" value="${user.phone || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Vai trò</label>
                        <select name="role" class="form-input form-select" onchange="EmployeesPage.onRoleChange(this.value)">
                            <option value="consultant" ${user.role === 'consultant' ? 'selected' : ''}>Tư vấn phụ</option>
                            <option value="sales" ${user.role === 'sales' ? 'selected' : ''}>Sales</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </div>
                    <div class="form-group" id="subcontractor-group" style="display: ${user.role === 'sales' ? 'block' : 'none'};">
                        <label class="form-label">Nhà thầu phụ</label>
                        <select name="subcontractor_id" class="form-input form-select">
                            <option value="">Không có</option>
                            ${subcontractors.map(s => `<option value="${s.id}" ${user.subcontractor_id === s.id ? 'selected' : ''}>${s.code} - ${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Đặt lại mật khẩu</label>
                        <input type="password" name="new_password" class="form-input" placeholder="Để trống nếu không đổi">
                    </div>
                </form>
            `,
            confirmText: 'Lưu',
            onConfirm: () => {
                const form = document.getElementById('employee-form');
                const formData = new FormData(form);

                const updateData = {
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    role: formData.get('role'),
                    subcontractor_id: formData.get('subcontractor_id') ? parseInt(formData.get('subcontractor_id')) : null
                };

                if (formData.get('new_password')) {
                    updateData.password = formData.get('new_password');
                }

                API.updateUser(id, updateData);
                Toast.success('Thành công', 'Đã cập nhật nhân viên');
                App.renderContent();
            }
        });
    },

    deleteUser(id) {
        Modal.confirm({
            title: 'Xóa nhân viên?',
            message: 'Bạn có chắc muốn xóa nhân viên này?',
            type: 'danger',
            confirmText: 'Xóa',
            onConfirm: () => {
                API.deleteUser(id);
                Toast.success('Thành công', 'Đã xóa nhân viên');
                App.renderContent();
            }
        });
    }
};
