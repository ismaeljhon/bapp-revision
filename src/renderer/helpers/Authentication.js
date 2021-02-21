import Log from "@/shared/Log";
import _find from "lodash/find";
import { getCurrentUser, getUsersFromZohoPeople } from "@/mixins/modules/User";

class Authentication {
  validate() {
    return new Promise(async (resolve) => {
      const currentUser = getCurrentUser();

      if (!currentUser) resolve(false);

      const usersFromZohoPeople = await getUsersFromZohoPeople();

      let employee =
        _find(usersFromZohoPeople, (o) => {
          return o["Email ID"] == currentUser["Email ID"];
        }) || null;

      if (!employee) {
        Log.error(
          {},
          {
            processType: "info",
            customMessage:
              "It seems your email is not included on the list anymore. Kindly contact Systems/IT.",
          }
        );
        resolve(false);
      }

      localStorage.ZOHO_CURRENT_USER = JSON.stringify(employee);

      resolve(true);
    });
  }
}

export default Authentication;
