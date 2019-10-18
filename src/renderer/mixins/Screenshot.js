import { takeScreenshot, Data } from "screenshot-monitor-capture";
const fs = require('fs');
import { rootPath } from 'electron-root-path';
import moment from 'moment';
import _find from 'lodash/find';
import _replace from 'lodash/replace';

let Screenshot = {
    methods: {
        captureScreenshot() {
            let users = JSON.parse(localStorage.ZOHO_USERS);
            let currentUser =  _find(users, o => {
                return o.email == localStorage.ZOHO_EMAIL;
            });

            takeScreenshot("image/png").then((data) => {
                fs.writeFile(rootPath + "/screenshots/"+ _replace(currentUser.name, ' ', '') +"-" + moment().format('DDMMYYYY-hhmmss') + ".jpg", data.buffer, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
            });
        }
    }
};

export default Screenshot;