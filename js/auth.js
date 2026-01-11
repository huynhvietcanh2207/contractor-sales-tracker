// Auth - Authentication module
const Auth = {
    // Current user session
    currentUser: null,

    // Initialize auth
    init() {
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        return this.currentUser;
    },

    // Login
    login(email, password) {
        const user = API.getUserByEmail(email);

        if (!user) {
            return { success: false, message: 'Email không tồn tại trong hệ thống' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Mật khẩu không chính xác' };
        }

        if (!user.is_active) {
            return { success: false, message: 'Tài khoản đã bị vô hiệu hóa' };
        }

        // Save session
        this.currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));

        return { success: true, user: user };
    },

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
    },

    // Check if logged in
    isLoggedIn() {
        return this.currentUser !== null;
    },

    // Get current user
    getUser() {
        return this.currentUser;
    },

    // Check role
    hasRole(role) {
        return this.currentUser?.role === role;
    },

    // Check if admin
    isAdmin() {
        return this.hasRole('admin');
    },

    // Check if consultant
    isConsultant() {
        return this.hasRole('consultant');
    },

    // Check if sales
    isSales() {
        return this.hasRole('sales');
    },

    // Get role display name
    getRoleDisplayName(role) {
        const roles = {
            'admin': 'Quản trị viên',
            'consultant': 'Tư vấn phụ',
            'sales': 'Sales'
        };
        return roles[role] || role;
    },

    // Update profile
    updateProfile(data) {
        if (!this.currentUser) return false;

        const updated = API.updateUser(this.currentUser.id, data);
        if (updated) {
            this.currentUser = { ...this.currentUser, ...data };
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    },

    // Change password
    changePassword(oldPassword, newPassword) {
        if (!this.currentUser) {
            return { success: false, message: 'Chưa đăng nhập' };
        }

        if (this.currentUser.password !== oldPassword) {
            return { success: false, message: 'Mật khẩu cũ không chính xác' };
        }

        API.updateUser(this.currentUser.id, { password: newPassword });
        this.currentUser.password = newPassword;
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));

        return { success: true, message: 'Đổi mật khẩu thành công' };
    }
};
