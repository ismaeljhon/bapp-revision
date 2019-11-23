import axios from 'axios';
import _forIn from 'lodash/forIn';
import _join from 'lodash/join';

let RestApiServiceV1 = class RestApiServiceV1 {
    constructor(prefix) {
        this.prefix = prefix + '?authtoken=' + localStorage.ZOHO_ACCESS_TOKEN_V1
    }

    index(params = null) {
        if (params) {
            let encodedParams = '';
            for (let key in params){
                if (params.hasOwnProperty(key)){
                    encodedParams += key + '=' + params[key] + '&'
                }
            }

            this.prefix = this.prefix + encodedParams.trim();
            
            return console.log(this.prefix);
        }

        return console.log("no params");
        return axios.get(this.prefix)
    }
}

export default RestApiServiceV1