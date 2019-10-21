import RestApiService from '@/services/RestApiService';
import moment from 'moment';
import _join from 'lodash/join';
import swal from 'sweetalert';

let Timelog = {
    methods: {
        recordTimelog(rawData) {
            let timelogData = this.getTimelogData(rawData);
            console.log("record timesheet to localstorage", rawData)
            localStorage.setItem('ZOHO_LAST_TIME_LOG', JSON.stringify(timelogData));
            return true;
        },
        pushTimelog(rawData) {
            let timelogData = this.getTimelogData(rawData);
            
            return new RestApiService('/portal/' + process.env.PORTAL_ID + "/projects/" + rawData.project_id + "/tasks/" + rawData.task_id + "/logs/")
                .save({ params: timelogData }, true)
                    .then(response => {
                        console.log(response)
                    }).catch(error => {
                        swal(error);
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
        }
    }
}

export default Timelog;