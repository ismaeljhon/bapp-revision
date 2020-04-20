import _forEach from 'lodash/forEach'
export default {
    data() {
        return {
            apiKeysRequired: ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN', 'ZOHO_PORTAL_ID', 'ZOHO_FILE_CAT_ID'],
        }
    },
    methods: {
        validateRequiredApiKeys() {
            let noKeyValues = [];

            _forEach(this.apiKeysRequired, o => {
                let keyValue = localStorage[o];
                if (keyValue) {
                    process.env[o] = keyValue;
                }

                if (!process.env[o]) {
                    noKeyValues.push(o);
                }
            })
            return noKeyValues;
        }
    }
}