import { rootPath } from 'electron-root-path'

const darwinContent = (process.platform == 'darwin' && process.env.NODE_ENV != 'development') ? "/Contents" : ""

export default {
    config_file_path: rootPath + darwinContent + "/oauthkeys/bickert-timetracker.config.json",
    base_url: "https://accounts.zoho.com",
    url: {
        refresh_token: "/oauth/v2/token"
    }
}