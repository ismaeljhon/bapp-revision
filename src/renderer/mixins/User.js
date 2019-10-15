import RestApiService from '../services/RestApiService';
let User = {
    methods: {
        validateCurrentUserEmail() {
            if (!localStorage.ZOHO_EMAIL) 
                return false;
            return true;
        },
        fetchUsers() {
            if (!localStorage.ZOHO_USERS) {
                return new RestApiService('/portal/' + process.env.PORTAL_ID + '/users/').index().then(response => {
                    localStorage.setItem('ZOHO_USERS', JSON.stringify(response.data.users));
                }).catch(error => {
                    swal(error);
                })
            }
            return true;
        },
        getUsers() {
            return JSON.parse(localStorage.ZOHO_USERS);
        }
    }
};

export default User;