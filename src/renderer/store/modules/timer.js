const state = {
    timer_started: false
}
  
const mutations = {
    SET_TIMER_STATUS: (state) => {
        state.timer_started = !state.timer_started;
    }
}

const getters = {
    TIMER_STARTED: state => state.timer_started,
}
  
export default {
    state,
    mutations,
    getters
}
  