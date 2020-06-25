import fs from 'fs'
import OauthService from '@/services/OauthService'

export default class OauthFileHandler {
    constructor(serviceType) {
        this.config = require('@/config/' + serviceType + ".oauth.js").default
        this.configFile = this.config.config_file_path
        this.jsonFileContents = {}
    }
    async validateConfigFile(file = null) {
        let fileExists = await this.checkFile()
        
        let configFile = file ? file : this.configFile
        this.fileToVariable(configFile)
        
        let fileHasValidTokens = await this.fileHasTokens()

        let isTokenValid = await new OauthService(this.config, this.jsonFileContents).validateTokens()

        console.log(isTokenValid)

        return fileExists && fileHasValidTokens && isTokenValid
    }

    checkFile() {
        var fileExists = fs.existsSync(this.configFile);

        if (fileExists) {
            this.fileToVariable()
        }

        console.log("file exists:", fileExists)
        
        return fileExists;
    }

    fileToVariable(filePath = null) {
        let content = '';
        console.log('current file path when fileToVariable is fired: ', this.configFile);

        let file = filePath ? filePath : this.configFile
        try {
            content = fs.readFileSync(file);
            this.jsonFileContents = JSON.parse(content);
        } catch(err) {
            console.log('Error reading JSON File', err);
        }
    }

    getKeys() {
        return this.jsonFileContents
    }

    fileHasTokens() {
        let valid = true
        let requiredKeys = ['refresh_token', 'client_id', 'client_secret']
        const _forEach = require('lodash/forEach')

        _forEach(requiredKeys, key => {
            if (!this.jsonFileContents[key]) {
                valid = false
                return
            }
        })
        console.log("required fields present: ", this.jsonFileContents, valid)
        return valid;
    }

    saveToFile(fileContents) {
        let contents = fileContents ? fileContents : this.jsonFileContents
        return fs.writeFile(this.configFile, JSON.stringify(contents), function (err) {
            if (err) throw err;
            console.log('Replaced!');
        });
    }
}