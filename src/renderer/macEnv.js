require('dotenv').config()
import _assign from 'lodash/assign';

if (process.platform == 'darwin') {
    _assign(process.env, {
        CLIENT_ID: "1000.H8F5G75AY3UV17784XQFSJOPWBPRUH",
        CLIENT_SECRET: "f25a253551409c60702c4de0e91836e6b7a93b7a75",
        REFRESH_TOKEN: "1000.a5eb5bbb1eb0918f24532ac568dfa6c3.2617d3e1e0447ebb6c1e755c0edf3fe7",
        PORTAL_ID: 682614917,
        PROJECTS_API: "https://projectsapi.zoho.com/restapi",
        ACCOUNTS_API: "https://accounts.zoho.com",
        ZOHO_FILE_CAT_ID: 488783000000782001,
        ZOHO_ACCESS_TOKEN_V1: "7129b2a596b04a67d45e913ea3fbaa46",  
    })
}