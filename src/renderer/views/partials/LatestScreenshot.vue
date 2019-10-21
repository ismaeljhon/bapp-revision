<template>
    <b-card header="Latest Screenshot">
        <span>
            <v-lazy-image v-if="latestScreenshot" :src="latestScreenshot" alt="Latest Screenshot Image here" style="max-width: 100%"/>
        </span>
    </b-card>
</template>
<script>
import axios from 'axios';
import VLazyImagePlugin from "v-lazy-image";
import fs from 'fs';

export default {
    name: 'latest-screenshot',
    components: {
        "v-lazy-image": VLazyImagePlugin
    },
    computed: {
        latestScreenshot() {
            let latestScreenshot = this.$store.getters.SCREENSHOT.latest || localStorage.ZOHO_LATEST_SCREENSHOT || '';

            if (latestScreenshot) {
                latestScreenshot = 'file:\\\\' + latestScreenshot;
            }

            return latestScreenshot
        }
    }
}
</script>