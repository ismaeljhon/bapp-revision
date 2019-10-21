<template>
    <b-row>
        <b-col cols="12" class="mt-3">
            <b-form-group label="Project" :invalid-feedback="veeErrors.first('project')" :state="!veeErrors.has('project')">
                <v-select :disabled="$store.getters.TIMER_STARTED" label="name" :reduce="project => project.id" :options="projects" v-model="form.project_id" placeholder="Select a Project" name="project" v-validate="{ required: true }"></v-select>
            </b-form-group>
            <b-form-group label="Task" :invalid-feedback="veeErrors.first('task')" :state="!veeErrors.has('task')">
                <v-select :disabled="$store.getters.TIMER_STARTED" label="name" :reduce="task => task.id" :options="tasks" v-model="form.task_id" placeholder="Pick a Task" name="task" v-validate="{ required: true }"></v-select>
            </b-form-group>
            <b-form-group label="Notes">
                <b-form-textarea :disabled="$store.getters.TIMER_STARTED" v-model="form.notes" rows="3" max-rows="6"></b-form-textarea>
            </b-form-group>
        </b-col>
        <b-col cols="12">
            <b-button :variant="timerButtonVariant" size="lg" @click.prevent="setupTimer" style="text-transform: uppercase">
                <font-awesome-icon :icon="timerButtonIcon" class="mr-2" />{{ timerButtonText }}
            </b-button>
            <span class="ml-2" v-show="$store.getters.TIMER_STARTED">{{ time }}</span>
            <b-button variant="info" class="float-right mt-2" size="sm" v-b-tooltip title="Take Screenshot Now" @click.prevent="captureScreenshot">
                <font-awesome-icon icon="camera" class="" />
            </b-button>
        </b-col>
        <b-col cols="6" class="mt-4">
            <latest-screenshot ref="latestScreenshot" />
        </b-col>
        <b-col cols="6" class="mt-4">
            <b-card header="Work Summary">
                <strong>Today: </strong><span>8h 00m</span>
                <br>
                <strong>This Week: </strong><span>40h 00m</span>
            </b-card>
        </b-col>
    </b-row>
</template>
<script>
import RestApiService from '../services/RestApiService.js';

import LatestScreenshot from './partials/LatestScreenshot.vue'

import _forEach from 'lodash/foreach';
import _filter from 'lodash/filter';

export default {
    name: 'home',
    components: {
        'latest-screenshot': LatestScreenshot
    },
    data() {
        return {
            form: {
                project_id: '',
                task_id: '',
                timeConsumed: ''
            },
            tasks: [],
            api: {
                project: new RestApiService('/portal/' + process.env.PORTAL_ID + '/projects/')
            },
            recordTimelogtoLocaInterval: null,
            screenshotInterval: null,
        }
    },
    methods: {
        setupTimer() {
            this.$validator.validateAll().then(async noerrors => {
                if (noerrors) {
                    this.$store.commit('SET_TIMER_STATUS');
                    if (this.$store.getters.TIMER_STARTED) {
                        this.startTimer();

                        /** Record Timesheet every 1 min */
                        this.recordTimelogtoLocaInterval = setInterval(function() {
                            let timeConsumed = this.getCurrentTimer();
                            this.form.timeConsumed = timeConsumed;
                            this.recordTimelog(this.form);
                        }.bind(this), 60000);

                        this.screenshotInterval = setInterval(async function() {
                            await this.captureScreenshot();
                            await this.pushScreenshot();
                        }.bind(this), 60000)
                    } else {
                        let timeConsumed = this.stopTimer();
                        console.log("stopped", timeConsumed);
                        this.form.timeConsumed = timeConsumed;
                        
                        await this.pushTimelog(this.form);

                        localStorage.ZOHO_LAST_TIME_LOG = '';
                        clearInterval(this.recordTimelogtoLocaInterval);
                        clearInterval(this.screenshotInterval);
                    }
                }
            });
        },

        getProjectTasks(projectId) {
            new RestApiService('/portal/' + process.env.PORTAL_ID + '/projects/' + projectId + "/tasks/").index().then(response => {
                let tasks = [];

                _forEach(response.data.tasks, task => {
                    if (!task.completed) {
                        tasks.push({
                            id: task.id_string,
                            name: task.name,
                        })
                    }
                });
                this.tasks = tasks;
            })
        }
    },
    watch: {
        "form.project_id": function(projectId) {
            this.getProjectTasks(projectId);
            
        }
    },
    computed: {
        timerButtonVariant() {
            return this.timerButton[this.getCurrentTimerStatus].variant;
        },
        timerButtonText() {
            return this.timerButton[this.getCurrentTimerStatus].text;
        },
        timerButtonIcon() {
            return this.timerButton[this.getCurrentTimerStatus].icon;
        },
        projects() {
            let projects = [];
            let fetchedProject = this.getProjects();

            _forEach(fetchedProject, project => {
                projects.push({
                    id: project.id_string,
                    name: project.name,
                    status: project.status
                })
            });

            return projects;
        },
    },
    mounted() {
        clearInterval(this.recordTimelogtoLocaInterval);
        clearInterval(this.screenshotInterval);
    }
}
</script>
<style scoped>

</style>