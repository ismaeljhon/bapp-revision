<template>
    <b-modal :visible="showModal" @hide="showModal = false" title="Settings" centered no-close-on-backdrop>
        <b-form-checkbox
            id="checkbox-1"
            v-model="notification"
            name="checkbox-1"
            :value="true"
            :unchecked-value="false"
        >
            Enable Screenshot Notification
        </b-form-checkbox>
        <template slot="modal-footer">
            <p v-if="alert_messages.if_success" class="bmi-alert-message">Settings Saved.</p>
            <b-button @click.prevent="onSubmit" variant="success">Save</b-button>
        </template>
    </b-modal>
</template>

<script>

import settingsJSON from "@/config/settings.json"
import { rootPath } from 'electron-root-path';
import fs from 'fs'

export default {
    name: 'settings-modal',
    data() {
        return {
            showModal: false,
            isLoading: false,
            settings: {},
            notification: false,
            alert_messages: {
                if_success: false
            }
        }
    },
    mounted() {
        this.getSettings();
    },
    methods: {
        show() {
            this.showModal = true
        },
        getSettings() {
            this.settings = settingsJSON;
            this.notification = this.settings.screenshot_notification;
        },
        saveSettings() {
            this.settings.screenshot_notification = this.notification

            return fs.writeFile(rootPath+"/src/renderer/config/settings.json", JSON.stringify(this.settings), function (err) {
                if (err) throw err;
            });
        },
        onSubmit() {
            this.isLoading = true;
            this.alert_messages.if_success = true;
            setTimeout(() => {
                this.alert_messages.if_success = false;
            }, 3000);
            this.saveSettings();
            console.log(this.notification);
        }
    }
}

</script>

<style lang="scss" scoped>

.bmi-alert-message {
    padding: 10px;
    display: inline-block;
    vertical-align: middle;
    font-size: 80%;
    margin-bottom: 0;
    line-height: 1;
}

</style>