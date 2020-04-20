<template>
    <b-modal title="Updating ZOHO API Keys" :visible="showModal" @hide="showModal = false" @hidden="reset" hide-footer centered no-close-on-esc no-close-on-backdrop :hide-header-close="item.forcedOpen">
        <b-alert show variant="danger">
            <font-awesome-icon icon="exclamation-circle" /> Updating API keys might break your access to ZOHO, please proceed with extra caution
        </b-alert>
        <b-form-group label="Zoho Client ID" description="Leave blank if you are not sure">
            <b-input v-model="form.ZOHO_CLIENT_ID"></b-input>
        </b-form-group>
        <b-form-group label="Zoho Client Secret" description="Leave blank if you are not sure">
            <b-input v-model="form.ZOHO_CLIENT_SECRET"></b-input>
        </b-form-group>
        <b-form-group label="Zoho Client Refresh Token" description="Leave blank if you are not sure">
            <b-input v-model="form.ZOHO_REFRESH_TOKEN"></b-input>
        </b-form-group>
        <b-form-group label="Zoho Portal ID" description="Leave blank if you are not sure">
            <b-input v-model="form.ZOHO_PORTAL_ID"></b-input>
        </b-form-group>
        <b-form-group label="Zoho People File Category ID" description="Leave blank if you are not sure">
            <b-input v-model="form.ZOHO_FILE_CAT_ID"></b-input>
        </b-form-group>
        <b-form-group label="Zoho Account Access Token V1" description="Leave blank if you are not sure">
            <b-input v-model="form.ZOHO_ACCESS_TOKEN_V1"></b-input>
        </b-form-group>
        <div class="float-right">
            <b-button v-if="!item.forcedOpen" class="mr-1" @click.prevent="showModal = false">Cancel</b-button>
            <b-button variant="success" @click.prevent="onSubmit">Save</b-button>
        </div>
    </b-modal>
</template>
<script>
import _assign from "lodash/assign"
import _forEach from 'lodash/forEach'
export default {
    name: 'update-api-keys-modal',
    data() {
        return {
            item: {},
            showModal: false,
            form: {
                ZOHO_CLIENT_ID: null,
                ZOHO_CLIENT_SECRET: null,
                ZOHO_REFRESH_TOKEN: null,
                ZOHO_PORTAL_ID: null,
                ZOHO_FILE_CAT_ID: null,
                ZOHO_ACCESS_TOKEN_V1: null
            }
        }
    },
    methods: {
        show(item = {}) {
            this.showModal = true
            this.item = item
        },
        reset() {
            _assign(this, {
                form: {
                    ZOHO_CLIENT_ID: null,
                    ZOHO_CLIENT_SECRET: null,
                    ZOHO_REFRESH_TOKEN: null,
                    ZOHO_PORTAL_ID: null,
                    ZOHO_FILE_CAT_ID: null,
                    ZOHO_ACCESS_TOKEN_V1: null
                }
            })
        },
        onSubmit() {
            swal({
                title: "Are you sure?",
                text: "Setting up wrong keys would break the application",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willUpdate) => {
                if (willUpdate) {
                    _forEach(this.apiKeysRequired, (keyValue) => {
                        if (this.form[keyValue]) {
                            localStorage[keyValue] = this.form[keyValue]
                        }
                    })

                    this.validateRequiredApiKeys()
                }
            })
        }
    }
}
</script>