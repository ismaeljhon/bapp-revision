let User = {
    methods: {
        validateCurrentUserEmail() {
            if (!localStorage.ZOHO_EMAIL) 
                return false;
            

            return true;
        },
    }
};

export default User;