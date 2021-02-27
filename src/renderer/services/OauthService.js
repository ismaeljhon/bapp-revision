import axios from 'axios'
import queryString from 'querystring'
import AccessTokenService from '@/services/AccessTokenService'

export default class OauthService {
    constructor(config = null, oauthKeys) {
        this.config = config || require('@/config/bickert-timetracker.oauth.js')

        this.oauthKeys = oauthKeys
    }

    refreshToken() {
        let params = {
            grant_type: "refresh_token",
            refresh_token: this.oauthKeys.refresh_token,
            client_id: this.oauthKeys.client_id,
            client_secret: this.oauthKeys.client_secret
        }

        const axiosForRefreshToken = axios.create();

        return axiosForRefreshToken.post(`${this.config.base_url + this.config.url.refresh_token}?${queryString.stringify(params)}`).then(response => {
            new AccessTokenService({ access_token: 'ZOHO_ACCESS_TOKEN' }).set(response.data)
            return response
        })
    }

     validateTokens() {
       return this.refreshToken().then(response => {
           return (response.status == 200 || response.status == 201) && !response.data.error
       })
    }
}