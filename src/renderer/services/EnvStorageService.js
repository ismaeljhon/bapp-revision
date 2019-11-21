const EnvStorageService = (function(){
    var _service;
    function _getService() {
        if(!_service) {
            _service = this;
            return _service
        }
        return _service
    }
    function _setToken(tokenObj) {
        localStorage.setItem('ZOHO_ACCESS_TOKEN', tokenObj.access_token);
    }
    function _getAccessToken() {
        return localStorage.getItem('ZOHO_ACCESS_TOKEN');
    }
    function _getRefreshToken() {
        return process.env.REFRESH_TOKEN;
    }
    function _clearToken() {
        localStorage.removeItem('ZOHO_ACCESS_TOKEN');
    }
    return {
        getService : _getService,
        setToken : _setToken,
        getAccessToken : _getAccessToken,
        getRefreshToken : _getRefreshToken,
        clearToken : _clearToken
    }
   })();

   export default EnvStorageService;