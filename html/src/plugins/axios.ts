import axios from 'axios';

export function setupAxios(csrfToken?: string) {
    if (csrfToken) {
        // koa-csrf expects the token in x-csrf-token header
        axios.defaults.headers.common['x-csrf-token'] = csrfToken;
        // Also set it for POST/PATCH/DELETE requests specifically
        axios.defaults.headers.post['x-csrf-token'] = csrfToken;
        axios.defaults.headers.patch['x-csrf-token'] = csrfToken;
        axios.defaults.headers.delete['x-csrf-token'] = csrfToken;
    }
}

export default axios;