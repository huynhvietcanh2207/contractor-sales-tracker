// Report Consultant Page - Báo cáo hoạt động Tư vấn
const ReportConsultantPage = {
    selectedYear: new Date().getFullYear(),
    selectedConsultantId: null, // null = all (for admin)

    render() {
        const user = Auth.getUser();

        // Check permission - only admin and consultant can view
        if (user.role !== 'admin' && user.role !== 'consultant') {
            return `
                ${Header.render('Không có quyền', [{ label: 'Báo cáo', href: '#/dashboard' }, { label: 'Tư vấn' }])}
                <main class="p-6">
                    <div class="card p-12 text-center">
                        <div class="text-6xl mb-4">🔒</div>
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
                        <p class="text-gray-500 mb-6">Trang này chỉ dành cho Admin và Tư vấn</p>
                        <a href="#/dashboard" class="btn btn-primary">Về Dashboard</a>
                    </div>
                </main>
            `;
        }

        // If consultant, can only view own data
        if (user.role === 'consultant') {
            this.selectedConsultantId = user.id;
        }

        const stats = this.calculateStats();
        const consultantList = API.getConsultants();

        return `
            ${Header.render('Báo cáo Tư vấn', [{ label: 'Báo cáo' }, { label: 'Tư vấn' }])}
            <main class="p-6">
                <!-- Filters for Admin -->
                ${user.role === 'admin' ? `
                <div class="mb-6 flex flex-wrap gap-4 items-center">
                    <div class="form-group mb-0">
                        <label class="form-label">Nhân viên Tư vấn</label>
                        <select id="consultant-filter" class="form-control" style="min-width: 200px;" onchange="ReportConsultantPage.onConsultantChange(this.value)">
                            <option value="">Tất cả Tư vấn</option>
                            ${consultantList.map(c => `
                                <option value="${c.id}" ${this.selectedConsultantId === c.id ? 'selected' : ''}>${c.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group mb-0">
                        <label class="form-label">Năm</label>
                        <select id="year-filter" class="form-control" onchange="ReportConsultantPage.onYearChange(this.value)">
                            ${this.getYearOptions()}
                        </select>
                    </div>
                </div>
                ` : `
                <div class="mb-6 flex flex-wrap gap-4 items-center">
                    <div class="form-group mb-0">
                        <label class="form-label">Năm</label>
                        <select id="year-filter" class="form-control" onchange="ReportConsultantPage.onYearChange(this.value)">
                            ${this.getYearOptions()}
                        </select>
                    </div>
                </div>
                `}

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    ${this.renderStatsCard('Tổng dự án đã làm', stats.totalProjects, 'folder', 'blue')}
                    ${this.renderStatsCard('Tổng sản phẩm', Utils.formatNumber(stats.totalProducts) + ' ' + (stats.productUnit || 'SP'), 'package', 'orange')}
                    ${this.renderStatsCard('Tổng tiền đã báo', Utils.formatCurrency(stats.totalQuoted), 'currency', 'green')}
                </div>

                <!-- Charts Row 1 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Projects by Month -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"> Dự án theo tháng</h3>
                        </div>
                        <div class="card-body">
                            <div id="projects-by-month-chart" class="chart-container">
                                ${this.renderProjectsByMonthChart(stats.projectsByMonth)}
                            </div>
                        </div>
                    </div>

                    <!-- Products by Project -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"> Số lượng sản phẩm theo dự án</h3>
                        </div>
                        <div class="card-body">
                            <div id="products-chart" class="chart-container">
                                ${this.renderProductsChart(stats.productsByProject)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Row 2 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Quoted Amount by Project -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"> Số tiền báo giá theo dự án</h3>
                        </div>
                        <div class="card-body">
                            <div id="quoted-chart" class="chart-container">
                                ${this.renderQuotedChart(stats.quotedByProject)}
                            </div>
                        </div>
                    </div>

                    <!-- Pie Chart - Stage Breakdown -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Phân bổ theo giai đoạn</h3>
                        </div>
                        <div class="card-body">
                            <div id="pie-chart" class="chart-container flex justify-center">
                                ${this.renderStageChart(stats.stageBreakdown)}
                            </div>
                        </div>
                    </div>

                <!-- Combo Chart - Trend (only if >= 3 months) -->
                ${stats.hasEnoughDataForTrend ? `
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"> Xu hướng theo thời gian</h3>
                    </div>
                    <div class="card-body">
                        <div id="trend-chart" class="chart-container">
                            ${this.renderTrendChart(stats.trendData)}
                        </div>
                    </div>
                </div>
                ` : `
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"> Xu hướng theo thời gian</h3>
                    </div>
                    <div class="card-body text-center text-gray-500 py-12">
                        <div class="text-4xl mb-4">📊</div>
                        <p>Cần ít nhất 3 tháng dữ liệu để hiển thị biểu đồ xu hướng</p>
                    </div>
                </div>
                `}
            </main>
        `;
    },

    getYearOptions() {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let y = currentYear; y >= currentYear - 2; y--) {
            years.push(`<option value="${y}" ${this.selectedYear === y ? 'selected' : ''}>${y}</option>`);
        }
        return years.join('');
    },

    onConsultantChange(value) {
        this.selectedConsultantId = value ? parseInt(value) : null;
        App.renderContent();
    },

    onYearChange(value) {
        this.selectedYear = parseInt(value);
        App.renderContent();
    },

    // Helper to get product info with backward compatibility
    getProductInfo(project) {
        if (project.product_info && typeof project.product_info === 'object') {
            return project.product_info;
        }
        // Backward compatibility for old data
        return {
            notes: project.product_notes || '',
            quantity: 0,
            unit: '',
            quoted_amount: 0
        };
    },

    calculateStats() {
        const leads = API.getAll('leads');
        const projects = API.getAll('projects');

        // Filter leads by consultant ID
        let filteredLeads = leads;
        if (this.selectedConsultantId) {
            filteredLeads = leads.filter(l => l.assigned_consultant_id === this.selectedConsultantId);
        }

        // Get unique project IDs
        const uniqueProjectIds = [...new Set(filteredLeads.map(l => l.project_id))];

        // Get projects data
        const userProjects = projects.filter(p => uniqueProjectIds.includes(p.id));

        // Calculate totals
        let totalProducts = 0;
        let totalQuoted = 0;
        let productUnit = '';

        userProjects.forEach(project => {
            const info = this.getProductInfo(project);
            totalProducts += info.quantity || 0;
            totalQuoted += info.quoted_amount || 0;
            if (info.unit && !productUnit) {
                productUnit = info.unit;
            }
        });

        // Projects by month (for selected year)
        const projectsByMonth = {};
        for (let m = 1; m <= 12; m++) {
            const monthKey = `${this.selectedYear}-${String(m).padStart(2, '0')}`;
            projectsByMonth[monthKey] = new Set();
        }

        filteredLeads.forEach(lead => {
            const leadMonth = lead.created_at.substring(0, 7);
            if (leadMonth.startsWith(String(this.selectedYear))) {
                if (projectsByMonth[leadMonth]) {
                    projectsByMonth[leadMonth].add(lead.project_id);
                }
            }
        });

        // Convert sets to counts
        const projectsByMonthCounts = {};
        Object.keys(projectsByMonth).forEach(month => {
            projectsByMonthCounts[month] = projectsByMonth[month].size;
        });

        // Products by project (top 10)
        const productsByProject = userProjects
            .map(p => ({
                id: p.id,
                name: p.name,
                quantity: this.getProductInfo(p).quantity || 0
            }))
            .filter(p => p.quantity > 0)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);

        // Quoted by project (top 10)
        const quotedByProject = userProjects
            .map(p => ({
                id: p.id,
                name: p.name,
                amount: this.getProductInfo(p).quoted_amount || 0
            }))
            .filter(p => p.amount > 0)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10);

        // Projects by status
        const projectsByStatus = {
            active: userProjects.filter(p => p.status === 'active').length,
            won: userProjects.filter(p => p.status === 'won').length,
            lost: filteredLeads.filter(l => l.status === 'lost').length > 0 ?
                [...new Set(filteredLeads.filter(l => l.status === 'lost').map(l => l.project_id))].length : 0,
            cancelled: userProjects.filter(p => p.status === 'cancelled').length
        };

        // Check if we have >= 3 months of data
        const monthsWithData = Object.values(projectsByMonthCounts).filter(v => v > 0).length;
        const hasEnoughDataForTrend = monthsWithData >= 3;

        // Trend data
        const trendData = {};
        Object.keys(projectsByMonth).forEach(month => {
            const monthLeads = filteredLeads.filter(l => l.created_at.substring(0, 7) === month);
            const wonLeads = monthLeads.filter(l => l.status === 'won').length;
            const closedLeads = monthLeads.filter(l => l.status !== 'active').length;
            trendData[month] = {
                projects: projectsByMonth[month].size,
                winRate: closedLeads > 0 ? Math.round((wonLeads / closedLeads) * 100) : 0
            };
        });

        // Stage breakdown for active leads
        const stageBreakdown = {
            initial_contact: filteredLeads.filter(l => l.status === 'active' && l.current_stage === 'initial_contact').length,
            info_gathering: filteredLeads.filter(l => l.status === 'active' && l.current_stage === 'info_gathering').length,
            proposal_sent: filteredLeads.filter(l => l.status === 'active' && l.current_stage === 'proposal_sent').length,
            negotiation: filteredLeads.filter(l => l.status === 'active' && l.current_stage === 'negotiation').length,
            director_meeting: filteredLeads.filter(l => l.status === 'active' && l.current_stage === 'director_meeting').length,
            contract_signing: filteredLeads.filter(l => l.status === 'active' && l.current_stage === 'contract_signing').length
        };

        return {
            totalProjects: uniqueProjectIds.length,
            totalProducts,
            totalQuoted,
            productUnit,
            projectsByMonth: projectsByMonthCounts,
            productsByProject,
            quotedByProject,
            stageBreakdown,
            hasEnoughDataForTrend,
            trendData
        };
    },

    renderStatsCard(title, value, icon, color) {
        const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600',
            purple: 'from-purple-500 to-purple-600'
        };

        const icons = {
            folder: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>',
            package: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>',
            currency: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };

        return `
            <div class="stats-card bg-gradient-to-br ${colorClasses[color]} text-white rounded-2xl p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white/80 text-sm mb-1">${title}</p>
                        <p class="text-3xl font-bold">${value}</p>
                    </div>
                    <div class="bg-white/20 rounded-xl p-3">
                        ${icons[icon]}
                    </div>
                </div>
            </div>
        `;
    },

    renderProjectsByMonthChart(data) {
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const values = Object.values(data);

        setTimeout(() => {
            const chartEl = document.getElementById('apex-projects-month-consultant');
            if (!chartEl || typeof ApexCharts === 'undefined') return;

            const options = {
                series: [{ name: 'Dự án', data: values }],
                chart: {
                    type: 'bar',
                    height: 220,
                    toolbar: { show: false },
                    fontFamily: 'Inter, sans-serif'
                },
                plotOptions: {
                    bar: {
                        borderRadius: 6,
                        columnWidth: '55%',
                        dataLabels: { position: 'top' }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val) => val > 0 ? val : '',
                    offsetY: -20,
                    style: { fontSize: '11px', colors: ['#374151'] }
                },
                colors: ['#8B5CF6'],
                xaxis: {
                    categories: months,
                    labels: { style: { colors: '#6b7280', fontSize: '11px' } },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                },
                yaxis: {
                    labels: { style: { colors: '#6b7280', fontSize: '11px' }, formatter: (val) => Math.round(val) },
                    min: 0
                },
                grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
                tooltip: { y: { formatter: (val) => val + ' dự án' } }
            };

            new ApexCharts(chartEl, options).render();
        }, 300);

        return `<div id="apex-projects-month-consultant"></div>`;
    },

    renderProductsChart(data) {
        if (data.length === 0) {
            return `
                <div class="text-center text-gray-500 py-8">
                    <div class="text-4xl mb-2">📦</div>
                    <p>Chưa có dữ liệu sản phẩm</p>
                </div>
            `;
        }

        const maxValue = Math.max(...data.map(d => d.quantity), 1);

        return `
            <div class="horizontal-bar-chart">
                ${data.map(item => {
            const width = (item.quantity / maxValue) * 100;
            return `
                        <div class="h-bar-item">
                            <div class="h-bar-label" title="${item.name}">${Utils.truncate(item.name, 20)}</div>
                            <div class="h-bar-container">
                                <div class="h-bar bg-gradient-to-r from-orange-400 to-orange-500" 
                                     style="width: ${width}%">
                                </div>
                                <span class="h-bar-value">${Utils.formatNumber(item.quantity)}</span>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    renderQuotedChart(data) {
        if (data.length === 0) {
            return `
                <div class="text-center text-gray-500 py-8">
                    <div class="text-4xl mb-2">💰</div>
                    <p>Chưa có dữ liệu báo giá</p>
                </div>
            `;
        }

        const maxValue = Math.max(...data.map(d => d.amount), 1);

        return `
            <div class="horizontal-bar-chart">
                ${data.map(item => {
            const width = (item.amount / maxValue) * 100;
            return `
                        <div class="h-bar-item">
                            <div class="h-bar-label" title="${item.name}">${Utils.truncate(item.name, 20)}</div>
                            <div class="h-bar-container">
                                <div class="h-bar bg-gradient-to-r from-green-400 to-green-500" 
                                     style="width: ${width}%">
                                </div>
                                <span class="h-bar-value">${Utils.formatCompactCurrency(item.amount)}</span>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    renderStageChart(data) {
        const total = Object.values(data).reduce((sum, v) => sum + v, 0);
        if (total === 0) {
            return `
                <div class="text-center text-gray-500 py-8">
                    <div class="text-4xl mb-2">📊</div>
                    <p>Chưa có dữ liệu</p>
                </div>
            `;
        }

        const segments = [
            { label: 'Liên hệ ban đầu', value: data.initial_contact, color: '#94A3B8', order: 1 },
            { label: 'Thu thập TT', value: data.info_gathering, color: '#60A5FA', order: 2 },
            { label: 'Gửi báo giá', value: data.proposal_sent, color: '#FBBF24', order: 3 },
            { label: 'Đàm phán', value: data.negotiation, color: '#F97316', order: 4 },
            { label: 'Gặp GĐ', value: data.director_meeting, color: '#8B5CF6', order: 5 },
            { label: 'Ký HĐ', value: data.contract_signing, color: '#22C55E', order: 6 }
        ].filter(s => s.value > 0);

        let accumulated = 0;
        const gradientParts = segments.map(seg => {
            const start = accumulated;
            const percent = (seg.value / total) * 100;
            accumulated += percent;
            return `${seg.color} ${start}% ${accumulated}%`;
        });

        return `
            <div class="pie-chart-container">
                <div class="donut-chart" style="background: conic-gradient(${gradientParts.join(', ')});">
                    <div class="donut-hole">
                        <span class="donut-total">${total}</span>
                        <span class="donut-label">Leads</span>
                    </div>
                </div>
                <div class="pie-legend">
                    ${segments.map(seg => `
                        <div class="legend-item">
                            <span class="legend-color" style="background: ${seg.color}"></span>
                            <span class="legend-label">GĐ${seg.order}: ${seg.label}</span>
                            <span class="legend-value">${seg.value} (${Math.round((seg.value / total) * 100)}%)</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderTrendChart(data) {
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const values = Object.values(data);

        const projectData = values.map(v => v.projects);
        const winRateData = values.map(v => v.winRate);

        setTimeout(() => {
            const chartEl = document.getElementById('apex-trend-chart-consultant');
            if (!chartEl || typeof ApexCharts === 'undefined') {
                console.warn('ApexCharts not loaded or element not found');
                return;
            }

            const options = {
                series: [
                    {
                        name: 'Số dự án',
                        type: 'column',
                        data: projectData
                    },
                    {
                        name: 'Win Rate',
                        type: 'line',
                        data: winRateData
                    }
                ],
                chart: {
                    height: 280,
                    type: 'line',
                    toolbar: { show: false },
                    fontFamily: 'Inter, sans-serif',
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800
                    }
                },
                stroke: {
                    width: [0, 3],
                    curve: 'smooth'
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        columnWidth: '60%'
                    }
                },
                colors: ['#8B5CF6', '#3B82F6'],
                fill: {
                    type: ['solid', 'solid'],
                    opacity: [0.9, 1]
                },
                markers: {
                    size: [0, 5],
                    colors: ['#8B5CF6', '#3B82F6'],
                    strokeColors: '#fff',
                    strokeWidth: 2,
                    hover: { size: 7 }
                },
                xaxis: {
                    categories: months,
                    labels: {
                        style: {
                            colors: '#6b7280',
                            fontSize: '11px'
                        }
                    },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                },
                yaxis: [
                    {
                        title: { text: 'Số dự án', style: { color: '#8B5CF6', fontSize: '12px' } },
                        labels: {
                            style: { colors: '#6b7280', fontSize: '11px' },
                            formatter: (val) => Math.round(val)
                        },
                        min: 0
                    },
                    {
                        opposite: true,
                        title: { text: 'Win Rate (%)', style: { color: '#3B82F6', fontSize: '12px' } },
                        labels: {
                            style: { colors: '#6b7280', fontSize: '11px' },
                            formatter: (val) => val + '%'
                        },
                        min: 0,
                        max: 100
                    }
                ],
                grid: {
                    borderColor: '#f3f4f6',
                    strokeDashArray: 4
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    fontSize: '13px',
                    fontWeight: 500,
                    markers: { width: 12, height: 12, radius: 3 },
                    itemMargin: { horizontal: 16 }
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (val, { seriesIndex }) {
                            return seriesIndex === 1 ? val + '%' : val + ' dự án';
                        }
                    }
                }
            };

            const chart = new ApexCharts(chartEl, options);
            chart.render();
        }, 300);

        return `<div id="apex-trend-chart-consultant"></div>`;
    }
};
