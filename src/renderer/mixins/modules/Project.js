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
            if (!localStorage.ZOHO_PROJECTS || fetchFromApi) {
                return this.project_api.index().then(response => {
                    localStorage.ZOHO_PROJECTS = JSON.stringify(response.data.projects);
                    this.$store.commit("SET_PROJECTS", response.data.projects)
                    Log.success("Projects have been successfully fetched", true)
                }).catch(error => {
                    Log.error(error.response.data.message)
                });
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