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

export async function initializeCSRF() {
    try {
        const response = await axios.get('/auth/csrf-token');
        if (response.data.csrfToken) {
            setupAxios(response.data.csrfToken);
        }
    } catch (error) {
        console.warn('Failed to fetch CSRF token:', error);
    }
}

export default axios;