import axios from 'axios'
import AccessTokenService from '@/services/AccessTokenService.js';
import store from '@/store/index'

let RestApiService = class RestApiService{
    constructor(prefix, noProjectPrefix = false) {
        
        /** this is static for the meantime */
        const zohoService = {
            access_token: 'ZOHO_ACCESS_TOKEN'
        }

        const accessTokenService = new AccessTokenService(zohoService);

        if (noProjectPrefix) {
            this.prefix = prefix;
        } else {
            this.prefix = process.env.VUE_APP_PROJECTS_API + prefix
        }

        axios.interceptors.request.use(
            config => {
                const token = accessTokenService.get();
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
        }, async function (error) {

            const originalRequest = error.config;
            
            if (error.response.status === 401 && !originalRequest._retry) {
            
                originalRequest._retry = true;
                
                const OauthFileHandler = require('@/shared/oauth/OauthFileHandler').default
                
                /** Use bickert time tracker config for the meantime */
                let valid = await new OauthFileHandler('bickert-timetracker').validateConfigFile()

                store.commit('SET_OAUTH_KEY_ERROR', !valid)

                if (valid) {
                    return axios(originalRequest)
                }
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