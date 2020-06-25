export default class AccessTokenService {
    constructor(nameMapping = {}) {
        this.accessTokenKeyName = nameMapping.access_token || 'access_token'
    }
    set(obj) {
        localStorage.setItem(this.accessTokenKeyName, obj.access_token)
    }
    get() {
        return localStorage.getItem(this.accessTokenKeyName)
    }
    clear() {
        localStorage.setItem(this.accessTokenKeyName, '')
    }
}