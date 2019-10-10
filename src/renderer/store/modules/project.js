const state = {
    PROJECTS: [],
    TASKS_PER_PROJECT: [],
}
  
const mutations = {
    SET_PROJECTS: (state, projects) => {
        state.PROJECTS = projects;
    },
    SET_TASKS_PER_PROJECT: (state, tasks) => {
        state.TASKS_PER_PROJECT = tasks;
    }
}

const getters = {
    PROJECTS: state => state.PROJECTS,
    TASKS_PER_PROJECT: state => state.TASKS_PER_PROJECT,
}
  
export default {
    state,
    mutations,
    getters
}
  