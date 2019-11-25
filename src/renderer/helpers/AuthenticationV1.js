import axios from 'axios';
import Log from '@/shared/Log';
import _find from 'lodash/find';
import Employees from '@/assets/Employees';

class AuthenticationV1 {
	constructor(params) {

	}

	validate() {
        // return axios.get("https://people.zoho.com/people/api/forms/P_EmployeeView/records?authtoken=" + localStorage.ZOHO_ACCESS_TOKEN_V1)
        // .then(response => {
		// 	Log.info("Authentication Success using email: " + localStorage.ZOHO_EMAIL_V1);
        //     localStorage.ZOHO_CURRENT_USER_V1 = JSON.stringify(response.data[0]);
        // }).catch(error => {
		// 	Log.error("Authentication Failed using email: " + localStorage.ZOHO_EMAIL_V1);
		// })
		let employee = _find(Employees, o => { return o["Email ID"] == localStorage.ZOHO_EMAIL_V1 }) || {};
		localStorage.ZOHO_CURRENT_USER_V1 = JSON.stringify(employee);
	}
}

export default AuthenticationV1;