<template>
  <b-card header="Login" header-tag="header" tag="article" class="mt-5">
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        label="Email address:"
        description="Use your zoho email here"
        :invalid-feedback="veeErrors.first('email')"
        :state="!veeErrors.has('email')"
      >
        <b-form-input
          v-model="form.email"
          name="email"
          v-validate="{ required: true, email: true }"
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary" :disabled="disableBtn"
        >Start Working</b-button
      >
    </b-form>
  </b-card>
</template>

<script>
import _find from "lodash/find";
import Log from "@/shared/Log";

export default {
  name: "login",
  data() {
    return {
      form: {},
      users: [],
      disableBtn: false,
    };
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll().then(async (noerrors) => {
        if (noerrors) {
          let users = await this.getUsersFromZohoPeople();

          let currentUser = _find(users, (o) => {
            return o["Email ID"] == this.form.email;
          });

          console.log(users)

          if (currentUser) {
            localStorage.ZOHO_CURRENT_USER = JSON.stringify(currentUser);
            this.$router.push("/");
          } else {
            Log.warning("Email not Registered", { withPrompt: true });
          }
        }

        return false;
      });
    },
  },
  mounted: async function() {
    this.disableBtn = true;
    await this.fetchUsersFromZohoPeople();
    this.users = localStorage.ZOHO_PEOPLE_USERS;
    this.disableBtn = false;
  },
};
</script>

<style></style>
