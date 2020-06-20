<template>
    <b-card header="Login" header-tag="header" tag="article" class="mt-5">
        <b-form @submit.prevent="onSubmit">
            <b-form-group label="Email address:" description="Use your zoho email here" :invalid-feedback="veeErrors.first('email')" :state="!veeErrors.has('email')">
                <b-form-input v-model="form.email" name="email" v-validate="{ required: true, email: true }"></b-form-input>
            </b-form-group>
            <b-form-group label="Password:" description="Use your zoho password here" :invalid-feedback="veeErrors.first('password')" :state="!veeErrors.has('password')">
                <b-form-input type="password" v-model="form.password" name="password" v-validate="{ required: true }"></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Start Working</b-button>
        </b-form>
    </b-card>
</template>
<script>
import AuthenticationV1 from '@/helpers/AuthenticationV1';
import axios from 'axios';
import _find from 'lodash/find';
import Log from '@/shared/Log'

export default {
    name: 'login-v1',
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            messagesMapping: {
                INVALID_PASSWORD: 'Your password is invalid',
                INVALID_CREDENTIALS: 'Your credentials are invalid',
                NO_SUCH_USER: 'Account not found',
                EXCEEDED_MAXIMUM_ALLOWED_AUTHTOKENS: 'Your account exceeded the maximum allowed zoho account authentication token, kindly contact IT support for this matter'
            }
        }
    },
    methods: {
        onSubmit() {
            this.$validator.validateAll().then(async noerrors => {
                if (noerrors) {
                    let validateV1 = false;

                    Log.info("Logging in...", { processType: 'request' })
                    await axios({
                        url: 'https://accounts.zoho.com/apiauthtoken/nb/create',
                        method: 'POST',
                        params: {
                            SCOPE: 'Zohopeople/peopleapi',
                            EMAIL_ID: this.form.email,
                            PASSWORD: this.form.password,
                        }
                    }).then(response => {
                        let success = response.data.split("RESULT=");
                        success = success[1];

                        if (success.includes("FALSE")) {
                            let errorMsgCode = response.data.split("CAUSE=")[1].split("\n")[0];
                            let errorMsg = this.messagesMapping[errorMsgCode];
                            errorMsg = errorMsg ? errorMsg : errorMsgCode;
                            Log.error(response, { withPrompt: true, processType: 'response' });
                            return;
                        }

                        localStorage.ZOHO_ACCESS_TOKEN_V1 = response.data.split("AUTHTOKEN=")[1].split("\n")[0];
                        localStorage.ZOHO_EMAIL_V1 = this.form.email;

                        validateV1 = true;

                        Log.info("Login Success", { processType: 'process - login' })
                        return;
                    });
                    
                    if (!validateV1) {
                        return false
                    }

                    let users = this.getUsers();
                    let currentUser = _find(users, o => { return o.email == this.form.email });

                    if (currentUser) {
                        localStorage.ZOHO_CURRENT_USER = JSON.stringify(currentUser);
                        Log.info("Successfully login using email: " + currentUser.email, { processType: 'response' })
                        this.$router.push('/');
                    } else {
                        Log.warning('Email not Registered on any projects', { processType: 'response' })
                    }
                }
            });
        }
    },
}
</script>