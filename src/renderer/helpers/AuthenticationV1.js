import axios from 'axios';
import Log from '@/shared/Log';

class AuthenticationV1 {
	constructor(params) {

	}

	validate() {
        return axios.get("https://people.zoho.com/people/api/forms/P_EmployeeView/records?authtoken=" + process.env.ZOHO_ACCESS_TOKEN_V1 + "&searchColumn=EMPLOYEEMAILALIAS&searchValue=" + localStorage.ZOHO_EMAIL_V1)
        .then(response => {
			Log.info("Authentication Success using email: " + localStorage.ZOHO_EMAIL_V1);
            localStorage.ZOHO_CURRENT_USER_V1 = JSON.stringify(response.data[0]);
        }).catch(error => {
			Log.error("Authentication Failed using email: " + localStorage.ZOHO_EMAIL_V1);
        })
	}
}

export default AuthenticationV1;