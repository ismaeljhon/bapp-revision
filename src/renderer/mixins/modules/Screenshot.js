import { takeScreenshot } from "screenshot-monitor-capture";
const fs = require('fs');
import { rootPath } from 'electron-root-path';
import moment from 'moment';
import _find from 'lodash/find';
import _camelCase from 'lodash/camelCase';

let Screenshot = {
    methods: {
        captureScreenshot() {
            let currentUser =  this.getCurrentUser();
            let screenshotFile = rootPath + "/screenshots/"+ _camelCase(currentUser.name) +"-" + moment().format('DDMMYYYY-hhmmss') + ".jpg";

            takeScreenshot("image/jpg").then((data) => {
                fs.writeFile(screenshotFile, data.buffer, (error) => {
                    if (error) {
                        console.error(error);
                    }

                    this.$store.commit('SET_SCREENSHOT', { latest: screenshotFile });
                });
            });
        },

        pushScreenshot() {
            
        }
    }
};

export default Screenshot;