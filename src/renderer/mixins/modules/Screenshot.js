import { takeScreenshot } from "screenshot-monitor-capture";
const fs = require('fs');
import { rootPath } from 'electron-root-path';
import _find from 'lodash/find';
import _camelCase from 'lodash/camelCase';
import moment from 'moment-timezone';
import axios from 'axios';
import Log from '@/shared/Log'

let Screenshot = {
    methods: {
        async captureScreenshot() {
            console.log("capture", rootPath)
            let currentUser =  this.getCurrentUser();
            let screenshotFile = _camelCase(currentUser.name) +"-" + moment().format('DDMMYYYY-hhmmss') + ".jpg";
            let screenshotFilePath = rootPath + "/screenshots/"+ screenshotFile;

            const data = await takeScreenshot("image/jpg");
            fs.writeFile(screenshotFilePath, data.buffer, (error) => {
                if (error) {
                    console.error(error);
                }
                this.$store.commit('SET_SCREENSHOT', { latest: screenshotFilePath });
                
                console.log("write file")
                this.pushScreenshot(screenshotFile)
            });
        },

        async pushScreenshot(filename) {
            console.log("push")
            let screenshot = this.$store.getters.SCREENSHOT.latest;

            if (!screenshot) 
                return;

            let localScreenshotFile = 'file:\\\\' + screenshot;

            const axiosInstance = axios.create();

            axiosInstance.interceptors.request.use(
                config => {
                    config.headers['Authorization'] = '';
                    return config;
                },
                error => {
                    Promise.reject(error)
                }
            );

            await axiosInstance.get(localScreenshotFile, {
                responseType: 'blob',
            }).then(async (response) => {

                let employeeObj = JSON.parse(localStorage.ZOHO_CURRENT_USER_V1);

				// setting up the parameters needed for the POST request
				let formParams = {
					authtoken: localStorage.ZOHO_ACCESS_TOKEN_V1,
					catId: process.env.ZOHO_FILE_CAT_ID,
					confidential: 1,
					employeeId: employeeObj.recordId,
					fileName: filename,
					fileType: 0,
					isreportingTo: false,
				};

				let formData = new FormData();

				// transforming the default parameters to form-data
				for (let key in formParams) {
					formData.set(key, formParams[key]);
				}

				if (!response.data)
					return Log.error("Error on fetching the image blob");

				// translating the response data to BLOB object
				let imageBlob = new Blob([response.data]);

				// NOTE: Third Parameter (filename) is neccessary to be readable in ZOHO People File
				formData.append('uploadFile', imageBlob, filename);

				// pushing the file to ZOHO People Files
				await axiosInstance.post('https://people.zoho.com/people/api/files/uploadFileMultipart', formData, { 
                    headers: { 'Content-Type': 'multipart/form-data'} });

				Log.info("Screenshot ["+filename+"] successfully pushed");

			});
        },
    }
};

export default Screenshot;