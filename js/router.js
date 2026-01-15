// Router - Simple hash-based SPA router
const Router = {
    routes: {
        '': 'dashboard',
        'dashboard': 'dashboard',
        'projects': 'projects',
        'projects/:id': 'project-detail',
        'subcontractors': 'subcontractors',
        'employees': 'employees',
        'rewards': 'rewards',
        'notifications': 'notifications',
        'report-sales': 'report-sales',
        'report-consultant': 'report-consultant'
    },

    currentRoute: null,
    currentParams: {},

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    },

    handleRoute() {
        let hash = window.location.hash.slice(2) || ''; // Remove #/

        // If no hash, redirect to dashboard
        if (!hash || hash === '') {
            window.location.hash = '#/dashboard';
            return;
        }

        const { route, params } = this.parseRoute(hash);

        this.currentRoute = route;
        this.currentParams = params;

        App.renderContent();
    },

    parseRoute(hash) {
        // Check for exact match first
        if (this.routes[hash]) {
            return { route: this.routes[hash], params: {} };
        }

        // Check for parameterized routes
        const hashParts = hash.split('/');

        for (const [pattern, routeName] of Object.entries(this.routes)) {
            const patternParts = pattern.split('/');

            if (patternParts.length === hashParts.length) {
                const params = {};
                let match = true;

                for (let i = 0; i < patternParts.length; i++) {
                    if (patternParts[i].startsWith(':')) {
                        // This is a parameter
                        params[patternParts[i].slice(1)] = hashParts[i];
                    } else if (patternParts[i] !== hashParts[i]) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    return { route: routeName, params };
                }
            }
        }

        // No match found, return 404
        return { route: '404', params: {} };
    },

    getRoute() {
        return this.currentRoute;
    },

    getParams() {
        return this.currentParams;
    },

    getParam(name) {
        return this.currentParams[name];
    },

    navigate(path) {
        window.location.hash = '#/' + path;
    },

    back() {
        window.history.back();
    }
};
