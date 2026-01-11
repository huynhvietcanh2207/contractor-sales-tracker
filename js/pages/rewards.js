// Rewards Page
const RewardsPage = {
    selectedYear: new Date().getFullYear(),

    render() {
        const user = Auth.getUser();
        const leaderboard = API.getLeaderboard(this.selectedYear);
        const transactions = API.getRewardTransactions({ year: this.selectedYear });
        const years = [2024, 2025, 2026];

        return `
            ${Header.render('Thưởng', [{ label: 'Thưởng' }])}
            
            <main class="p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Bảng xếp hạng & Thưởng</h1>
                        <p class="text-gray-500">Điểm thưởng và xếp hạng tư vấn phụ</p>
                    </div>
                    <select class="form-input form-select w-32" onchange="RewardsPage.setYear(this.value)">
                        ${years.map(y => `<option value="${y}" ${this.selectedYear === y ? 'selected' : ''}>${y}</option>`).join('')}
                    </select>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Leaderboard -->
                    <div class="lg:col-span-2">
                        <div class="card p-6">
                            <h2 class="text-lg font-semibold text-gray-900 mb-6">🏆 Bảng xếp hạng ${this.selectedYear}</h2>
                            
                            ${leaderboard.length > 0 ? `
                                <!-- Top 3 -->
                                <div class="grid grid-cols-3 gap-4 mb-8">
                                    ${this.renderTopThree(leaderboard)}
                                </div>

                                <!-- Rest of leaderboard -->
                                <div class="space-y-3">
                                    ${leaderboard.slice(3).map((u, index) => `
                                        <div class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                            <div class="w-8 text-center text-gray-400 font-medium">#${index + 4}</div>
                                            <div class="avatar avatar-sm ${Utils.getAvatarColor(u.name)}">
                                                ${Utils.getInitials(u.name)}
                                            </div>
                                            <div class="flex-1">
                                                <p class="font-medium text-gray-900">${u.name}</p>
                                                <p class="text-sm text-gray-500">${u.deals_won} deals thắng</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="font-bold text-blue-600">${u.year_points}</p>
                                                <p class="text-xs text-gray-500">điểm</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="text-center py-8 text-gray-500">
                                    <p>Chưa có dữ liệu cho năm ${this.selectedYear}</p>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Stats & Recent Transactions -->
                    <div class="space-y-6">
                        <!-- Quick Stats -->
                        <div class="card p-6">
                            <h3 class="font-semibold text-gray-900 mb-4">📊 Thống kê ${this.selectedYear}</h3>
                            <div class="space-y-4">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Tổng điểm đã phát</span>
                                    <span class="font-bold text-blue-600">${transactions.reduce((sum, t) => sum + t.points, 0)}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Deal thắng</span>
                                    <span class="font-bold text-green-600">${transactions.filter(t => t.type === 'deal_won').length}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Bonus</span>
                                    <span class="font-bold text-purple-600">${transactions.filter(t => t.type === 'bonus').length}</span>
                                </div>
                            </div>
                        </div>

                        <!-- My Points (for consultant) -->
                        ${user.role === 'consultant' ? `
                            <div class="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <h3 class="font-semibold mb-2">Điểm của bạn</h3>
                                <p class="text-4xl font-bold mb-2">${user.reward_points || 0}</p>
                                <p class="text-blue-100 text-sm">Tổng điểm tích lũy</p>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Transaction History -->
                <div class="mt-6">
                    <div class="card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4">📋 Lịch sử điểm thưởng</h2>
                        
                        ${transactions.length > 0 ? `
                            <div class="table-container">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Ngày</th>
                                            <th>Tư vấn</th>
                                            <th>Loại</th>
                                            <th>Mô tả</th>
                                            <th class="text-right">Điểm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${transactions.slice(0, 20).map(t => {
            const u = API.getUser(t.user_id);
            return `
                                                <tr>
                                                    <td class="text-gray-500">${Utils.formatDate(t.created_at)}</td>
                                                    <td>
                                                        <div class="flex items-center gap-2">
                                                            <div class="avatar avatar-sm ${Utils.getAvatarColor(u?.name)}">
                                                                ${Utils.getInitials(u?.name)}
                                                            </div>
                                                            <span class="font-medium">${u?.name || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span class="badge ${t.type === 'deal_won' ? 'badge-success' : t.type === 'bonus' ? 'badge-purple' : 'badge-gray'}">
                                                            ${t.type === 'deal_won' ? 'Deal thắng' : t.type === 'bonus' ? 'Thưởng' : t.type}
                                                        </span>
                                                    </td>
                                                    <td class="text-gray-600">${t.description}</td>
                                                    <td class="text-right font-bold ${t.points > 0 ? 'text-green-600' : 'text-red-600'}">
                                                        ${t.points > 0 ? '+' : ''}${t.points}
                                                    </td>
                                                </tr>
                                            `;
        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : `
                            <div class="text-center py-8 text-gray-500">
                                <p>Chưa có lịch sử điểm thưởng cho năm ${this.selectedYear}</p>
                            </div>
                        `}
                    </div>
                </div>
            </main>
        `;
    },

    renderTopThree(leaderboard) {
        const positions = [
            { index: 1, medal: '🥈', bg: 'bg-gray-100', order: 'order-1' },
            { index: 0, medal: '🥇', bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200', order: 'order-0 scale-110', isFirst: true },
            { index: 2, medal: '🥉', bg: 'bg-orange-50', order: 'order-2' }
        ];

        return positions.map(pos => {
            const u = leaderboard[pos.index];
            if (!u) return `<div class="${pos.order}"></div>`;

            return `
                <div class="text-center ${pos.order}">
                    <div class="${pos.bg} rounded-xl p-4 ${pos.isFirst ? 'shadow-lg' : ''}">
                        <div class="text-3xl mb-2">${pos.medal}</div>
                        <div class="avatar avatar-lg ${Utils.getAvatarColor(u.name)} mx-auto mb-2">
                            ${Utils.getInitials(u.name)}
                        </div>
                        <h4 class="font-semibold text-gray-900">${u.name}</h4>
                        <p class="text-sm text-gray-500">${u.deals_won} deals</p>
                        <p class="text-xl font-bold text-blue-600 mt-1">${u.year_points}</p>
                        <p class="text-xs text-gray-400">điểm</p>
                    </div>
                </div>
            `;
        }).join('');
    },

    setYear(year) {
        this.selectedYear = parseInt(year);
        App.renderContent();
    }
};
