<template>
    <div id="app">
        <b-navbar type="dark">
            <a href="#" @click.prevent="getProjects(true)" v-b-tooltip title="Fetch Latest Projects">
                <font-awesome-icon icon="sync-alt" class="mr-2 text-light"></font-awesome-icon>
            </a>
            <b-navbar-brand href="#">
                Bickert Management Tracker App
            </b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template slot="text"><font-awesome-icon icon="cog" /></template>
                    <b-dropdown-item><font-awesome-icon icon="calendar-alt"></font-awesome-icon> Timesheet</b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item @click.prevent="logout" :disabled="$store.getters.TIMER_STARTED"><font-awesome-icon icon="sign-out-alt"></font-awesome-icon> Logout</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-navbar>
        <b-container>
            <router-view></router-view>
        </b-container>
    </div>
</template>

<script>
  export default {
    name: 'bickert-tracker-app',
    mounted: async function() {
        await this.getProjects();
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
                    localStorage.ZOHO_EMAIL = '',
                    this.$router.push('/login')
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
