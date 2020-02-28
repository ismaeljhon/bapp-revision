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
            Log.info("Fetching Projects...");

            if (!localStorage.ZOHO_PROJECTS || fetchFromApi) {
                Log.info("[Request] Fetching Projects from API...");

                return this.project_api.index().then(response => {
                    localStorage.ZOHO_PROJECTS = JSON.stringify(response.data.projects);
                    this.$store.commit("SET_PROJECTS", response.data.projects)
                    Log.success("[Response] Projects have been successfully fetched from API", { withPrompt: true, timer: 1500 })
                }).catch(error => {
                    Log.error("[Response]" + error.response.data.message)
                });
            } else {
                Log.info("Projects have been successfully fetched from LocalStorage");
            }

            this.$store.commit("SET_PROJECTS", this.getProjects());

            return true;
        },
        getProjects() {
            return JSON.parse(localStorage.ZOHO_PROJECTS);
        }
    }
};

export default Project;