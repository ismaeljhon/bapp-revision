const state = {
    weekly_timelogs: [],
    daily_timelogs: [],
}

const mutations = {
    SET_WEEKLY_TIMELOGS: (state, weekly_timelogs) => {
        state.weekly_timelogs = weekly_timelogs;
    },
    SET_DAILY_TIMELOGS: (state, daily_timelogs) => {
        state.daily_timelogs = daily_timelogs;
    },
}

const getters = {
    WEEKLY_TIMELOGS: state => state.weekly_timelogs,
    DAILY_TIMELOGS: state => state.daily_timelogs,
}
  
export default {
    state,
    mutations,
    getters
}
  