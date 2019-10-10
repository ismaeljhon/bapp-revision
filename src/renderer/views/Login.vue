<template>
    <b-card header="Login" header-tag="header" tag="article" class="mt-5">
        <b-form @submit.prevent="onSubmit">
            <b-form-group label="Email address:" description="Use your zoho email here" :invalid-feedback="veeErrors.first('email')" :state="!veeErrors.has('email')">
                <b-form-input v-model="form.email" name="email" v-validate="{ required: true, email: true }"></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Start Working</b-button>
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
                this.$validator.validateAll().then(noerrors => {
                    if (noerrors) {
                        localStorage.ZOHO_EMAIL = this.form.email;

                        this.$router.push('/');
                    }

                    return false;
                })
            },
        }
    }
</script>

<style>
</style>
