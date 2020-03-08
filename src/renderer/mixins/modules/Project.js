import RestApiService from '@/services/RestApiService.js';
import _filter from 'lodash/filter';
import Log from '@/shared/Log'

let Project = {
    data() {
        return {
            project_api: new RestApiService('/portal/' + process.env.PORTAL_ID + '/projects/')
        }
    },
    methods: {
        fetchProjects(fetchFromApi = false) {
            Log.info("Fetching Projects...", { processType: 'process' });

            if (!localStorage.ZOHO_PROJECTS || fetchFromApi) {
                Log.info("Fetching Projects from API...", { processType: 'request' });

                return this.project_api.index().then(response => {
                    localStorage.ZOHO_PROJECTS = JSON.stringify(response.data.projects);
                    this.$store.commit("SET_PROJECTS", response.data.projects)
                    Log.success("Projects have been successfully fetched from API", { withPrompt: true, timer: 1500, processType: 'response' })
                }).catch(error => {
                    Log.error(error.response.data.message, { processType: 'response' })
                });
            } else {
                Log.info("Projects have been successfully fetched from LocalStorage", { processType: 'process' });
            }

            this.$store.commit("SET_PROJECTS", this.getProjects());

            return true;
        },
        getProjects() {
            return JSON.parse(localStorage.ZOHO_PROJECTS);
        },

        fetchProjectTaskLists(fetchFromApi = false, params = {}) {
            Log.info("Fetching Projects Task Lists...", { processType: 'process' });

            if (!localStorage.ZOHO_PROJECT_TASK_LISTS || fetchFromApi) {
                Log.info("Fetching Projects Task Lists from API...", { processType: 'request' });

                if (!params.flag) {
                    params.flag = 'internal'
                }

                return new RestApiService('/portal/' + process.env.PORTAL_ID + '/projects/' + this.item.id + '/tasklists/').index({ flag: params.flag }).then(response => {
                    localStorage.ZOHO_PROJECT_TASK_LISTS = JSON.stringify(response.data.tasklists);
                    this.$store.commit("SET_PROJECT_TASK_LISTS", response.data.tasklists)
                    Log.success("Project Task Lists have been successfully fetched from API", { processType: 'response' })
                }).catch(error => {
                    Log.error(error.response.data.message, { processType: 'response' })
                });
            } else {
                Log.info("Project Task Lists have been successfully fetched from LocalStorage", { processType: 'process' });
            }

            this.$store.commit("SET_PROJECT_TASK_LISTS", this.getProjectTaskLists());

            return true;
        },
        getProjectTaskLists() {
            return JSON.parse(localStorage.ZOHO_PROJECT_TASK_LISTS);
        },
    }
};

export default Project;