import RestApiService from '@/services/RestApiService';
import Log from '@/shared/Log'
let User = {
    methods: {
        validateCurrentUserEmail() {
            if (!localStorage.ZOHO_CURRENT_USER) 
                return false;
            return true;
        },
        fetchUsers() {
            if (!localStorage.ZOHO_USERS) {
                return new RestApiService('/portal/' + process.env.PORTAL_ID + '/users/').index().then(response => {
                    localStorage.setItem('ZOHO_USERS', JSON.stringify(response.data.users));
                }).catch(error => {
                    Log.error(error.data.error.message);
                })
            }
            return true;
        },
        getUsers() {
            return JSON.parse(localStorage.ZOHO_USERS);
        },
        getCurrentUser() {
            return JSON.parse(localStorage.ZOHO_CURRENT_USER);
        }
    }
};

export default User;