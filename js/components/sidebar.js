// Sidebar Component
const Sidebar = {
    isCollapsed: false,
    isMobileOpen: false,

    render() {
        const user = Auth.getUser();
        if (!user) return '';

        const menuItems = this.getMenuItems(user.role);

        return `
            <aside class="sidebar bg-gray-900 text-white flex flex-col" id="sidebar">
                <!-- Logo -->
                <div class="p-4 border-b border-gray-800">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <div class="sidebar-text">
                            <h1 class="font-bold text-lg">Sales Tracker</h1>
                            <p class="text-xs text-gray-400">Quản lý Nhà thầu</p>
                        </div>
                    </div>
                </div>

                <!-- Menu -->
                <nav class="flex-1 p-4 overflow-y-auto">
                    <ul class="space-y-1">
                        ${menuItems.map(item => this.renderMenuItem(item)).join('')}
                    </ul>
                </nav>

                <!-- User Info -->
                <div class="p-4 border-t border-gray-800">
                    <div class="flex items-center gap-3">
                        <div class="avatar ${Utils.getAvatarColor(user.name)}">
                            ${Utils.getInitials(user.name)}
                        </div>
                        <div class="sidebar-text flex-1 min-w-0">
                            <p class="font-medium text-sm truncate">${user.name}</p>
                            <p class="text-xs text-gray-400">${Auth.getRoleDisplayName(user.role)}</p>
                        </div>
                        <button onclick="Sidebar.toggleCollapse()" class="btn-icon text-gray-400 hover:text-white hidden lg:flex">
                            <svg class="w-5 h-5 transition-transform ${this.isCollapsed ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- Mobile Overlay -->
            <div class="sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${this.isMobileOpen ? '' : 'hidden'}" onclick="Sidebar.closeMobile()"></div>
        `;
    },

    getMenuItems(role) {
        const allItems = [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>`,
                href: '#/dashboard',
                roles: ['admin', 'consultant']
            },
            {
                id: 'projects',
                label: 'Dự án',
                icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`,
                href: '#/projects',
                roles: ['admin', 'consultant', 'sales']
            },
            {
                id: 'subcontractors',
                label: 'Nhà thầu phụ',
                icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`,
                href: '#/subcontractors',
                roles: ['admin']
            },
            {
                id: 'employees',
                label: 'Nhân sự',
                icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
                href: '#/employees',
                roles: ['admin']
            },
            {
                id: 'rewards',
                label: 'Thưởng',
                icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`,
                href: '#/rewards',
                roles: ['admin', 'consultant']
            },
            {
                id: 'notifications',
                label: 'Thông báo',
                icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>`,
                href: '#/notifications',
                roles: ['admin', 'consultant', 'sales'],
                badge: () => {
                    const count = API.getUnreadNotifications(Auth.getUser()?.id).length;
                    return count > 0 ? count : null;
                }
            },
        ];

        return allItems.filter(item => item.roles.includes(role));
    },

    renderMenuItem(item) {
        const currentHash = window.location.hash || '#/dashboard';
        // Extract the base route (e.g., #/projects from #/projects/123)
        const currentRoute = currentHash.split('/').slice(0, 2).join('/');
        const itemRoute = item.href.split('/').slice(0, 2).join('/');
        const isActive = currentRoute === itemRoute;
        const badge = item.badge ? item.badge() : null;

        return `
            <li>
                <a href="${item.href}" 
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'}">
                    ${item.icon}
                    <span class="sidebar-text flex-1">${item.label}</span>
                    ${badge ? `<span class="notification-badge">${badge}</span>` : ''}
                </a>
            </li>
        `;
    },

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        if (this.isCollapsed) {
            sidebar?.classList.add('collapsed');
            mainContent?.classList.add('expanded');
            document.querySelectorAll('.sidebar-text').forEach(el => el.classList.add('hidden'));
        } else {
            sidebar?.classList.remove('collapsed');
            mainContent?.classList.remove('expanded');
            document.querySelectorAll('.sidebar-text').forEach(el => el.classList.remove('hidden'));
        }
    },

    openMobile() {
        this.isMobileOpen = true;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar?.classList.add('open');
        overlay?.classList.remove('hidden');
    },

    closeMobile() {
        this.isMobileOpen = false;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar?.classList.remove('open');
        overlay?.classList.add('hidden');
    }
};
