// Subcontractors Page
const SubcontractorsPage = {
    render() {
        const user = Auth.getUser();
        const subcontractors = API.getSubcontractors();

        return `
            ${Header.render('Nhà thầu phụ', [{ label: 'Nhà thầu phụ' }])}
            
            <main class="p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Quản lý Nhà thầu phụ</h1>
                        <p class="text-gray-500">Danh sách các nhà thầu phụ trong hệ thống</p>
                    </div>
                    <button onclick="SubcontractorsPage.showCreateModal()" class="btn btn-primary">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Thêm nhà thầu
                    </button>
                </div>

                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Tên nhà thầu</th>
                                <th>Liên hệ</th>
                                <th>Cấp độ</th>
                                <th>Leads</th>
                                <th>Win Rate</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subcontractors.map(sub => {
            const stats = API.getSubcontractorStats(sub.id);
            return `
                                    <tr>
                                        <td class="font-medium text-gray-900">${sub.code}</td>
                                        <td>
                                            <div class="font-medium text-gray-900">${sub.name}</div>
                                            <div class="text-sm text-gray-500">${sub.email || ''}</div>
                                        </td>
                                        <td>
                                            <div class="text-gray-900">${sub.contact_person || 'N/A'}</div>
                                            <div class="text-sm text-gray-500">${sub.phone || ''}</div>
                                        </td>
                                        <td>
                                            <span class="badge ${StatusHelper.getRelationshipLevelColor(sub.relationship_level)}">
                                                ${StatusHelper.getRelationshipLevelName(sub.relationship_level)}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="text-sm">
                                                <span class="text-green-600">${stats.won}W</span> / 
                                                <span class="text-red-600">${stats.lost}L</span> / 
                                                <span class="text-blue-600">${stats.active}A</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="flex items-center gap-2">
                                                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-20">
                                                    <div class="h-full bg-green-500 rounded-full" style="width: ${stats.win_rate}%"></div>
                                                </div>
                                                <span class="text-sm font-medium ${stats.win_rate >= 50 ? 'text-green-600' : 'text-gray-600'}">${stats.win_rate}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="flex gap-1">
                                                <button onclick="SubcontractorsPage.showEditModal(${sub.id})" class="btn btn-sm btn-outline">Sửa</button>
                                                <button onclick="SubcontractorsPage.deleteSubcontractor(${sub.id})" class="btn btn-sm btn-outline text-red-600 hover:bg-red-50">Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
        }).join('')}
                        </tbody>
                    </table>
                </div>

                ${subcontractors.length === 0 ? `
                    <div class="card p-12 text-center mt-6">
                        <div class="empty-state-icon">
                            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <h3 class="empty-state-title">Chưa có nhà thầu phụ</h3>
                        <p class="empty-state-text">Thêm nhà thầu phụ để bắt đầu</p>
                    </div>
                ` : ''}
            </main>
        `;
    },

    showCreateModal() {
        Modal.open({
            title: 'Thêm nhà thầu phụ',
            size: 'md',
            content: `
                <form id="subcontractor-form">
                    <div class="form-group">
                        <label class="form-label">Mã nhà thầu <span class="text-red-500">*</span></label>
                        <input type="text" name="code" class="form-input" placeholder="VD: TP05" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tên nhà thầu <span class="text-red-500">*</span></label>
                        <input type="text" name="name" class="form-input" placeholder="Tên công ty" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Người liên hệ</label>
                        <input type="text" name="contact_person" class="form-input" placeholder="Họ tên người liên hệ">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Số điện thoại</label>
                        <input type="tel" name="phone" class="form-input" placeholder="0901234567">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" class="form-input" placeholder="email@company.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Cấp độ quan hệ</label>
                        <select name="relationship_level" class="form-input form-select">
                            ${StatusHelper.relationshipLevels.map(l => `<option value="${l.code}">${l.name}</option>`).join('')}
                        </select>
                    </div>
                </form>
            `,
            confirmText: 'Thêm',
            onConfirm: () => {
                const form = document.getElementById('subcontractor-form');
                const formData = new FormData(form);

                if (!formData.get('code') || !formData.get('name')) {
                    Toast.error('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
                    return false;
                }

                API.createSubcontractor({
                    code: formData.get('code'),
                    name: formData.get('name'),
                    contact_person: formData.get('contact_person'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    relationship_level: formData.get('relationship_level')
                });

                Toast.success('Thành công', 'Đã thêm nhà thầu phụ');
                App.renderContent();
            }
        });
    },

    showEditModal(id) {
        const sub = API.getSubcontractor(id);

        Modal.open({
            title: 'Sửa nhà thầu phụ',
            size: 'md',
            content: `
                <form id="subcontractor-form">
                    <div class="form-group">
                        <label class="form-label">Mã nhà thầu</label>
                        <input type="text" name="code" class="form-input" value="${sub.code}" disabled>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tên nhà thầu <span class="text-red-500">*</span></label>
                        <input type="text" name="name" class="form-input" value="${sub.name}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Người liên hệ</label>
                        <input type="text" name="contact_person" class="form-input" value="${sub.contact_person || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Số điện thoại</label>
                        <input type="tel" name="phone" class="form-input" value="${sub.phone || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" class="form-input" value="${sub.email || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Cấp độ quan hệ</label>
                        <select name="relationship_level" class="form-input form-select">
                            ${StatusHelper.relationshipLevels.map(l => `<option value="${l.code}" ${sub.relationship_level === l.code ? 'selected' : ''}>${l.name}</option>`).join('')}
                        </select>
                    </div>
                </form>
            `,
            confirmText: 'Lưu',
            onConfirm: () => {
                const form = document.getElementById('subcontractor-form');
                const formData = new FormData(form);

                API.updateSubcontractor(id, {
                    name: formData.get('name'),
                    contact_person: formData.get('contact_person'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    relationship_level: formData.get('relationship_level')
                });

                Toast.success('Thành công', 'Đã cập nhật nhà thầu phụ');
                App.renderContent();
            }
        });
    },

    deleteSubcontractor(id) {
        Modal.confirm({
            title: 'Xóa nhà thầu phụ?',
            message: 'Bạn có chắc muốn xóa nhà thầu này?',
            type: 'danger',
            confirmText: 'Xóa',
            onConfirm: () => {
                API.deleteSubcontractor(id);
                Toast.success('Thành công', 'Đã xóa nhà thầu phụ');
                App.renderContent();
            }
        });
    }
};
