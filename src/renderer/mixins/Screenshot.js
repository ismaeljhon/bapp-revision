import { takeScreenshot, Data } from "screenshot-monitor-capture";
const fs = require('fs');
import { rootPath } from 'electron-root-path';
import moment from 'moment';

let Screenshot = {
    methods: {
        captureScreenshot() {
            takeScreenshot("image/png").then((data) => {
                fs.writeFile(rootPath + "/screenshots/-" + moment().format('DDMMYYYY-hhmmss') + ".jpg", data.buffer, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
            });
        }
    }
};

export default Screenshot;