<template>
    <b-modal :visible="showModal" @hidden="reset" title="Generate Timesheet" centered no-close-on-esc no-close-on-backdrop>
        <b-form-group label="View Type:">
            <b-form-select :options="viewTypeOptions" v-model="form.view_type"></b-form-select>
        </b-form-group>
        <b-form-group label="Select Date:">
            <date-picker format="MM-dd-yyyy" v-model="form.date" input-class="form-control"></date-picker>
        </b-form-group>
        <template slot="modal-footer">
            <b-button variant="primary" @click.prevent="processTimesheet">
                <font-awesome-icon icon="download"></font-awesome-icon> Generate and Download
            </b-button>
        </template>
    </b-modal>
</template>
<script>
import _assign from 'lodash/assign';
import moment from 'moment-timezone';
import Datepicker from 'vuejs-datepicker';

export default {
    name: 'timesheet-modal',
    components: {
        'date-picker': Datepicker
    },
    data() {
        return {
            showModal: false,
            form: {
                date: moment().format('MM-DD-YYYY'),
                view_type: 'week',
            },
            timesheet: [],
            viewTypeOptions: [
                { value: 'week', text: 'Weekly' },
                { value: 'day', text: 'Daily' }
            ]
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
                }
            });
        },
        async processTimesheet() {
            _assign(this.form, {
                date: moment(this.form.date).format('MM-DD-YYYY'),
                saveToLocalStorage: false
            })

            this.timesheet = await this.fetchWeeklyTimelogs(this.form)
        }
    }
}
</script>