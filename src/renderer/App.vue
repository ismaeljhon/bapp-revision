<template>
    <div id="app">
        <b-navbar type="dark">
            <a href="#" v-show="!$store.getters.TIMER_STARTED" @click.prevent="fetchProjects(true)" v-b-tooltip title="Fetch Latest Projects">
                <font-awesome-icon icon="sync-alt" class="mr-2 text-light"></font-awesome-icon>
            </a>
            <b-navbar-brand href="#">
                Bickert Management Tracker App
            </b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template slot="text"><font-awesome-icon icon="cog" /></template>
                    <b-dropdown-item @click.prevent="$refs.timesheetModal.show()">
                        <font-awesome-icon icon="calendar-alt"></font-awesome-icon> Timesheet
                    </b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item variant="warning" @click.prevent="$refs.updateKeysModal.show()">
                        <font-awesome-icon icon="wrench"></font-awesome-icon> Update Keys
                    </b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item @click.prevent="logout" :disabled="$store.getters.TIMER_STARTED"><font-awesome-icon icon="sign-out-alt"></font-awesome-icon> Logout</b-dropdown-item>
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
import TimesheetModal from '@/views/modals/Timesheet';
import PendingTimelogModal from '@/views/modals/PendingTimelog'
import UpdateOauthKeysModal from '@/views/modals/UpdateOauthKeys.vue'
import Log from '@/shared/Log'

import AuthenticationV1 from '@/helpers/AuthenticationV1'

const {app} = require('electron')
import exec from 'await-exec';

export default {
    name: 'bickert-tracker-app',
    components: {
        TimesheetModal,
        PendingTimelogModal,
        UpdateOauthKeysModal
    },
    mounted: async function() {
        if (this.$route.path == "/loginV1") {
            return
        }

        if (!localStorage.ZOHO_ACCESS_TOKEN_V1) {
            Log.error({}, { processType: 'process', customMessage: "No Authentication V1 key set, please reach out for some help" })
            return false;
        }

        let validate = await new AuthenticationV1().validate();
        if (!validate) {
            let message = "You need to re-login"
            Log.error({ message: message }, { processType: 'info', customMessage: message })
            return this.$router.push('/loginV1')
        }
        
        if (process.platform == 'win32') {
            await exec(`if not exist "${process.env.VUE_APP_ZOHO_SCREENSHOT_FOLDER}" mkdir ${process.env.VUE_APP_ZOHO_SCREENSHOT_FOLDER}`)
        } else {
            if (!localStorage.ZOHO_LAST_TIME_LOG)
                swal({
                    title: 'Important Notes',
                    icon: 'warning',
                    text: 'Cannot create public folder in your machine (' + process.platform + ")\nWe will be using the program folder in behalf.. \n Please make sure you run this application as administrator."
                })
        }
    },
    methods: {
        logout() {
            swal({
                title: "Leaving Already?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((loggedOut) => {
                if (loggedOut) {
                    localStorage.ZOHO_CURRENT_USER_V1 = '',
                    this.$router.push('/loginV1')
                }
            });
            
        },
    }
  }
</script>

<style>
  /* CSS */
    .navbar { 
        background: rgb(159, 20, 24);
    }
</style>
