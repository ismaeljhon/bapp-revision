import fs from 'fs'
import OauthService from '@/services/OauthService'
import Log from '@/shared/Log'

export default class OauthFileHandler {
    constructor(serviceType) {
        this.serviceType = serviceType
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

        Log.info("Token Validated: " + isTokenValid, { processType: 'process' })

        return fileExists && fileHasValidTokens && isTokenValid
    }

    checkFile() {
        var fileExists = fs.existsSync(this.configFile);

        if (fileExists) {
            this.fileToVariable()
        }

        Log.info(this.serviceType + " Oauth File Exist: " + fileExists, { processType: 'process' })
        
        return fileExists;
    }

    fileToVariable(filePath = null) {
        let content = '';
        Log.info('Reading ' + this.serviceType + ' oauth file', { processType: 'process' });

        let file = filePath ? filePath : this.configFile
        try {
            content = fs.readFileSync(file);
            this.jsonFileContents = JSON.parse(content);
        } catch(err) {
            Log.error(err, { processType: 'process', customMessage: 'Error reading ' + this.serviceType + ' JSON File' });
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
        
        Log.info('Required fields: ' + requiredKeys.join(', ') + " - " + valid, { processType: 'process' })

        return valid;
    }

    saveToFile(fileContents) {
        let contents = fileContents ? fileContents : this.jsonFileContents
        return fs.writeFile(this.configFile, JSON.stringify(contents), function (err) {
            if (err) throw err;
            Log.success(this.serviceType + " oauth file replaced ", { withPrompt: true, processType: 'process' })
        });
    }
}