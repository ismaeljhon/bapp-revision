import RestApiService from '@/services/RestApiService';
import moment from 'moment-timezone';
import _join from 'lodash/join';
import _assign from 'lodash/assign';
import _find from 'lodash/find';
import swal from 'sweetalert';
import Log from '@/shared/Log';

let Timelog = {
    methods: {
        recordTimelog(rawData) {
            _assign(rawData, this.getTimelogData(rawData));
            localStorage.setItem('ZOHO_LAST_TIME_LOG', JSON.stringify(rawData));
            return true;
        },
        pushTimelog(rawData) {
            let timelogData = this.getTimelogData(rawData);

            let notes = timelogData.notes ? timelogData.notes + " - app generated" : "- app generated";
            timelogData.notes = notes;
            
            return new RestApiService('/portal/' + process.env.PORTAL_ID + "/projects/" + rawData.project_id + "/tasks/" + rawData.task_id + "/logs/")
                .save({ params: timelogData }, true)
                    .then(response => {
                        localStorage.ZOHO_LAST_TIME_LOG = '';
                    }).catch(error => {
                        Log.error(error.response.data.error.message);
                    });
        },
        getTimelogData(data) {
            let currentUser = this.getCurrentUser();
            let timeConsumed = data.timeConsumed.split(':');
            timeConsumed.pop();
            timeConsumed = timeConsumed.join(":");

            return {
                date: moment().format('MM-DD-YYYY'),
                owner: currentUser.id,
                hours: timeConsumed,
                bill_status: 'Billable',
                notes: data.notes
            };
        },
        checkPendingTimelogs() {
            let pendingTimelogs = localStorage.ZOHO_LAST_TIME_LOG;

            if(!pendingTimelogs) return false; 

            pendingTimelogs = JSON.parse(pendingTimelogs);
            let currentUser = this.getCurrentUser();

            if (currentUser.id == pendingTimelogs.owner) {
                swal({
                    title: "Unsaved Timelog",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    text: pendingTimelogs.project.name + "\n\n" + pendingTimelogs.task.name + "\n\n" + "Time Spent: " + pendingTimelogs.hours,
                    icon: "warning",
                    buttons: {
                        do_not_push: {
                            text: 'Do not Push',
                            value: false
                        },
                        push: {
                            text: 'Push Timelog',
                            value: true
                        }
                    },
                }).then((pushTimelog) => {
                    if (pushTimelog) {
                        this.pushTimelog(pendingTimelogs);
                    } else {
                        localStorage.ZOHO_LAST_TIME_LOG = '';
                    }
                }).catch(error => {
                    Log.error(error.response.data.error.message);
                });;
            }
        },
        fetchWeeklyTimelogs() {
            let params = {
                users_list: this.getCurrentUser().id,
                view_type: 'week',
                date: moment().format('MM-DD-YYYY'),
                bill_status: 'All',
                component_type: 'task'
            };

            return new RestApiService('/portal/' + process.env.PORTAL_ID + '/logs')
            .index(params)
                .then(response => {
                    let timelogs = response.data.timelogs || {};
                    localStorage.setItem('ZOHO_WEEKLY_TIMELOGS', JSON.stringify(timelogs));
                    this.$store.commit('SET_WEEKLY_TIMELOGS', timelogs)
                }).catch(error => {
                    Log.error(error.response.data.error.message);
                });;
        },
        getWeeklyTimelogs() {
            return JSON.parse(localStorage.ZOHO_WEEKLY_TIMELOGS);
        },
        fetchDailyTimelogs() {
            let params = {
                users_list: this.getCurrentUser().id,
                view_type: 'day',
                date: moment().tz('America/Edmonton').format('MM-DD-YYYY'),
                bill_status: 'All',
                component_type: 'task'
            };

            return new RestApiService('/portal/' + process.env.PORTAL_ID + '/logs')
            .index(params)
                .then(response => {
                    let timelogs = response.data.timelogs || {};
                    localStorage.setItem('ZOHO_DAILY_TIMELOGS', JSON.stringify(timelogs));
                    this.$store.commit('SET_DAILY_TIMELOGS', timelogs)
                }).catch(error => {
                    Log.error(error.response.data.error.message);
                });
        },
        getDailyTimelogs() {
            return JSON.parse(localStorage.ZOHO_DAILY_TIMELOGS);
        },
    }
}

export default Timelog;