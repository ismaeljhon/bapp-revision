<template>
    <div class="oauth-handler-modal" v-if="showTokenModal">
        <div class="the-modal">
            <h4>OAuth Handler</h4>
            <b-form @submit.prevent="onSubmit()" enctype="multipart/form-data" method="post">
                <div class="form-body">
                    <b-form-file
                        v-model="file"
                        :state="Boolean(file)"
                        placeholder="Choose a file or drop it here..."
                        drop-placeholder="Drop file here..."
                        accept="application/JSON">
                    </b-form-file>
                    <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
                </div>
                <div class="form-feet">
                    <b-button variant="primary" type="submit">Upload JSON file</b-button>
                    <b-button variant="success">Ask for Help</b-button>
                </div>
            </b-form>
        </div>
    </div>
</template>

<script>

import axios from 'axios'
import { rootPath } from 'electron-root-path';

export default {
    data() {
        return {
            file: null,
            configFile: rootPath+"/src/config.json",
            message: "OMG you are trapped",
            showTokenModal: true,
            fileExists: false,
            tokenInvalid: true,
            jsonFileContents: false
        }
    },
    mounted: function() {
        console.log('root Path', rootPath);
        this.initTokenHandler();
    },
    methods: {
        async validateTokens() {
            var returnValue = false;

            await axios.post(process.env.VUE_APP_ACCOUNTS_API + '/oauth/v2/token?grant_type=refresh_token&refresh_token=' + this.jsonFileContents.refresh_token + '&client_id=' + this.jsonFileContents.client_id + '&client_secret=' + this.jsonFileContents.client_secret
                )
                    .then(res => {
                        if (res.status === 201 || res.status === 200) {
                            returnValue = true;
                        }
                    })
            return returnValue;
        },
        hasTokens() {
            var returnValue = false;

            if (this.jsonFileContents.refresh_token && this.jsonFileContents.client_id && this.jsonFileContents.client_secret) {
                returnValue = true
            }

            if (returnValue) {
                alert('tokens found');
            } else {
                alert('tokens not found');
            }

            return returnValue;
        },
        checkFile() {
            const fs = require('fs');
            var returnValue = false;

            try {
                if (fs.existsSync(this.configFile)) {
                    console.log("The file exists.");
                    this.fileToVariable();
                    returnValue = true;
                } else {
                   returnValue = false; 
                }
            } catch(err) {
                console.error(err);
                returnValue = false;
            }

            if (returnValue) {
                alert('file exists');
            } else {
                alert('file doesn\'t exist');
            }
            return returnValue;
        },
        fileToVariable() {
            const fs = require('fs');
            let content = '';
            console.log('current file path when fileToVariable is fired: ', this.configFile);
            try {
                content = fs.readFileSync(this.configFile);
                this.jsonFileContents = JSON.parse(content);
            } catch(err) {
                console.log('Error reading JSON File', err);
            }
        },
        initTokenHandler() {
            console.log('run init');
            if (this.checkFile()) {
                console.log('checking file: file exists');
                if (this.hasTokens()) {
                    if (this.validateTokens()) {
                        alert('valid tokens. yehey!');
                        this.showTokenModal = false;
                    } else {
                        this.showTokenModal = true;
                    }
                } else {
                    this.showTokenModal = true;
                }
            } else {
                this.showTokenModal = true;
            }
        },
        onSubmit() {
            const fs = require('fs');
            this.configFile = this.file.path;
            const tempFile = rootPath+'/src/config.json';
            this.fileToVariable();
            fs.writeFile(tempFile, JSON.stringify(this.jsonFileContents), function (err) {
                if (err) throw err;
                console.log('Replaced!');
            });
            this.configFile = tempFile;
            this.initTokenHandler();
        }
    }
}

</script>

<style lang="scss">

.oauth-handler-modal {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;

    .the-modal {
        background-color: #fff;
        width: 500px;
        max-width: 95%;
        max-height: 95%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 5px;

        h4 {
            padding: 20px;
            border-bottom: 1px #ccc solid;
        }
        .form-body {
            padding: 20px;
        }
        .form-feet {
            padding: 20px;
            border-top: 1px #ccc solid;
        }
    }
}

</style>