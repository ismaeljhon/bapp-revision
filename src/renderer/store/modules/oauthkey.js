const state = {
    HAS_OAUTH_KEY_ERROR: false
}
  
const mutations = {
    SET_OAUTH_KEY_ERROR: (state, hasOauthKeyError) => {
        state.HAS_OAUTH_KEY_ERROR = hasOauthKeyError;
    }
}

const getters = {
    HAS_OAUTH_KEY_ERROR: state => state.HAS_OAUTH_KEY_ERROR,
}
  
export default {
    state,
    mutations,
    getters
}
  