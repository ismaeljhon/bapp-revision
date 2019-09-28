<template>
    <div id="app">
        <b-navbar type="dark">
            <b-navbar-brand href="#">Bickert Management Tracker App</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template slot="text"><font-awesome-icon icon="cog" /></template>
                    <b-dropdown-item href="#" :disabled="$store.getters.TIMER_STARTED">Logout</b-dropdown-item>
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
  }
</script>

<style>
  /* CSS */
    .navbar { 
        background: rgb(159, 20, 24);
    }
</style>
