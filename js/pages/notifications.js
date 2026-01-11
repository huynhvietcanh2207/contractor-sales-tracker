// Notifications Page
const NotificationsPage = {
    filter: 'all',

    render() {
        const user = Auth.getUser();
        const notifications = API.getNotifications(user.id);
        const filteredNotifications = this.filter === 'unread'
            ? notifications.filter(n => !n.read_at)
            : notifications;
        const unreadCount = notifications.filter(n => !n.read_at).length;

        return `
            ${Header.render('Thông báo', [{ label: 'Thông báo' }])}
            
            <main class="p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Thông báo</h1>
                        <p class="text-gray-500">Bạn có ${unreadCount} thông báo chưa đọc</p>
                    </div>
                    ${unreadCount > 0 ? `
                        <button onclick="NotificationsPage.markAllRead()" class="btn btn-secondary">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Đánh dấu tất cả đã đọc
                        </button>
                    ` : ''}
                </div>

                <!-- Tabs -->
                <div class="flex gap-4 mb-6 border-b border-gray-200">
                    <button onclick="NotificationsPage.setFilter('all')" class="px-4 py-2 text-sm font-medium border-b-2 ${this.filter === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}">
                        Tất cả (${notifications.length})
                    </button>
                    <button onclick="NotificationsPage.setFilter('unread')" class="px-4 py-2 text-sm font-medium border-b-2 ${this.filter === 'unread' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}">
                        Chưa đọc (${unreadCount})
                    </button>
                </div>

                <!-- Notifications List -->
                <div class="card divide-y divide-gray-100">
                    ${filteredNotifications.length > 0 ? filteredNotifications.map(n => `
                        <div class="p-4 hover:bg-gray-50 cursor-pointer ${n.read_at ? '' : 'bg-blue-50'}" 
                             onclick="NotificationsPage.onNotificationClick(${n.id}, '${n.data?.project_id || ''}')">
                            <div class="flex gap-4">
                                <div class="w-10 h-10 rounded-full ${this.getNotificationIconBg(n.type)} flex items-center justify-center flex-shrink-0">
                                    ${this.getNotificationIcon(n.type)}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-start justify-between gap-4">
                                        <div>
                                            <p class="font-medium text-gray-900">${n.title}</p>
                                            <p class="text-sm text-gray-600 mt-1">${n.message}</p>
                                        </div>
                                        ${!n.read_at ? '<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>' : ''}
                                    </div>
                                    <p class="text-xs text-gray-400 mt-2">${Utils.formatDate(n.created_at, 'relative')}</p>
                                </div>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="p-12 text-center">
                            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Không có thông báo</h3>
                            <p class="text-gray-500">Bạn sẽ nhận được thông báo khi có cập nhật mới</p>
                        </div>
                    `}
                </div>
            </main>
        `;
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
            'lead_assigned': `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>`,
            'stage_changed': `<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`,
            'project_won': `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
            'reward_added': `<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
        };
        return icons[type] || `<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    },

    setFilter(filter) {
        this.filter = filter;
        App.renderContent();
    },

    markAllRead() {
        const user = Auth.getUser();
        API.markAllNotificationsAsRead(user.id);
        Toast.success('Thành công', 'Đã đánh dấu tất cả đã đọc');
        App.renderContent();
    },

    onNotificationClick(notificationId, projectId) {
        API.markNotificationAsRead(notificationId);
        if (projectId) {
            window.location.hash = `#/projects/${projectId}`;
        } else {
            App.renderContent();
        }
    }
};
