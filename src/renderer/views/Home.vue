<template>
    <b-row>
        <b-col cols="12" class="mt-3">
            <b-form-group label="Project" :invalid-feedback="veeErrors.first('project')" :state="!veeErrors.has('project')">
                <v-select :disabled="$store.getters.TIMER_STARTED" label="name" :options="projects" v-model="form.project" placeholder="Select a Project" name="project" v-validate="{ required: true }"></v-select>
            </b-form-group>
            <b-form-group label="Task" :invalid-feedback="veeErrors.first('task')" :state="!veeErrors.has('task')">
                <v-select :disabled="$store.getters.TIMER_STARTED" label="name" :options="tasks" v-model="form.task" placeholder="Pick a Task" name="task" v-validate="{ required: true }"></v-select>
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
                <strong>Today: </strong><span>{{ dailyTimeLogs }}</span>
                <br>
                <strong>This Week: </strong><span>{{ weeklyTimelogs }}</span>
            </b-card>
        </b-col>
    </b-row>
</template>
<script>
import RestApiService from '../services/RestApiService.js';
import AuthenticationV1 from '@/helpers/AuthenticationV1'

import LatestScreenshot from './partials/LatestScreenshot.vue'
import _filter from 'lodash/filter';
import _assign from 'lodash/assign';

export default {
    name: 'home',
    components: {
        'latest-screenshot': LatestScreenshot
    },
    data() {
        return {
            form: {
                project: '',
                project_id: '',
                task: '',
                task_id: '',
                timeConsumed: ''
            },
            weeklyTimelogs: '',
            dailyTimeLogs: '',
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

                        _assign(this.form, {
                            project_id: this.form.project.id,
                            task_id: this.form.task.id
                        });

                        /** Record Timesheet every 1 min */
                        this.recordTimelogtoLocaInterval = setInterval(function() {
                            let timeConsumed = this.getCurrentTimer();
                            this.form.timeConsumed = timeConsumed;
                            this.recordTimelog(this.form);
                        }.bind(this), 350000);

                        this.screenshotInterval = setInterval(async function() {
                            await this.captureScreenshot();
                        }.bind(this), 350000)
                    } else {
                        let timeConsumed = this.stopTimer();
                        this.form.timeConsumed = timeConsumed;

                        await this.pushTimelog(this.form);

                        clearInterval(this.recordTimelogtoLocaInterval);
                        clearInterval(this.screenshotInterval);
                    }
                }
            });
        },

        getProjectTasks(projectId) {
            new RestApiService('/portal/' + process.env.PORTAL_ID + '/projects/' + projectId + "/tasks/").index().then(response => {
                let tasks = [];
                response.data.tasks.forEach(task => {
                    if (!task.completed) {
                        tasks.push({
                            id: task.id_string,
                            name: task.name,
                        })
                    }
                })
                this.tasks = tasks;
            })
        },

        setWeeklyTimelogs() {
            let weeklyTimelogs = this.getWeeklyTimelogs();
            this.weeklyTimelogs = weeklyTimelogs.grandtotal ? this.customHourFormat(weeklyTimelogs.grandtotal) : '0h 0m'
        },
        setDailyTimelogs() {
            let dailyTimeLogs = this.getDailyTimelogs();
            this.dailyTimeLogs =  dailyTimeLogs.grandtotal ? this.customHourFormat(dailyTimeLogs.grandtotal) : '0h 0m';
        }
    },
    watch: {
        "form.project": function(project) {
            this.getProjectTasks(project.id);
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

            fetchedProject.forEach(project => {
                projects.push({
                    id: project.id_string,
                    name: project.name,
                    status: project.status
                })
            })

            return projects;
        },
    },
    async mounted() {
        clearInterval(this.recordTimelogtoLocaInterval);
        clearInterval(this.screenshotInterval);

        if (!process.env.ZOHO_ACCESS_TOKEN_V1) {
            Log.error("No Authentication V1 key set, please reach out for some help")
            return false;
        }
        new AuthenticationV1().validate();

        await this.fetchWeeklyTimelogs();
        await this.fetchDailyTimelogs();
        this.setWeeklyTimelogs();
        this.setDailyTimelogs();
    }
}
</script>
<style>
    .swal-footer {
        background-color: rgb(245, 248, 250);
        margin-top: 32px;
        border-top: 1px solid #E9EEF1;
        overflow: hidden;
    }
    .swal-footer .swal-button-container {
        float: left;
    }
    .swal-footer .swal-button-container:nth-child(2) {
        float: right
    }
    .swal-button--do_not_push, 
    .swal-button--do_not_push:hover {
        color: #fff;
        background-color: #dc3545 !important;
    }
</style>