import axios from 'axios'
import EnvStorageService from './EnvStorageService.js';

let RestApiService = class RestApiService{
    constructor(prefix) {
        const storageService = EnvStorageService.getService();

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + storageService.getAccessToken();

        this.prefix = process.env.PROJECTS_API + prefix

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
            console.log(error)
            const originalRequest = error.config;
            
            if (error.response.status === 401 && !originalRequest._retry) {
            
                originalRequest._retry = true;
                const refreshToken = storageService.getRefreshToken();

                return axios.post(process.env.ACCOUNTS_API + '/oauth/v2/token',
                    {
                        refresh_token: refreshToken,
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        grant_type: 'refresh_token',
                        redirect_uri: 'http://localhost'
                    },
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                )
                    .then(res => {
                        if (res.status === 201) {
                            storageService.setToken(res.data);
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + storageService.getAccessToken();
                            return axios(originalRequest);
                        }
                    })
            }
            return Promise.reject(error);
        });
    }

    index(){
        return axios.get(this.prefix)
    }

    save(data){
        return axios.post(this.prefix, data)
    }

    delete(id) {
        return axios.post(this.prefix + '/' + id + '/delete')
    }
}

export default RestApiService