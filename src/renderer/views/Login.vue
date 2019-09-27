<template>
    <b-card header="Login" header-tag="header" tag="article" class="mt-5">
        <b-form @submit="onSubmit">
            <b-form-group label="Email address:" description="Use your zoho email here">
                <b-form-input v-model="form.email"></b-form-input>
            </b-form-group>
            <b-button variant="primary">Start Working</b-button>
        </b-form>
    </b-card>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                form: {}
            }
        },
        methods: {
            onSubmit(){

            }
        }
    }
</script>

<style>
</style>
