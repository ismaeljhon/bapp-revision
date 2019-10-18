import _assign from 'lodash/assign';

const state = {
    screenshot: {
        latest: ''
    }
}
  
const mutations = {
    SET_SCREENSHOT: (state, screenshot) => {
        _assign(state.screenshot, screenshot);

        if (screenshot.latest) {
            localStorage.setItem('LATEST_SCREENSHOT', screenshot.latest);
        }
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
  