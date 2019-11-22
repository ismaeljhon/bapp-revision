import { takeScreenshot } from "screenshot-monitor-capture";
const fs = require('fs');
import { rootPath } from 'electron-root-path';
import _find from 'lodash/find';
import _camelCase from 'lodash/camelCase';
import moment from 'moment-timezone';

let Screenshot = {
    methods: {
        async captureScreenshot() {
            let currentUser =  this.getCurrentUser();
            let screenshotFile = rootPath + "/screenshots/"+ _camelCase(currentUser.name) +"-" + moment().format('DDMMYYYY-hhmmss') + ".jpg";

            const data = await takeScreenshot("image/jpg");
            fs.writeFile(screenshotFile, data.buffer, (error) => {
                if (error) {
                    console.error(error);
                }
                this.$store.commit('SET_SCREENSHOT', { latest: screenshotFile });
            });
        },

        pushScreenshot() {
            console.log("Screenshot pushed");
        }
    }
};

export default Screenshot;