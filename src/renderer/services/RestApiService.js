import axios from 'axios'
import EnvStorageService from './EnvStorageService.js';

let RestApiService = class RestApiService{
    constructor(prefix, noProjectPrefix = false) {
        const storageService = EnvStorageService.getService();

        // axios.defaults.headers.common['Authorization'] = 'Bearer ' + storageService.getAccessToken();
        if (noProjectPrefix) {
            this.prefix = prefix;
        } else {
            this.prefix = process.env.PROJECTS_API + prefix
        }

        axios.interceptors.request.use(
            config => {
                const token = storageService.getAccessToken();
                if (token) {
                    config.headers['Authorization'] = 'Bearer ' + token;
                }
                return config;
            },
            error => {
                Promise.reject(error)
            }
        );

        axios.interceptors.response.use((response) => {
            return response
        }, function (error) {
            const originalRequest = error.config;
            
            if (error.response.status === 401 && !originalRequest._retry) {
            
                originalRequest._retry = true;
                const refreshToken = storageService.getRefreshToken();

                return axios.post(process.env.ACCOUNTS_API + '/oauth/v2/token?grant_type=refresh_token&refresh_token=' + refreshToken + '&client_id=' + process.env.ZOHO_CLIENT_ID + '&client_secret=' + process.env.ZOHO_CLIENT_SECRET
                )
                    .then(res => {
                        if (res.status === 201 || res.status === 200) {
                            storageService.setToken(res.data);
                            return axios(originalRequest);
                        }
                    })
            }
            return Promise.reject(error);
        });
    }

    index(params = {}) {
        return axios.get(this.prefix, { params: params })
    }

    save(data, isQueryType = false) {

        if (isQueryType) {
            return axios.post(this.prefix, null, data);
        }

        return axios.post(this.prefix, data)
    }

    delete(id) {
        return axios.post(this.prefix + '/' + id + '/delete')
    }
}

export default RestApiService