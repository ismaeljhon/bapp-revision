import RestApiService from '@/services/RestApiService';
import moment from 'moment';
import _join from 'lodash/join';

let Timelog = {
    methods: {
        recordTimelog(data) {
            let currentUser = this.getCurrentUser();
            let timeConsumed = data.timeConsumed.split(':');
            timeConsumed.pop();
            timeConsumed = timeConsumed.join(":");

            let timelogData = {
                date: moment().format('MM-DD-YYYY'),
                owner: currentUser.id,
                hours: timeConsumed,
                bill_status: 'Billable',
                notes: data.notes
            };
            
            return new RestApiService('/portal/' + process.env.PORTAL_ID + "/projects/" + data.project_id + "/tasks/" + data.task_id + "/logs/")
                .save({ params: timelogData }, true)
                    .then(response => {
                        console.log(response)
                    });
        }, 
        pushTimelog() {

        }
    }
}

export default Timelog;