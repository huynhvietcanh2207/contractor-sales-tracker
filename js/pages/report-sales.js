// Report Sales Page - Báo cáo hoạt động Sales
const ReportSalesPage = {
    selectedYear: new Date().getFullYear(),
    selectedSalesId: null, // null = all (for admin)

    render() {
        const user = Auth.getUser();

        // Check permission - only admin and sales can view
        if (user.role !== 'admin' && user.role !== 'sales') {
            return `
                ${Header.render('Không có quyền', [{ label: 'Báo cáo', href: '#/dashboard' }, { label: 'Sales' }])}
                <main class="p-6">
                    <div class="card p-12 text-center">
                        <div class="text-6xl mb-4">🔒</div>
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
                        <p class="text-gray-500 mb-6">Trang này chỉ dành cho Admin và Sales</p>
                        <a href="#/dashboard" class="btn btn-primary">Về Dashboard</a>
                    </div>
                </main>
            `;
        }

        // If sales, can only view own data
        if (user.role === 'sales') {
            this.selectedSalesId = user.id;
        }

        const stats = this.calculateStats();
        const salesList = API.getSales();

        return `
            ${Header.render('Báo cáo Sales', [{ label: 'Báo cáo' }, { label: 'Sales' }])}
            <main class="p-6">
                <!-- Filters for Admin -->
                ${user.role === 'admin' ? `
                <div class="mb-6 flex flex-wrap gap-4 items-center">
                    <div class="form-group mb-0">
                        <label class="form-label">Nhân viên Sales</label>
                        <select id="sales-filter" class="form-control" style="min-width: 200px;" onchange="ReportSalesPage.onSalesChange(this.value)">
                            <option value="">Tất cả Sales</option>
                            ${salesList.map(s => `
                                <option value="${s.id}" ${this.selectedSalesId === s.id ? 'selected' : ''}>${s.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group mb-0">
                        <label class="form-label">Năm</label>
                        <select id="year-filter" class="form-control" onchange="ReportSalesPage.onYearChange(this.value)">
                            ${this.getYearOptions()}
                        </select>
                    </div>
                </div>
                ` : `
                <div class="mb-6 flex flex-wrap gap-4 items-center">
                    <div class="form-group mb-0">
                        <label class="form-label">Năm</label>
                        <select id="year-filter" class="form-control" onchange="ReportSalesPage.onYearChange(this.value)">
                            ${this.getYearOptions()}
                        </select>
                    </div>
                </div>
                `}

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    ${this.renderStatsCard('Tổng nhà thầu đã gặp', stats.totalSubcontractors, 'users', 'blue')}
                    ${this.renderStatsCard(`Nhà thầu mới năm ${this.selectedYear}`, stats.newSubcontractorsForYear, 'user-plus', 'green')}
                    ${this.renderStatsCard('Tổng dự án tham gia', stats.totalProjects, 'briefcase', 'orange')}
                </div>

                <!-- Charts Row 1 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Projects by Month -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"> Dự án tham gia theo tháng</h3>
                        </div>
                        <div class="card-body">
                            <div id="projects-by-month-chart" class="chart-container">
                                ${this.renderProjectsByMonthChart(stats.projectsByMonth)}
                            </div>
                        </div>
                    </div>

                    <!-- New Subcontractors by Month -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Nhà thầu mới theo tháng</h3>
                        </div>
                        <div class="card-body">
                            <div id="new-subs-chart" class="chart-container">
                                ${this.renderNewSubsChart(stats.newSubsByMonth)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Row 2 - Common charts -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Pie Chart - Priority Breakdown -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"> Phân bổ theo mức độ ưu tiên</h3>
                        </div>
                        <div class="card-body">
                            <div id="pie-chart" class="chart-container flex justify-center">
                                ${this.renderPriorityChart(stats.priorityBreakdown)}
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
                </div>
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

    onSalesChange(value) {
        this.selectedSalesId = value ? parseInt(value) : null;
        App.renderContent();
    },

    onYearChange(value) {
        this.selectedYear = parseInt(value);
        App.renderContent();
    },

    calculateStats() {
        const leads = API.getAll('leads');
        const projects = API.getAll('projects');

        // Filter leads by sales ID
        let filteredLeads = leads;
        if (this.selectedSalesId) {
            filteredLeads = leads.filter(l => l.sales_id === this.selectedSalesId);
        }

        // Get unique subcontractors
        const uniqueSubcontractors = [...new Set(filteredLeads.map(l => l.subcontractor_id))];

        // Sort leads by created_at to find first appearance
        const sortedLeads = [...filteredLeads].sort((a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        );

        // Get new subcontractors for the selected year
        const yearStart = `${this.selectedYear}-01`;
        const yearEnd = `${this.selectedYear}-12`;

        const seenSubcontractors = new Set();
        const newForSelectedYear = new Set();

        sortedLeads.forEach(lead => {
            const leadMonth = lead.created_at.substring(0, 7);
            if (leadMonth >= yearStart && leadMonth <= yearEnd) {
                if (!seenSubcontractors.has(lead.subcontractor_id)) {
                    seenSubcontractors.add(lead.subcontractor_id);
                    newForSelectedYear.add(lead.subcontractor_id);
                }
            }
        });

        // Get unique projects
        const uniqueProjectIds = [...new Set(filteredLeads.map(l => l.project_id))];

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

        // New subcontractors by month
        const newSubsByMonth = {};
        const seenForStats = new Set();

        for (let m = 1; m <= 12; m++) {
            const monthKey = `${this.selectedYear}-${String(m).padStart(2, '0')}`;
            newSubsByMonth[monthKey] = 0;
        }

        sortedLeads.forEach(lead => {
            const leadMonth = lead.created_at.substring(0, 7);
            if (leadMonth.startsWith(String(this.selectedYear))) {
                if (!seenForStats.has(lead.subcontractor_id)) {
                    seenForStats.add(lead.subcontractor_id);
                    if (newSubsByMonth[leadMonth] !== undefined) {
                        newSubsByMonth[leadMonth]++;
                    }
                }
            }
        });

        // Projects by status
        const userProjects = projects.filter(p => uniqueProjectIds.includes(p.id));
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

        // Trend data (win rate by month)
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

        // Priority breakdown for active leads
        const priorityBreakdown = {
            critical: filteredLeads.filter(l => l.status === 'active' && l.priority === 'critical').length,
            high: filteredLeads.filter(l => l.status === 'active' && l.priority === 'high').length,
            medium: filteredLeads.filter(l => l.status === 'active' && l.priority === 'medium').length,
            low: filteredLeads.filter(l => l.status === 'active' && l.priority === 'low').length
        };

        return {
            totalSubcontractors: uniqueSubcontractors.length,
            newSubcontractorsForYear: newForSelectedYear.size,
            totalProjects: uniqueProjectIds.length,
            projectsByMonth: projectsByMonthCounts,
            newSubsByMonth,
            priorityBreakdown,
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
            users: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
            'user-plus': '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>',
            briefcase: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>'
        };

        return `
            <div class="stats-card bg-gradient-to-br ${colorClasses[color]} text-white rounded-2xl p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white/80 text-sm mb-1">${title}</p>
                        <p class="text-4xl font-bold">${value}</p>
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
            const chartEl = document.getElementById('apex-projects-month-sales');
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
                colors: ['#3B82F6'],
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

        return `<div id="apex-projects-month-sales"></div>`;
    },

    renderNewSubsChart(data) {
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const values = Object.values(data);

        setTimeout(() => {
            const chartEl = document.getElementById('apex-new-subs-sales');
            if (!chartEl || typeof ApexCharts === 'undefined') return;

            const options = {
                series: [{ name: 'Nhà thầu mới', data: values }],
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
                colors: ['#22C55E'],
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
                tooltip: { y: { formatter: (val) => val + ' nhà thầu' } }
            };

            new ApexCharts(chartEl, options).render();
        }, 300);

        return `<div id="apex-new-subs-sales"></div>`;
    },

    renderPriorityChart(data) {
        const total = data.critical + data.high + data.medium + data.low;
        if (total === 0) {
            return `
                <div class="text-center text-gray-500 py-8">
                    <div class="text-4xl mb-2">🎯</div>
                    <p>Chưa có dữ liệu</p>
                </div>
            `;
        }

        const segments = [
            { label: 'Rất cao', value: data.critical, color: '#DC2626', icon: '🔴' },
            { label: 'Cao', value: data.high, color: '#F97316', icon: '🟠' },
            { label: 'Trung bình', value: data.medium, color: '#EAB308', icon: '🟡' },
            { label: 'Thấp', value: data.low, color: '#22C55E', icon: '🟢' }
        ].filter(s => s.value > 0);

        let accumulated = 0;
        const gradientParts = segments.map(seg => {
            const start = accumulated;
            const percent = (seg.value / total) * 100;
            accumulated += percent;
            return `${seg.color} ${start}% ${accumulated}% `;
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
                            <span class="legend-label">${seg.icon} ${seg.label}</span>
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

        // Schedule chart render after DOM update
        setTimeout(() => {
            const chartEl = document.getElementById('apex-trend-chart-sales');
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
                colors: ['#F472B6', '#F59E0B'],
                fill: {
                    type: ['solid', 'solid'],
                    opacity: [0.9, 1]
                },
                markers: {
                    size: [0, 5],
                    colors: ['#F472B6', '#F59E0B'],
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
                        title: { text: 'Số dự án', style: { color: '#F472B6', fontSize: '12px' } },
                        labels: {
                            style: { colors: '#6b7280', fontSize: '11px' },
                            formatter: (val) => Math.round(val)
                        },
                        min: 0
                    },
                    {
                        opposite: true,
                        title: { text: 'Win Rate (%)', style: { color: '#F59E0B', fontSize: '12px' } },
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

        return `<div id="apex-trend-chart-sales"></div>`;
    }
};
