const Router = rootElement => {
    const _routes = {};
    const _notFound = `<div>Not found.</div>`;

    const _loadRoute = (contentElement, params = {}) => {
        if (typeof contentElement === 'string') { // handle strings
            rootElement.innerHTML = contentElement;
        } else if (typeof contentElement === 'function') { // handle functions with params
            _loadRoute(contentElement(params));
        } else { // handle html elements
            rootElement.innerHTML = '';
            rootElement.appendChild(contentElement);
        }
    };

    const _matchParams = (entered, key) => {
        const params = {};
        for (let i = 0; i < entered.length; i++) {
            if (key[i][0] !== ':' && entered[i] !== key[i]) {
                return null;
            }
            if (key[i][0] === ':') {
                params[key[i].slice(1)] = entered[i];
            }
        }
        return params;
    };

    const _push = (path) => {
        window.history.pushState({}, path, window.location.origin + path + window.location.search);
        if (_routes[path] !== undefined) {
            _loadRoute(_routes[path]);
        } else {
            const pathParts = path.split('/');
            const possibleRoutes = Object.keys(_routes).map((r) => r.split('/')).filter((r) => r.length === pathParts.length);
            for (const route of possibleRoutes) {
                const params = _matchParams(pathParts, route);
                if (params !== null) {
                    return _loadRoute(_routes[route.join('/')], params);
                }
            }
            _loadRoute(_notFound);
        }
    };

    const api = {
        get: (path, content) => {
            _routes[path] = content;
            return api;
        },
        notFound: content => {
            _notFound = content;
            return api;
        },
        push: path => {
            _push(path);
            return api;
        },
        start: () => {
            _push(window.location.pathname);
            window.onpopstate = () => _push(window.location.pathname);
            return api;
        },
    };
    return api;
};
