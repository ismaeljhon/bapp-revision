import RestApiService from "@/services/RestApiService";
import Log from "@/shared/Log";
import { find as _find } from "lodash";

export function getCurrentUser() {
  return JSON.parse(localStorage.ZOHO_CURRENT_USER || "{}");
}
export function getCurrentZohoProjectUser() {
  const currentUser = JSON.parse(localStorage.ZOHO_CURRENT_USER || "{}");
  const projectUsers = JSON.parse(localStorage.ZOHO_USERS || "{}");

  if (currentUser) {
    return _find(projectUsers, (o) => o.email === currentUser["Email ID"]);
  }

  return {};
}

export function getUsersFromZohoPeople() {
  return new Promise(async (resolve) => {
    if (!localStorage.ZOHO_PEOPLE_USERS) await this.fetchUsersFromZohoPeople();

    resolve(JSON.parse(localStorage.ZOHO_PEOPLE_USERS));
  });
}

let User = {
  methods: {
    getCurrentUser,
    getUsersFromZohoPeople,
    isLoggedIn() {
      return localStorage.ZOHO_CURRENT_USER ? true : false;
    },
    validateCurrentUserEmail() {
      if (!localStorage.ZOHO_CURRENT_USER) return false;
      return true;
    },
    fetchUsers() {
      if (!localStorage.ZOHO_USERS) {
        return new RestApiService(
          "/portal/" + process.env.VUE_APP_PORTAL_ID + "/users/"
        )
          .index()
          .then((response) => {
            localStorage.setItem(
              "ZOHO_USERS",
              JSON.stringify(response.data.users)
            );
            console.log("Zoho Project Users", response.data.users);
          })
          .catch((error) => {
            Log.error(error, {
              processType: "response",
              customMessage: "Error on fetching zoho users",
            });
          });
      }
      return true;
    },
    fetchUsersFromZohoPeople(refresh = false) {
      if (refresh || !localStorage.ZOHO_PEOPLE_USERS) {
        return new RestApiService(
          "https://people.zoho.com/people/api/forms/P_EmployeeView/records",
          true
        )
          .index()
          .then((response) => {
            localStorage.setItem(
              "ZOHO_PEOPLE_USERS",
              JSON.stringify(response.data)
            );
          })
          .catch((error) => {
            Log.error(error, {
              processType: "response",
              customMessage: "Error on fetching users from zoho people",
            });
          });
      }
      return true;
    },
  },
};

export default User;
