import { rootPath } from 'electron-root-path'

export default {
    config_file_path: rootPath + "/oauthkeys/bickert-timetracker.config.json",
    base_url: "https://accounts.zoho.com",
    url: {
        refresh_token: "/oauth/v2/token"
    }
}