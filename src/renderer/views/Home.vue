<template>
    <b-row>
        <b-col cols="12" class="mt-3">
            <b-form-group label="Project" :invalid-feedback="veeErrors.first('project')" :state="!veeErrors.has('project')">
                <v-select :disabled="$store.getters.TIMER_STARTED" label="name" :options="projects" v-model="form.project" placeholder="Select a Project" name="project" v-validate="{ required: true }" @input="getProjectTasks"></v-select>
            </b-form-group>
            <b-form-group label-for="task-list" label="Task" :invalid-feedback="veeErrors.first('task')" :state="!veeErrors.has('task')">
                <template slot="label">
                    <span>Task</span>
                    <div class="float-right" v-show="!$store.getters.TIMER_STARTED">
                        <a v-if="form.project" href="#" @click.prevent="$refs.taskFormModal.show(form.project)"><small><font-awesome-icon icon="plus"></font-awesome-icon> Add new task</small></a>
                    </div>
                </template>
                <v-select id="task-list" :disabled="$store.getters.TIMER_STARTED || isLoadingProjectTask" label="name" :options="tasks" v-model="form.task" placeholder="Pick a Task" name="task" v-validate="{ required: true }" @input="getSubTasks"></v-select>
            </b-form-group>
            <b-form-group v-if="form.task" label-for="sub-task">
                <template slot="label">
                    <span>Sub Task</span>
                    <div class="float-right" v-show="!$store.getters.TIMER_STARTED">
                        <a v-if="form.task" href="#" @click.prevent="$refs.subTaskFormModal.show(form)"><small><font-awesome-icon icon="plus"></font-awesome-icon> Add new sub task</small></a>
                    </div>
                </template>
                <v-select id="sub-task" :disabled="$store.getters.TIMER_STARTED || isLoadingProjectSubTask" label="name" :options="subTasks" v-model="form.subTask" placeholder="Pick a Sub Task"></v-select>
            </b-form-group>
            <b-form-group label="Notes">
                <b-form-textarea :disabled="$store.getters.TIMER_STARTED" v-model="form.notes" rows="3" max-rows="6"></b-form-textarea>
            </b-form-group>
        </b-col>
        <b-col cols="12">
            <b-button ref="timerButton" :variant="timerButtonVariant" :disabled="isLoading || !$store.getters.TIMER_READY" size="lg" @click.prevent="setupTimer" style="text-transform: uppercase">
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
            <timelog-summary />
        </b-col>

        <task-form-modal ref="taskFormModal" @saved="getProjectTasks(form.project)" />
        <sub-task-form-modal ref="subTaskFormModal" @saved="getProjectTasks(form.project); getSubTasks(form.task)" />
    </b-row>
</template>
<script>
import RestApiService from '../services/RestApiService.js';

import LatestScreenshot from './partials/LatestScreenshot.vue'
import TimelogSummary from './partials/TimelogSummary.vue';
import _filter from 'lodash/filter';
import _forEach from 'lodash/forEach';
import _find from 'lodash/find';
import _assign from 'lodash/assign'
import Log from '@/shared/Log'
import moment from 'moment-timezone'

import TaskFormModal from '@/views/modals/Task'
import SubTaskFormModal from '@/views/modals/SubTask'

export default {
    name: 'home',
    components: {
        'latest-screenshot': LatestScreenshot,
        'timelog-summary': TimelogSummary,
        TaskFormModal,
        SubTaskFormModal
    },
    data() {
        return {
            form: {
                project: null,
                project_id: '',
                task: '',
                task_id: '',
                timeConsumed: '',
                subTask: ''
            },
            tasks: [],
            subTasks: [],
            api: {
                project: new RestApiService('/portal/' + process.env.VUE_APP_PORTAL_ID + '/projects/')
            },
            recordTimelogtoLocaInterval: null,
            screenshotInterval: null,
            isLoading: false,
            isLoadingProjectTask: false,
            isLoadingProjectSubTask: false,
        }
    },
    methods: {
        setupTimer() {
            this.$validator.validateAll().then(async noerrors => {
                if (noerrors) {
                    this.$store.commit('SET_TIMER_STATUS');
                    if (this.$store.getters.TIMER_STARTED) {
                        this.startTimer();
                        
                        /** Save time started to local storage */
                        localStorage.ZOHO_TIME_STARTED = moment().format('MM-DD-YYYY HH:mm A');

                        this.captureScreenshot();

                        _assign(this.form, {
                            project_id: this.form.project.id,
                            task_id: this.form.task.id
                        });

                        /** Record Timesheet every 1 min */
                        this.recordTimelogtoLocaInterval = setInterval(function() {
                            let timeConsumed = this.getCurrentTimer();
                            this.form.timeConsumed = timeConsumed;
                            this.recordTimelog(this.form);
                        }.bind(this), 60000);

                        this.screenshotInterval = setInterval(async function() {
                            await this.captureScreenshot();
                        }.bind(this), 350000)
                    } else {
                        clearInterval(this.recordTimelogtoLocaInterval);
                        clearInterval(this.screenshotInterval);

                        this.recordTimelogtoLocaInterval = null;
                        this.screenshotInterval = null;

                        let timeConsumed = this.stopTimer();
                        this.form.timeConsumed = timeConsumed;

                        this.isLoading = true;
                        await this.pushTimelog(this.form);
                        this.isLoading = false;

                        await this.fetchWeeklyTimelogs();
                        await this.fetchDailyTimelogs();
                    }
                }
            });
        },
        async getProjectTasks(project) {

            _assign(this.form, {
                task: '',
                subTask: '',
            })

            if (project) {
                let currentUser = this.getCurrentZohoProjectUser();

                Log.info("getProjectTasks - Project ID:" + project.id, { processType: 'request' })
                this.isLoadingProjectTask = true

                await new RestApiService('/portal/' + process.env.VUE_APP_PORTAL_ID + '/projects/' + project.id + "/tasks/").index({ 
                    owner: currentUser.id, 
                    index: 0, 
                    range: 1000
                })
                .then(response => {
                    let tasks = [];

                    _forEach(response.data.tasks, task => {
                        if (!task.completed) {
                            tasks.push({
                                id: task.id_string,
                                name: task.name,
                                subTasksUrl: task.subtasks ? task.link.subtask.url : ''
                            })
                        }
                    })
                    this.tasks = tasks;

                    Log.info("Task successfuly fetched - Project ID:" + project.id, { processType: 'response' })

                }).catch(error => {
                    Log.error(error, { processType: 'response', customMessage: 'Error on fetching tasks per project' })
                })

                this.isLoadingProjectTask = false
            }
        },

        async getSubTasks(task){
            _assign(this.form, {
                subTask: '',
            });
            
            if (task) {
                this.isLoadingProjectSubTask = true

                let currentUser = this.getCurrentZohoProjectUser();
                await new RestApiService(task.subTasksUrl, true).index({ owner: currentUser.id }).then(response => {
                    let subTasks = [];
                    _forEach(response.data.tasks, task => {
                        if (!task.completed && task.details && task.details.owners && _find(task.details.owners, o => { return o.id == currentUser.id })) {
                            subTasks.push({
                                id: task.id_string,
                                name: task.name
                            })
                        } 
                    });
                    this.subTasks = subTasks;
                }).catch(error => {
                    Log.error(error, { processType: 'response', customMessage: 'Error on fetching sub tasks' });
                });

                this.isLoadingProjectSubTask = false
            }
        },

        setKeyboardShortcuts() {
            document.addEventListener('keyup', (e) => {
                if (e.ctrlKey) {
                    /** ctrl+p - manual screeshot */
                    if (e.keyCode == 80) {
                        this.captureScreenshot(true)
                    }
                    /** ctrl+s - stop timer */
                    if (e.keyCode == 83) {
                        this.setupTimer();
                    }
                }
            });
        }
    },
    computed: {
        timerButtonVariant() {
            if (this.isLoading)
                return 'warning'

            return this.timerButton[this.getCurrentTimerStatus].variant;
        },
        timerButtonText() {
            if (this.isLoading) 
                return "Saving..."

            return this.timerButton[this.getCurrentTimerStatus].text;
        },
        timerButtonIcon() {
            if (this.isLoading) 
                return 'save';

            return this.timerButton[this.getCurrentTimerStatus].icon;
        },
        projects() {
            let projects = [];
            let fetchedProject = this.$store.getters.PROJECTS || [];

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
        this.setKeyboardShortcuts();

        this.fetchProjects(true);
        this.fetchUsers();
        this.fetchWeeklyTimelogs();
        this.fetchDailyTimelogs();
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