// Header Component
const Header = {
    render(title = '', breadcrumbs = []) {
        const user = Auth.getUser();
        if (!user) return '';

        const unreadCount = API.getUnreadNotifications(user.id).length;

        return `
            <header class="bg-white border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <!-- Left: Mobile menu + Breadcrumb -->
                    <div class="flex items-center gap-4">
                        <!-- Mobile menu button -->
                        <button onclick="Sidebar.openMobile()" class="btn-icon btn-secondary lg:hidden">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>

                        <!-- Breadcrumb -->
                        <nav class="flex items-center gap-2 text-sm">
                            <a href="#/dashboard" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                            </a>
                            ${breadcrumbs.map((item, index) => `
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                                ${item.href
                ? `<a href="${item.href}" class="text-gray-500 hover:text-gray-700">${item.label}</a>`
                : `<span class="text-gray-900 font-medium">${item.label}</span>`
            }
                            `).join('')}
                        </nav>
                    </div>

                    <!-- Right: Actions -->
                    <div class="flex items-center gap-3">
                        <!-- Notifications -->
                        <div class="dropdown relative" id="notification-dropdown">
                            <button onclick="Header.toggleNotifications()" class="btn-icon btn-secondary relative">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                                ${unreadCount > 0 ? `<span class="notification-badge">${unreadCount}</span>` : ''}
                            </button>
                            <div class="dropdown-menu w-80">
                                <div class="px-3 py-2 border-b border-gray-100">
                                    <div class="flex items-center justify-between">
                                        <span class="font-semibold text-gray-900">Thông báo</span>
                                        ${unreadCount > 0 ? `
                                            <button onclick="Header.markAllRead()" class="text-xs text-blue-600 hover:text-blue-700">
                                                Đánh dấu đã đọc
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="max-h-80 overflow-y-auto" id="notification-list">
                                    ${this.renderNotificationList()}
                                </div>
                                <div class="px-3 py-2 border-t border-gray-100">
                                    <a href="#/notifications" class="text-sm text-blue-600 hover:text-blue-700">
                                        Xem tất cả
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- User dropdown -->
                        <div class="dropdown relative" id="user-dropdown">
                            <button onclick="Header.toggleUserMenu()" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div class="avatar avatar-sm ${Utils.getAvatarColor(user.name)}">
                                    ${Utils.getInitials(user.name)}
                                </div>
                                <span class="text-sm font-medium text-gray-700 hidden sm:block">${user.name}</span>
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div class="dropdown-menu">
                                <div class="px-3 py-2 border-b border-gray-100">
                                    <p class="text-sm font-medium text-gray-900">${user.name}</p>
                                    <p class="text-xs text-gray-500">${user.email}</p>
                                </div>
                                <div class="dropdown-item" onclick="Header.showProfile()">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Thông tin cá nhân
                                </div>
                                <div class="dropdown-divider"></div>
                                <div class="dropdown-item text-red-600" onclick="Header.logout()">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    Đăng xuất
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        `;
    },

    renderNotificationList() {
        const user = Auth.getUser();
        const notifications = API.getNotifications(user.id).slice(0, 5);

        if (notifications.length === 0) {
            return `
                <div class="px-4 py-8 text-center text-gray-500">
                    <svg class="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <p class="text-sm">Không có thông báo</p>
                </div>
            `;
        }

        return notifications.map(n => `
            <div class="px-3 py-2 hover:bg-gray-50 cursor-pointer ${n.read_at ? '' : 'bg-blue-50'}" 
                 onclick="Header.onNotificationClick(${n.id}, '${n.data?.project_id || ''}')">
                <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full ${this.getNotificationIconBg(n.type)} flex items-center justify-center flex-shrink-0">
                        ${this.getNotificationIcon(n.type)}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900">${n.title}</p>
                        <p class="text-xs text-gray-500 truncate">${n.message}</p>
                        <p class="text-xs text-gray-400 mt-1">${Utils.formatDate(n.created_at, 'relative')}</p>
                    </div>
                    ${!n.read_at ? '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>' : ''}
                </div>
            </div>
        `).join('');
    },

    getNotificationIconBg(type) {
        const bgs = {
            'lead_assigned': 'bg-blue-100',
            'stage_changed': 'bg-yellow-100',
            'project_won': 'bg-green-100',
            'reward_added': 'bg-purple-100'
        };
        return bgs[type] || 'bg-gray-100';
    },

    getNotificationIcon(type) {
        const icons = {
            'lead_assigned': `<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>`,
            'stage_changed': `<svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`,
            'project_won': `<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
            'reward_added': `<svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
        };
        return icons[type] || `<svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    },

    toggleNotifications() {
        const dropdown = document.getElementById('notification-dropdown');
        dropdown?.classList.toggle('open');
        document.getElementById('user-dropdown')?.classList.remove('open');
    },

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        dropdown?.classList.toggle('open');
        document.getElementById('notification-dropdown')?.classList.remove('open');
    },

    closeDropdowns() {
        document.getElementById('notification-dropdown')?.classList.remove('open');
        document.getElementById('user-dropdown')?.classList.remove('open');
    },

    markAllRead() {
        const user = Auth.getUser();
        API.markAllNotificationsAsRead(user.id);
        this.refreshNotifications();
        Toast.success('Thành công', 'Đã đánh dấu tất cả đã đọc');
    },

    onNotificationClick(notificationId, projectId) {
        API.markNotificationAsRead(notificationId);
        this.closeDropdowns();
        if (projectId) {
            window.location.hash = `#/projects/${projectId}`;
        }
    },

    refreshNotifications() {
        const list = document.getElementById('notification-list');
        if (list) {
            list.innerHTML = this.renderNotificationList();
        }
        // Update sidebar badge
        App.render();
    },

    showProfile() {
        this.closeDropdowns();
        const user = Auth.getUser();

        Modal.open({
            title: 'Thông tin cá nhân',
            size: 'md',
            content: `
                <form id="profile-form">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="avatar avatar-xl ${Utils.getAvatarColor(user.name)}">
                            ${Utils.getInitials(user.name)}
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold">${user.name}</h3>
                            <p class="text-gray-500">${Auth.getRoleDisplayName(user.role)}</p>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mã nhân viên</label>
                        <input type="text" class="form-input" value="${user.employee_code}" disabled>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Họ và tên</label>
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
                </form>
            `,
            confirmText: 'Lưu thay đổi',
            onConfirm: () => {
                const form = document.getElementById('profile-form');
                const formData = new FormData(form);
                Auth.updateProfile({
                    name: formData.get('name'),
                    phone: formData.get('phone')
                });
                Toast.success('Thành công', 'Đã cập nhật thông tin');
                App.render();
            }
        });
    },

    logout() {
        this.closeDropdowns();
        Modal.confirm({
            title: 'Đăng xuất',
            message: 'Bạn có chắc muốn đăng xuất khỏi hệ thống?',
            type: 'warning',
            confirmText: 'Đăng xuất',
            onConfirm: () => {
                Auth.logout();
                App.render();
                Toast.info('Đã đăng xuất', 'Hẹn gặp lại!');
            }
        });
    }
};

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        Header.closeDropdowns();
    }
});
