// App - Main application controller
const App = {
    init() {
        console.log('🚀 Initializing Contractor Sales Tracker...');

        // Initialize database with seed data
        initializeDatabase();

        // Load custom stages
        StageHelper.loadCustomStages();

        // Initialize auth
        Auth.init();

        // Initialize router
        Router.init();

        // Initial render
        this.render();

        console.log('✅ Application initialized successfully!');
    },

    render() {
        const appContainer = document.getElementById('app');

        if (!Auth.isLoggedIn()) {
            // Show login page
            appContainer.innerHTML = LoginPage.render();
            return;
        }

        // Show main layout
        appContainer.innerHTML = `
            <div class="app-layout">
                ${Sidebar.render()}
                <div class="main-content">
                    <div id="page-content">
                        ${this.renderPage()}
                    </div>
                </div>
            </div>
        `;
    },

    renderContent() {
        const pageContent = document.getElementById('page-content');
        const sidebarNav = document.querySelector('.sidebar nav ul');

        if (pageContent) {
            pageContent.innerHTML = this.renderPage();

            // Update sidebar active state
            if (sidebarNav && Auth.isLoggedIn()) {
                const user = Auth.getUser();
                const menuItems = Sidebar.getMenuItems(user.role);
                sidebarNav.innerHTML = menuItems.map(item => Sidebar.renderMenuItem(item)).join('');
            }
        } else {
            this.render();
        }
    },

    renderPage() {
        const route = Router.getRoute();
        const user = Auth.getUser();

        // Check permissions
        if (!this.checkPermission(route, user)) {
            return this.render403();
        }

        switch (route) {
            case 'dashboard':
                return DashboardPage.render();
            case 'projects':
                return ProjectsPage.render();
            case 'project-detail':
                return ProjectDetailPage.render(Router.getParam('id'));
            case 'subcontractors':
                return SubcontractorsPage.render();
            case 'employees':
                return EmployeesPage.render();
            case 'rewards':
                return RewardsPage.render();
            case 'notifications':
                return NotificationsPage.render();
            case '404':
            default:
                return this.render404();
        }
    },

    checkPermission(route, user) {
        if (!user) return false;

        const restrictedRoutes = {
            'dashboard': ['admin', 'consultant'],
            'subcontractors': ['admin'],
            'employees': ['admin'],
            'rewards': ['admin', 'consultant']
        };

        if (restrictedRoutes[route]) {
            return restrictedRoutes[route].includes(user.role);
        }

        return true;
    },

    render404() {
        return `
            ${Header.render('Không tìm thấy', [{ label: '404' }])}
            <main class="p-6">
                <div class="card p-12 text-center">
                    <div class="text-6xl mb-4">😕</div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Trang không tồn tại</h1>
                    <p class="text-gray-500 mb-6">Trang bạn đang tìm không tồn tại hoặc đã bị xóa</p>
                    <a href="#/dashboard" class="btn btn-primary">Về trang chủ</a>
                </div>
            </main>
        `;
    },

    render403() {
        return `
            ${Header.render('Không có quyền', [{ label: '403' }])}
            <main class="p-6">
                <div class="card p-12 text-center">
                    <div class="text-6xl mb-4">🔒</div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
                    <p class="text-gray-500 mb-6">Bạn không có quyền truy cập trang này</p>
                    <a href="#/projects" class="btn btn-primary">Về Dự án</a>
                </div>
            </main>
        `;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
