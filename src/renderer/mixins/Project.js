import RestApiService from '../services/RestApiService.js';
import _forEach from 'lodash/foreach';
import _filter from 'lodash/filter';
import swal from 'sweetalert';

let User = {
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
                }).catch(error => {
                    swal(error)
                });
            }
            return true;
        },
        getProjects() {
            return JSON.parse(localStorage.ZOHO_PROJECTS);
        }
    }
};

export default User;