const state = {
    timer_started: false,
    timerReady: true,
}
  
const mutations = {
    SET_TIMER_STATUS: (state) => {
        state.timer_started = !state.timer_started;
    },
    SET_TIMER_READY: (state) => {
        state.timerReady = !state.timerReady;
    },
}

const getters = {
    TIMER_STARTED: state => state.timer_started,
    TIMER_READY: state => state.timerReady,
}
  
export default {
    state,
    mutations,
    getters
}
  