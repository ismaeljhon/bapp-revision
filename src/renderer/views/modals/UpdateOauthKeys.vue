<template>
    <b-modal :visible="showModal || $store.getters.HAS_OAUTH_KEY_ERROR" @hide="showModal = false" @hidden="reset" no-close-on-backdrop :hide-header-close="$store.getters.HAS_OAUTH_KEY_ERROR" no-close-on-esc centered hide-footer title="Update keys">
        <b-alert variant="danger" show v-show="$store.getters.HAS_OAUTH_KEY_ERROR">It seems there is a problem with your authentication keys</b-alert>
        <b-form @submit.prevent="onSubmit" enctype="multipart/form-data" method="post">
            <b-form-group label="Application">
                <b-select v-model="form.oauthApplication" :options="oauthApplicationOptions"></b-select>
            </b-form-group>
            <b-form-group>
                <template slot="label">
                    File Config <small>(json file)</small>
                    <div class="float-right">
                        <small><a href="#" @click.prevent="redirectToOauthHandlerLink">Get your file config here</a></small>
                    </div>
                </template>      
                <b-form-file
                    v-model="form.file"
                    :state="Boolean(form.file)"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                    accept="application/JSON">
                </b-form-file>
                <div class="mt-5">
                    <b-button variant="info">Ask for Help</b-button>
                    <b-button variant="primary" type="submit" class="float-right" :disabled="isLoading">Import JSON file</b-button>
                </div>
            </b-form-group>
        </b-form>
    </b-modal>
</template>
<script>
import _assign from 'lodash/assign'
import { rootPath } from 'electron-root-path'
import OauthFileHandler from '@/shared/oauth/OauthFileHandler'
import OauthService from '@/services/OauthService'

export default {
    name: 'update-oauth-keys-modal',
    data() {
        return {
            isLoading: false,
            showModal: false,
            form: {
                file: null,
                oauthApplication: 'bickert-timetracker',
            },
            oauthApplicationOptions: [
                { value: 'bickert-timetracker', text: 'Bickert TimeTracker App'}
            ],
            oauthHandlerType: {
                'bickert-timetracker': 'zoho'
            },
            oauthFileHandler: null,
        }
    },
    methods: {
        show() {
            this.showModal = true
        },
        reset() {
            _assign(this, {
                isLoading: false,
                form: {
                    file: null,
                }
            })
        },
        redirectToOauthHandlerLink() {
            let link = "https://bickertoauthhandler-713530616.development.zohocatalyst.com/app/#/authorize"
            let params = {
                type: this.oauthHandlerType[this.form.oauthApplication]
            }
            require("electron").shell.openExternal(link + "?" + require('querystring').stringify(params));
        },
        async onSubmit() {
            this.isLoading = true
            let valid = await this.oauthFileHandler.validateConfigFile(this.form.file.path)

            this.$store.commit('SET_OAUTH_KEY_ERROR', !valid)

            if (valid) {
                this.oauthFileHandler.saveToFile()
                this.showModal = false
                location.reload()
            }

            this.isLoading = false
        },
    },
    mounted() {
        this.oauthFileHandler = new OauthFileHandler(this.form.oauthApplication)
    }
}
</script>