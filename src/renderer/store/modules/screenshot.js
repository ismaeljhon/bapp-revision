import _assign from 'lodash/assign';

const state = {
    screenshot: {}
}
  
const mutations = {
    SET_SCREENSHOT: (state, screenshot) => {
        _assign(state.screenshot, screenshot);
    }
}

const getters = {
    SCREENSHOT: state => state.screenshot,
}
  
export default {
    state,
    mutations,
    getters
}
  