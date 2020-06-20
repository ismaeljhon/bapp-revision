import RestApiService from '@/services/RestApiService.js';
import _filter from 'lodash/filter';
import Log from '@/shared/Log'

let Project = {
    data() {
        return {
            project_api: new RestApiService('/portal/' + process.env.VUE_APP_PORTAL_ID + '/projects/'),
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
                    Log.error(error, { processType: 'response', customMessage: error.response.data.message})
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

        async fetchProjectTaskLists(fetchFromApi = false, params = {}) {
            Log.info("Fetching Projects Task Lists...", { processType: 'process' });

            if (!localStorage.ZOHO_PROJECT_TASK_LISTS || fetchFromApi) {
                let projectTasklists = [];

                Log.info("Fetching Internal Projects Task Lists from API...", { processType: 'request' });
                params.flag = "internal";
                await this.projectTasklistsApi.index({ flag: params.flag }).then(response => {
                    projectTasklists = _.union(projectTasklists, this.beautifyTaskListName(response.data.tasklists, params))
                })

                Log.info("Fetching External Projects Task Lists from API...", { processType: 'request' });
                params.flag = "external";
                await this.projectTasklistsApi.index({ flag: params.flag }).then(response => {
                    projectTasklists = _.union(projectTasklists, this.beautifyTaskListName(response.data.tasklists, params))
                    Log.success("Project Task Lists have been successfully fetched from API", { processType: 'response' })
                }).catch(error => {
                    Log.error(error, { processType: 'response', customMessage: error.response.data.message + " - external task list" })
                });

                localStorage.ZOHO_PROJECT_TASK_LISTS = JSON.stringify(projectTasklists);

            } else {
                Log.info("Project Task Lists have been successfully fetched from LocalStorage", { processType: 'process' });
            }

            this.$store.commit("SET_PROJECT_TASK_LISTS", this.getProjectTaskLists());
            return true;
        },
        getProjectTaskLists() {
            return JSON.parse(localStorage.ZOHO_PROJECT_TASK_LISTS);
        },
        beautifyTaskListName(data, params) {
            _.forEach(data, o => {
                o.name = o.name + " (" + _.capitalize(params.flag) + ")"
            })
            return data;
        }
    },
    computed: {
        projectTasklistsApi() {
            return new RestApiService('/portal/' + process.env.VUE_APP_PORTAL_ID + '/projects/' + this.item.id + '/tasklists/')
        }
    }
};

export default Project;