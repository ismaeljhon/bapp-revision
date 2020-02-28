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
        async captureScreenshot(isManual = false) {
            Log.info("[Process] Capturing screenshot" + (isManual ? ' - manual': ''));

            let manualFilename = isManual ? "-manual" : "";
            let currentUser =  this.getCurrentUser();
            let screenshotFile = _camelCase(currentUser.name) +"-" + moment().format('DDMMYYYY-hhmmss') + manualFilename +".jpg";

            let prefix = process.platform == 'win32' ? process.env.ZOHO_SCREENSHOT_FOLDER : rootPath + "/screenshots/";
            let screenshotFilePath = prefix + screenshotFile;

            const data = await takeScreenshot("image/jpg");
            fs.writeFile(screenshotFilePath, data.buffer, (error) => {
                if (error) {
                    Log.error(error, { processType: 'error' });
                }

                Log.info("Screenshot successfully captured and saved " + screenshotFilePath, { processType: 'process' });

                this.$store.commit('SET_SCREENSHOT', { latest: screenshotFilePath });
                
                this.pushScreenshot(screenshotFile)
            });
        },

        async pushScreenshot(filename) {
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

            Log.info("Retrieving Screenshot from a local file", { processType: 'request' })

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
					return Log.error("Error on fetching the image blob", { processType: 'responst' });

				// translating the response data to BLOB object
				let imageBlob = new Blob([response.data]);

				// NOTE: Third Parameter (filename) is neccessary to be readable in ZOHO People File
                formData.append('uploadFile', imageBlob, filename);
                
                Log.info("Screenshot file successfully retrieved " + filename, { processType: 'response' });

                Log.info("Pushing Screenshot to Zoho People " + filename, { processType: 'request' });

				// pushing the file to ZOHO People Files
				await axiosInstance.post('https://people.zoho.com/people/api/files/uploadFileMultipart', formData, { 
                    headers: { 'Content-Type': 'multipart/form-data'} })
                    .then(response => {
                        Log.info("Screenshot ["+filename+"] successfully pushed", { processType: 'response' });
                    })
                    .catch(error => {
                        Log.error(error.response.data.response.errors.message, { processType: 'response' });
                    });
			});
        },
    }
};

export default Screenshot;