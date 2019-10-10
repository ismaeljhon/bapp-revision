import RestApiService from '../services/RestApiService.js';
import _forEach from 'lodash/foreach';
import _filter from 'lodash/filter';

let User = {
    data() {
        return {
            project_api: new RestApiService('/portal/' + process.env.PORTAL_ID + '/projects/')
        }
    },
    methods: {
        getProjects(fetchFromApi = false) {
            if (!localStorage.ZOHO_PROJECTS || fetchFromApi) {
                this.project_api.index().then(response => {
                    localStorage.ZOHO_PROJECTS = JSON.stringify(response.data.projects);
                }).catch(error => {
                    // console.log(error);
                });
            }

            let projects = JSON.parse(localStorage.ZOHO_PROJECTS);

            this.$store.commit('SET_PROJECTS', projects);
            return projects;
        },
    }
};

export default User;