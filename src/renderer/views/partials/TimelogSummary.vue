<template>
    <b-card header="Work Summary">
        <strong>Today: </strong><span>{{ dailyTimeLogs }}</span>
        <br>
        <strong>This Week: </strong><span>{{ weeklyTimelogs }}</span>
        <br>
        <small class="mt-2 d-block">Zoho Projects Time Zone: <br>Edmonton, AB, Canada (GMT-7)</small>
    </b-card>
</template>
<script>
import moment from 'moment-timezone';
export default {
    name: 'timelog-summary',
    computed: {
        weeklyTimelogs() {
            let weeklyTimelogs = this.$store.getters.WEEKLY_TIMELOGS || [];
            return weeklyTimelogs.grandtotal ? this.customHourFormat(weeklyTimelogs.grandtotal) : '0h 0m';
        },
        dailyTimeLogs() {
            let dailyTimeLogs = this.$store.getters.DAILY_TIMELOGS || [];
            return dailyTimeLogs.grandtotal ? this.customHourFormat(dailyTimeLogs.grandtotal) : '0h 0m';
        }
    },
    mounted() {
        console.log(moment.tz.guess())
    }
}
</script>