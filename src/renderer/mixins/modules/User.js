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
                return new RestApiService('/portal/' + process.env.VUE_APP_PORTAL_ID + '/users/').index().then(response => {
                    localStorage.setItem('ZOHO_USERS', JSON.stringify(response.data.users));
                    console.log("Zoho Project Users", response.data.users)
                }).catch(error => {
                    Log.error(error, { processType: 'response', customMessage: 'Error on fetching zoho users' });
                })
            }
            return true;
        },
        async getUsers() {
            if (!localStorage.ZOHO_USERS)
                await this.fetchUsers()

            return JSON.parse(localStorage.ZOHO_USERS);
        },
        getCurrentUser() {
            return JSON.parse(localStorage.ZOHO_CURRENT_USER);
        }
    }
};

export default User;