const state = {
    PROJECTS: [],
    PROJECT_TASK_LISTS: [],
    TASKS_PER_PROJECT: [],
}
  
const mutations = {
    SET_PROJECTS: (state, projects) => {
        state.PROJECTS = projects;
    },
    SET_PROJECT_TASK_LISTS: (state, project_task_lists) => {
        state.PROJECT_TASK_LISTS = project_task_lists;
    },
    SET_TASKS_PER_PROJECT: (state, tasks) => {
        state.TASKS_PER_PROJECT = tasks;
    }
}

const getters = {
    PROJECTS: state => state.PROJECTS,
    TASKS_PER_PROJECT: state => state.TASKS_PER_PROJECT,
    PROJECT_TASK_LISTS: state => state.PROJECT_TASK_LISTS
}
  
export default {
    state,
    mutations,
    getters
}
  