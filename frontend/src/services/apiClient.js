// API Client - handles HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
        
        // Build config
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };
        
        // Add body if it exists
        if (options.body) {
            config.body = options.body;
        }
        
        // Add other options (but don't override method, headers, body)
        if (options.credentials) {
            config.credentials = options.credentials;
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { detail: response.statusText || 'Unknown error' };
                }
                
                // Handle FastAPI validation errors
                if (errorData.detail && Array.isArray(errorData.detail)) {
                    const messages = errorData.detail.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
                    throw new Error(messages);
                }
                
                throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Handle 204 No Content responses (common for DELETE)
            if (response.status === 204) {
                return null;
            }

            // Check if response has content
            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');
            
            // If no content-type or content-length is 0, return null
            if (!contentType || contentLength === '0') {
                return null;
            }

            // Only parse JSON if content-type indicates JSON
            if (contentType.includes('application/json')) {
                const text = await response.text();
                if (!text || text.trim() === '') {
                    return null;
                }
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.warn('Failed to parse JSON response:', e);
                    return null;
                }
            }
            
            return null;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    post(endpoint, data = {}, params = {}) {
        let finalEndpoint = endpoint;
        if (Object.keys(params).length > 0) {
            const queryString = new URLSearchParams(params).toString();
            finalEndpoint = `${endpoint}?${queryString}`;
        }
        
        // Ensure data is an object (not null or undefined)
        const requestData = data || {};
        
        // Validate that we have data to send
        if (!requestData || typeof requestData !== 'object') {
            console.warn('POST request with invalid data:', requestData);
        }
        
        // Stringify the data
        const body = JSON.stringify(requestData);
        
        return this.request(finalEndpoint, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint, data = {}, params = {}) {
        let finalEndpoint = endpoint;
        if (Object.keys(params).length > 0) {
            const queryString = new URLSearchParams(params).toString();
            finalEndpoint = `${endpoint}?${queryString}`;
        }
        return this.request(finalEndpoint, { method: 'DELETE' });
    }
}

export default new ApiClient();

