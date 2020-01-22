<template>
    <b-modal :visible="showModal" @hidden="reset" title="Generate Timesheet" centered no-close-on-esc no-close-on-backdrop>
        <b-form-group label="View Type:">
            <b-form-select :options="viewTypeOptions" v-model="form.view_type"></b-form-select>
        </b-form-group>
        <b-form-group label="Select Date:">
            <date-picker format="MM-dd-yyyy" v-model="form.date" input-class="form-control"></date-picker>
        </b-form-group>
        <template slot="modal-footer">
            <b-button v-if="!isTimesheetReady" variant="primary" @click.prevent="processTimesheet" :disabled="isLoading">
                <font-awesome-icon icon="sync"></font-awesome-icon> Generate Timesheet
            </b-button>
            <download-csv v-else class="btn btn-success" :data="json_data" name="timesheet">
                <font-awesome-icon icon="check"></font-awesome-icon> Your timesheet is ready... Click here to download.
            </download-csv>
        </template>
    </b-modal>
</template>
<script>
import _assign from 'lodash/assign';
import _forEach from 'lodash/forEach';
import moment from 'moment-timezone';
import Datepicker from 'vuejs-datepicker';
import JsonCSV from 'vue-json-csv'

export default {
    name: 'timesheet-modal',
    components: {
        'date-picker': Datepicker,
        downloadCsv: JsonCSV
    },
    data() {
        return {
            showModal: false,
            form: {
                date: moment().format('MM-DD-YYYY'),
                view_type: 'week',
            },
            timesheet: [],
            json_data: [],
            viewTypeOptions: [
                { value: 'week', text: 'Weekly' },
                { value: 'day', text: 'Daily' }
            ],
            isLoading: false,
            isTimesheetReady: false,
        }
    },
    methods: {
        show() {
            this.showModal = true
        },
        reset() {
            _assign(this, {
                showModal: false,
                form: {
                    date: moment().format('MM-DD-YYYY'),
                    view_type: 'week',
                },
                isTimesheetReady: false
            });
        },
        async processTimesheet() {
            _assign(this.form, {
                date: moment(this.form.date).format('MM-DD-YYYY'),
                doNotSaveToLocalStorage: true
            })
            
            this.isLoading = true;
            this.timesheet = await this.fetchWeeklyTimelogs(this.form);
            _forEach(this.timesheet.date, timelog => {
                let logObj = {
                    date: timelog.date
                };
                _forEach(timelog.tasklogs, log => {
                    _assign(logObj, {
                        'project_name': log.project ? log.project.name : '',
                        'task': log.task.name,
                        'hours': log.hours_display,
                        'cost': log.cost,
                        'from_to': (log.start_time && log.end_time) ? log.start_time + " - " + log.end_time : '-',
                        'task_list': log.task.name,
                        'owner': log.owner_name,
                        'billing_status': log.bill_status,
                        'approval_status': log.approval_status
                    })

                    this.json_data.push(logObj);
                })
            })
            this.isLoading = false;
            this.isTimesheetReady = true;
        }
    }
}
</script>