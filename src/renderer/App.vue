<template>
  <div id="app">
    <b-navbar type="dark">
      <a
        href="#"
        v-show="!$store.getters.TIMER_STARTED"
        @click.prevent="fetchProjects(true)"
        v-b-tooltip
        title="Fetch Latest Projects"
      >
        <font-awesome-icon
          icon="sync-alt"
          class="mr-2 text-light"
        ></font-awesome-icon>
      </a>
      <b-navbar-brand href="#">
        Bickert Management Tracker App
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template slot="text"
            ><font-awesome-icon icon="cog"
          /></template>
          <b-dropdown-item
            @click.prevent="$refs.timesheetModal.show()"
            v-if="this.isLoggedIn()"
          >
            <font-awesome-icon icon="calendar-alt"></font-awesome-icon>
            Timesheet
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item
            variant="warning"
            @click.prevent="$refs.updateKeysModal.show()"
          >
            <font-awesome-icon icon="wrench"></font-awesome-icon> Update Keys
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click.prevent="showDeveloperTools">
            <font-awesome-icon icon="hammer"></font-awesome-icon> Show Developer
            Tools
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item
            v-if="this.isLoggedIn()"
            @click.prevent="logout"
            :disabled="$store.getters.TIMER_STARTED"
            ><font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
            Logout</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <b-container>
      <router-view></router-view>
    </b-container>

    <timesheet-modal ref="timesheetModal" />
    <pending-timelog-modal />
    <update-oauth-keys-modal ref="updateKeysModal" />
  </div>
</template>

<script>
import TimesheetModal from "@/views/modals/Timesheet";
import PendingTimelogModal from "@/views/modals/PendingTimelog";
import UpdateOauthKeysModal from "@/views/modals/UpdateOauthKeys.vue";
import Log from "@/shared/Log";

import Authentication from "@/helpers/Authentication";

import exec from "await-exec";

export default {
  name: "bickert-tracker-app",
  components: {
    TimesheetModal,
    PendingTimelogModal,
    UpdateOauthKeysModal,
  },
  mounted: async function() {
    if (this.$route.path == "/login") {
      return;
    }

    let validate = await new Authentication().validate();

    console.log("validate", validate)
    if (!validate) {
        console.log("You need to login")
      let message = "You need to login";
      Log.error(
        { message: message },
        { processType: "info", customMessage: message }
      );
      return this.$router.push("/login");
    } else {
        this.$router.push("/")

        console.log("go to home")
    }

    if (process.platform == "win32") {
      await exec(
        `if not exist "${process.env.VUE_APP_ZOHO_SCREENSHOT_FOLDER}" mkdir ${
          process.env.VUE_APP_ZOHO_SCREENSHOT_FOLDER
        }`
      );
    } else {
      if (!localStorage.ZOHO_LAST_TIME_LOG)
        swal({
          title: "Important Notes",
          icon: "warning",
          text:
            "Cannot create public folder in your machine (" +
            process.platform +
            ")\nWe will be using the program folder in behalf.. \n Please make sure you run this application as administrator.",
        });
    }
  },
  methods: {
    logout() {
      swal({
        title: "Leaving Already?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((loggedOut) => {
        if (loggedOut) {
          (localStorage.ZOHO_PEOPLE_USERS = ""), this.$router.push("/login");
        }
      });
    },
    showDeveloperTools() {
      require("electron")
        .remote.getCurrentWindow()
        .webContents.openDevTools();
    },
  },
};
</script>

<style>
/* CSS */
.navbar {
  background: rgb(159, 20, 24);
}
</style>
