// Login Page
const LoginPage = {
    render() {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4">
                <div class="w-full max-w-md">
                    <!-- Logo -->
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
                            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <h1 class="text-3xl font-bold text-white mb-2">Contractor Sales Tracker</h1>
                        <p class="text-white/70">Hệ thống Quản lý Tiến độ Sales & Nhà thầu</p>
                    </div>

                    <!-- Login Card -->
                    <div class="card p-8 animate-slide-in-up">
                        <h2 class="text-xl font-semibold text-gray-900 mb-6">Đăng nhập</h2>

                        <form id="login-form" onsubmit="LoginPage.handleSubmit(event)">
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" name="email" class="form-input" placeholder="Nhập email của bạn" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Mật khẩu</label>
                                <div class="relative">
                                    <input type="password" name="password" id="password-input" class="form-input pr-10" placeholder="Nhập mật khẩu" required>
                                    <button type="button" onclick="LoginPage.togglePassword()" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div id="login-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"></div>

                            <button type="submit" class="btn btn-primary w-full" id="login-btn">
                                Đăng nhập
                            </button>
                        </form>

                        <!-- Demo Accounts -->
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <p class="text-sm text-gray-500 mb-3">Tài khoản demo:</p>
                            <div class="space-y-2">
                                <button onclick="LoginPage.fillDemo('admin@company.com', '123456')" class="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                    <span class="font-medium text-gray-900">Admin</span>
                                    <span class="text-gray-500 ml-2">admin@company.com</span>
                                </button>
                                <button onclick="LoginPage.fillDemo('consultant1@company.com', '123456')" class="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                    <span class="font-medium text-gray-900">Tư vấn phụ</span>
                                    <span class="text-gray-500 ml-2">consultant1@company.com</span>
                                </button>
                                <button onclick="LoginPage.fillDemo('sales1@company.com', '123456')" class="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                    <span class="font-medium text-gray-900">Sales</span>
                                    <span class="text-gray-500 ml-2">sales1@company.com</span>
                                </button>
                            </div>
                            <p class="text-xs text-gray-400 mt-2">Mật khẩu: 123456</p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <p class="text-center text-white/50 text-sm mt-6">
                        © 2026 Contractor Sales Tracker. All rights reserved.
                    </p>
                </div>
            </div>
        `;
    },

    handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        const errorDiv = document.getElementById('login-error');
        const btn = document.getElementById('login-btn');

        // Show loading
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner"></div> Đang đăng nhập...';
        errorDiv.classList.add('hidden');

        // Simulate API delay
        setTimeout(() => {
            const result = Auth.login(email, password);

            if (result.success) {
                Toast.success('Đăng nhập thành công', `Chào mừng ${result.user.name}!`);

                // Redirect based on role
                if (result.user.role === 'sales') {
                    window.location.hash = '#/projects';
                } else {
                    window.location.hash = '#/dashboard';
                }

                App.render();
            } else {
                errorDiv.textContent = result.message;
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = 'Đăng nhập';
            }
        }, 500);
    },

    togglePassword() {
        const input = document.getElementById('password-input');
        const icon = document.getElementById('eye-icon');

        if (input.type === 'password') {
            input.type = 'text';
            icon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
            `;
        } else {
            input.type = 'password';
            icon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            `;
        }
    },

    fillDemo(email, password) {
        document.querySelector('input[name="email"]').value = email;
        document.querySelector('input[name="password"]').value = password;
    }
};
