// Dashboard Page
const DashboardPage = {
    render() {
        const user = Auth.getUser();
        const stats = this.getStats();
        const leads = API.getActiveLeads();
        const allLeads = API.getLeads();
        const projects = API.getProjects({ status: 'active' });

        return `
            ${Header.render('Dashboard', [{ label: 'Dashboard' }])}
            
            <main class="p-6">
                <!-- Welcome -->
                <div class="mb-6">
                    <h1 class="text-2xl font-bold text-gray-900">Xin chào, ${user.name}! 👋</h1>
                    <p class="text-gray-500">Đây là tổng quan hoạt động hôm nay</p>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    ${this.renderStatCard('Dự án Active', stats.activeProjects, 'bg-gradient-to-br from-blue-500 to-blue-600', `
                        <svg class="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    `)}
                    ${this.renderStatCard('Thầu tham gia', stats.activeLeads, 'bg-gradient-to-br from-green-500 to-green-600', `
                        <svg class="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    `)}
                    ${this.renderStatCard('Deal Won', stats.wonDeals, 'bg-gradient-to-br from-yellow-500 to-orange-500', `
                        <svg class="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    `)}
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <!-- Top Subcontractors Chart -->
                    <div class="card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-6"> Top Nhà thầu phụ</h2>
                        <div class="space-y-4">
                            ${this.renderTopSubcontractors(allLeads).map((item, index) => {
            const maxCount = this.renderTopSubcontractors(allLeads)[0]?.count || 1;
            const widthPercent = (item.count / maxCount) * 100;
            const colors = [
                'bg-gradient-to-r from-teal-400 to-teal-500',
                'bg-gradient-to-r from-cyan-400 to-cyan-500',
                'bg-gradient-to-r from-blue-400 to-blue-500',
                'bg-gradient-to-r from-indigo-400 to-indigo-500',
                'bg-gradient-to-r from-purple-400 to-purple-500'
            ];
            const delay = index * 100; // Stagger animation
            return `
                                    <div class="animate-fade-in" style="animation-delay: ${delay}ms">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-sm font-medium text-gray-700">${item.name}</span>
                                            <span class="text-sm font-semibold text-gray-900">${item.count}</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-lg h-8 overflow-hidden">
                                            <div class="${colors[index % colors.length]} h-full rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-3 animate-slide-in-right" style="width: ${widthPercent}%; animation-delay: ${delay}ms">
                                                <span class="text-xs font-semibold text-white opacity-0 animate-fade-in" style="animation-delay: ${delay + 500}ms">${item.count} deals</span>
                                            </div>
                                        </div>
                                    </div>
                                `;
        }).join('')}
                        </div>
                        <div class="mt-4 text-center text-xs text-gray-500 animate-fade-in" style="animation-delay: 600ms">
                            Top 5 nhà thầu có nhiều deals nhất
                        </div>
                    </div>

                    <!-- Lead Status Pie Chart (CSS only) -->
                    <div class="card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-6"> Tình trạng Thầu phụ</h2>
                        <div class="flex items-center justify-center animate-scale-in">
                            ${this.renderPieChart(stats)}
                        </div>
                        <div class="mt-6 space-y-2">
                            <div class="flex items-center justify-between text-sm animate-fade-in" style="animation-delay: 200ms">
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span class="text-gray-700">Đang hoạt động</span>
                                </div>
                                <span class="font-semibold text-gray-900">${stats.activeLeads}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm animate-fade-in" style="animation-delay: 300ms">
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span class="text-gray-700">Đã thắng</span>
                                </div>
                                <span class="font-semibold text-gray-900">${stats.wonDeals}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm animate-fade-in" style="animation-delay: 400ms">
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full bg-gray-400"></div>
                                    <span class="text-gray-700">Đã thua</span>
                                </div>
                                <span class="font-semibold text-gray-900">${stats.lostDeals || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-6">
                    <!-- Project Heat Map - Grid Layout -->
                    <div class="card p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-lg font-semibold text-gray-900"> Tình hình Dự án</h2>
                            <a href="#/projects" class="text-sm text-blue-600 hover:text-blue-700">Xem tất cả →</a>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${projects.slice(0, 12).map(project => this.renderProjectDetailCard(project, allLeads)).join('')}
                            ${projects.length === 0 ? `
                                <div class="col-span-full text-center py-8 text-gray-500">
                                    <p>Không có dự án active</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="mt-6">
                    <div class="card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4"> Hoạt động gần đây</h2>
                        <div class="space-y-4">
                            ${this.renderRecentActivity()}
                        </div>
                    </div>
                </div>
            </main>
        `;
    },

    getStats() {
        const user = Auth.getUser();
        const projects = API.getProjects();
        const leads = API.getLeads();

        // Filter if not admin
        const filteredLeads = user.role === 'admin' ? leads : Permissions.filterLeadsForUser(leads, user);
        const filteredProjects = user.role === 'admin' ? projects : Permissions.filterProjectsForUser(projects, filteredLeads, user);

        const activeLeads = filteredLeads.filter(l => l.status === 'active');
        const wonLeads = filteredLeads.filter(l => l.status === 'won');
        const lostLeads = filteredLeads.filter(l => l.status === 'lost');
        const closedLeads = filteredLeads.filter(l => l.status !== 'active');
        const winRate = closedLeads.length > 0 ? Math.round((wonLeads.length / closedLeads.length) * 100) : 0;

        const byStage = {};
        StageHelper.stages.forEach(s => {
            byStage[s.code] = activeLeads.filter(l => l.current_stage === s.code).length;
        });

        return {
            activeProjects: filteredProjects.filter(p => p.status === 'active').length,
            activeLeads: activeLeads.length,
            wonDeals: wonLeads.length,
            lostDeals: lostLeads.length,
            winRate: winRate,
            byStage: byStage
        };
    },

    renderStatCard(title, value, bgClass, icon) {
        return `
            <div class="stat-card card ${bgClass} p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white/80 text-sm">${title}</p>
                        <p class="text-3xl font-bold mt-1">${value}</p>
                    </div>
                    ${icon}
                </div>
            </div>
        `;
    },

    renderPieChart(stats) {
        const total = stats.activeLeads + stats.wonDeals + stats.lostDeals;
        if (total === 0) {
            return '<div class="text-gray-400 text-sm">Chưa có dữ liệu</div>';
        }

        const activePercent = (stats.activeLeads / total) * 100;
        const wonPercent = (stats.wonDeals / total) * 100;
        const lostPercent = (stats.lostDeals / total) * 100;

        // Create donut chart with conic-gradient
        return `
            <div class="relative w-48 h-48">
                <div class="w-full h-full rounded-full" style="background: conic-gradient(
                    from 0deg,
                    #3b82f6 0% ${activePercent}%,
                    #10b981 ${activePercent}% ${activePercent + wonPercent}%,
                    #9ca3af ${activePercent + wonPercent}% 100%
                );"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-gray-900">${total}</div>
                            <div class="text-xs text-gray-500">Tổng số</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderTopSubcontractors(allLeads) {
        // Đếm số deals của mỗi nhà thầu
        const subcontractorCounts = {};
        allLeads.forEach(lead => {
            if (!subcontractorCounts[lead.subcontractor_id]) {
                subcontractorCounts[lead.subcontractor_id] = 0;
            }
            subcontractorCounts[lead.subcontractor_id]++;
        });

        // Chuyển thành array và sort
        const topSubs = Object.entries(subcontractorCounts)
            .map(([subId, count]) => {
                const sub = API.getSubcontractor(parseInt(subId));
                return {
                    id: parseInt(subId),
                    name: sub?.name || 'N/A',
                    count: count
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5

        return topSubs.length > 0 ? topSubs : [{ name: 'Chưa có dữ liệu', count: 0 }];
    },

    renderProjectDetailCard(project, allLeads) {
        const projectLeads = allLeads.filter(l => l.project_id === project.id && l.status === 'active');

        // Tìm thầu dẫn đầu (stage cao nhất, hoặc priority cao nhất)
        let leadingLead = null;
        if (projectLeads.length > 0) {
            leadingLead = projectLeads.reduce((best, current) => {
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

        return `
            <div class="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer" onclick="window.location.hash='#/projects/${project.id}'">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs font-medium text-gray-500">${project.code}</span>
                            <span class="badge ${StatusHelper.getProjectStatusColor(project.status)} text-xs">
                                ${StatusHelper.getProjectStatusName(project.status)}
                            </span>
                        </div>
                        <h3 class="font-semibold text-gray-900">${project.name}</h3>
                        <p class="text-xs text-gray-500 mt-1">Giá trị: ${Utils.formatCurrency(project.estimated_value)}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-400">Số thầu</div>
                        <div class="text-xl font-bold text-gray-900">${projectLeads.length}</div>
                    </div>
                </div>

                ${leadingLead ? `
                    <div class="mt-3 p-3 ${isCritical ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200' : 'bg-blue-50 border border-blue-200'} rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex-1">
                                <div class="text-xs ${isCritical ? 'text-orange-600' : 'text-blue-600'} font-medium">
                                    ${isCritical ? 'THẦU ƯU TIÊN' : 'Thầu dẫn đầu'}
                                </div>
                                <div class="font-bold ${isCritical ? 'text-orange-900' : 'text-gray-900'}">${leadingSub?.name || 'N/A'}</div>
                                <div class="text-xs text-gray-500">${leadingSub?.code || ''}</div>
                            </div>
                            <div class="text-right">
                                <span class="badge ${StageHelper.getStageColor(leadingLead.current_stage)} text-xs">
                                    Giai đoạn: ${StageHelper.getStageName(leadingLead.current_stage)}
                                </span>
                                <div class="text-xs text-gray-500 mt-1">
                                    ${PriorityHelper.getPriorityIcon(leadingLead.priority)} ${PriorityHelper.getPriorityName(leadingLead.priority)}
                                </div>
                            </div>
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
                                <span class="text-xs"></span>
                                <span class="text-xs text-gray-600 italic">${leadingLead.meeting_info}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : `
                    <div class="mt-3 p-3 bg-gray-50 rounded-lg text-center">
                        <p class="text-xs text-gray-500">Chưa có thầu tham gia</p>
                    </div>
                `}

                ${projectLeads.length > 1 ? `
                    <div class="mt-2 flex flex-wrap gap-1">
                        ${projectLeads.filter(l => l.id !== leadingLead?.id).slice(0, 5).map(lead => {
            const sub = API.getSubcontractor(lead.subcontractor_id);
            return `
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                    ${sub?.code || 'N/A'}
                                </span>
                            `;
        }).join('')}
                        ${projectLeads.length > 6 ? `<span class="text-xs text-gray-400">+${projectLeads.length - 6}</span>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    },

    renderFunnel(byStage) {
        const maxCount = Math.max(...Object.values(byStage), 1);

        return StageHelper.stages.map(stage => {
            const count = byStage[stage.code] || 0;
            const percentage = (count / maxCount) * 100;
            return `
                <div class="flex items-center gap-3">
                    <div class="w-24 text-sm text-gray-600 truncate">${stage.name}</div>
                    <div class="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                    </div>
                    <div class="w-8 text-sm font-medium text-gray-900 text-right">${count}</div>
                </div>
            `;
        }).join('');
    },

    renderLeaderboard() {
        const leaderboard = API.getLeaderboard();

        if (leaderboard.length === 0) {
            return '<p class="text-center text-gray-500 py-4">Chưa có dữ liệu</p>';
        }

        return leaderboard.slice(0, 5).map((user, index) => {
            const medals = ['🥇', '🥈', '🥉'];
            return `
                <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div class="w-8 text-center">
                        ${index < 3 ? `<span class="text-lg">${medals[index]}</span>` : `<span class="text-sm text-gray-400">#${index + 1}</span>`}
                    </div>
                    <div class="avatar avatar-sm ${Utils.getAvatarColor(user.name)}">
                        ${Utils.getInitials(user.name)}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">${user.name}</p>
                        <p class="text-xs text-gray-500">${user.deals_won} deals</p>
                    </div>
                    <div class="text-sm font-bold text-blue-600">${user.year_points} điểm</div>
                </div>
            `;
        }).join('');
    },

    renderRecentActivity() {
        const history = API.getAll('lead_stage_history').slice(0, 5);

        if (history.length === 0) {
            return '<p class="text-center text-gray-500 py-4">Chưa có hoạt động</p>';
        }

        return history.map(h => {
            const lead = API.getLead(h.lead_id);
            const project = lead ? API.getProject(lead.project_id) : null;
            const subcontractor = lead ? API.getSubcontractor(lead.subcontractor_id) : null;
            const user = API.getUser(h.changed_by);

            return `
                <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900">
                            <span class="font-medium">${user?.name || 'Unknown'}</span> 
                            chuyển <span class="font-medium">${subcontractor?.code || ''}</span> - ${project?.name || ''} 
                            sang <span class="badge badge-primary">${StageHelper.getStageName(h.to_stage)}</span>
                        </p>
                        ${h.notes ? `<p class="text-xs text-gray-500 mt-1">"${h.notes}"</p>` : ''}
                        <p class="text-xs text-gray-400 mt-1">${Utils.formatDate(h.changed_at, 'relative')}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
};
