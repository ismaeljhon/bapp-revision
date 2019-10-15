<template>
    <b-card header="Login" header-tag="header" tag="article" class="mt-5">
        <b-form @submit.prevent="onSubmit">
            <b-form-group label="Email address:" description="Use your zoho email here" :invalid-feedback="veeErrors.first('email')" :state="!veeErrors.has('email')">
                <b-form-input v-model="form.email" name="email" v-validate="{ required: true, email: true }"></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary" :disabled="disableBtn">Start Working</b-button>
        </b-form>
    </b-card>
</template>

<script>
    import _find from 'lodash/find';
    export default {
        name: 'login',
        data() {
            return {
                form: {},
                users: [],
                disableBtn: false
            }
        },
        methods: {
            onSubmit(){
                this.$validator.validateAll().then(noerrors => {
                    if (noerrors) {
                        let users = this.getUsers();

                        if (_find(users, o => {
                            return o.email == this.form.email;
                        })) {
                            localStorage.ZOHO_EMAIL = this.form.email;
                            this.$router.push('/');
                        } else {
                            swal({
                                title: "Email not registered",
                                icon: 'warning',
                                dangerMode: true,
                            })
                        }
                    }

                    return false;
                })
            },
        },
        mounted: async function() {
            this.disableBtn = true;
            await this.fetchUsers();
            this.users = localStorage.ZOHO_USERS;
            this.disableBtn = false;
        }
    }
</script>

<style>
</style>
